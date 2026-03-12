import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ratelimit } from '@/lib/ratelimit'
import { UpdateProjectSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note: Route params are async in Next.js 15+
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const id = (await params).id;

    // Fetch the project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    // Increment view_count in background (fire-and-forget)
    supabase.rpc('increment_project_views', { project_id: id }).then()

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project GET Error:', error)
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const session = await auth()
    if (!session?.user || (session.user as any).github_id !== process.env.NEXT_PUBLIC_OWNER_GITHUB_ID) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const id = (await params).id;
    const body = await request.json()
    const validatedData = UpdateProjectSchema.parse(body)

    const { data: project, error } = await supabase
      .from('projects')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project PUT Error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const session = await auth()
    if (!session?.user || (session.user as any).github_id !== process.env.NEXT_PUBLIC_OWNER_GITHUB_ID) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const id = (await params).id;
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Project DELETE Error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
