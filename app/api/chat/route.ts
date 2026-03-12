import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { chatRatelimit } from '@/lib/ratelimit'
import { ChatSchema } from '@/lib/validators'
import { anthropic } from '@/lib/anthropic'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await chatRatelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const body = await request.json()
    const { project_id, messages, session_id } = ChatSchema.parse(body)

    // Check feature flag
    const { data: flag } = await supabase
      .from('feature_flags')
      .select('enabled')
      .eq('flag_name', 'ai_chat_enabled')
      .single()

    if (flag && !flag.enabled) {
      return NextResponse.json(
        { error: 'AI chat is currently disabled', code: 'FEATURE_DISABLED' },
        { status: 503 }
      )
    }

    // Get project context
    const { data: project } = await supabase
      .from('projects')
      .select('title, ai_system_prompt')
      .eq('id', project_id)
      .single()

    if (!project || !project.ai_system_prompt) {
      return NextResponse.json({ error: 'Project AI context not found' }, { status: 404 })
    }

    const systemPrompt = `You are an AI assistant representing ${project.title}, a project built by the developer.
Speak in first person as if you are the developer talking about their own work.
Be honest, casual, and specific. Don't be corporate or use buzzwords.
Only discuss this project and the developer's experience building it.
If asked something unrelated, politely redirect back to the project.

Project context:
${project.ai_system_prompt}`

    // Call Anthropic API
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022', // Updated to latest Claude 3.5 Sonnet
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    // Prepare exactly as requested in specifications
    const response = new Response(
      new ReadableStream({
        async start(controller) {
          let fullResponse = ''
          try {
            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                const text = chunk.delta.text
                fullResponse += text
                controller.enqueue(new TextEncoder().encode(text))
              }
            }

            // Async background update - DO NOT await here to keep response fast
            ;(async () => {
              try {
                await Promise.all([
                  supabase.rpc('increment_project_chat_count', { project_id }),
                  supabase.from('ai_chat_sessions').upsert({
                    project_id,
                    session_id,
                    messages: [...messages, { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() }],
                    updated_at: new Date().toISOString()
                  }, { onConflict: 'session_id' })
                ])
              } catch (err) {
                console.error('Failed to update chat session background:', err)
              }
            })()

          } catch (streamError) {
             console.error('Stream error:', streamError)
          } finally {
             controller.close()
          }
        }
      }),
      { headers: { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' } }
    )

    return response
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 })
  }
}
