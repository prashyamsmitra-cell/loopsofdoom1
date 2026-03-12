import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { chatRatelimit } from '@/lib/ratelimit'
import { MatchSchema } from '@/lib/validators'
import { anthropic } from '@/lib/anthropic'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await chatRatelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const body = await request.json()
    const { query, session_id } = MatchSchema.parse(body)

    // Check feature flag
    const { data: flag } = await supabase
      .from('feature_flags')
      .select('enabled')
      .eq('flag_name', 'smart_contact_enabled')
      .single()

    if (flag && !flag.enabled) {
       return NextResponse.json(
        { error: 'Smart Contact form is currently disabled', code: 'FEATURE_DISABLED' },
        { status: 503 }
      )
    }

    // Get all projects for context
    const { data: projects } = await supabase
      .from('projects')
      .select('id, title, description, tech_stack, tags, category')

    const systemPrompt = `You are a portfolio assistant. Given the recruiter's requirements, recommend the 2-3 most relevant projects from the list below. For each recommendation, state the project name, why it matches, and what specific skills it demonstrates. Be concise and direct. Format as a numbered list.
    
    Available Projects:
    ${JSON.stringify(projects, null, 2)}`

    // Log the contact event asynchronously
    supabase.from('analytics_events').insert([{
      event_type: 'contact_submitted',
      session_id,
      metadata: { query }
    }]).catch(err => console.error('Failed to log contact event:', err));

    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: query }],
    })

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                controller.enqueue(new TextEncoder().encode(chunk.delta.text))
              }
            }
          } catch (e) {
            console.error('Match Stream error:', e)
          } finally {
            controller.close()
          }
        }
      }),
      { headers: { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' } }
    )
  } catch (error) {
    console.error('Match API Error:', error)
    return NextResponse.json({ error: 'Failed to match projects' }, { status: 500 })
  }
}
