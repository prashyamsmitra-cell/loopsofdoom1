import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ratelimit } from '@/lib/ratelimit'
import { CreateProjectSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ projects: data })
  } catch (error) {
    console.error('Projects GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await ratelimit.limit(ip)
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })
    }

    // Auth check - owner only
    const session = await auth()
    if (!session?.user || (session.user as any).github_id !== process.env.NEXT_PUBLIC_OWNER_GITHUB_ID) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateProjectSchema.parse(body)

    const { data, error } = await supabase
      .from('projects')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (error) {
    console.error('Projects POST Error:', error)
    return NextResponse.json({ error: 'Invalid request or server error' }, { status: 500 })
  }
}
