import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase'
import { ratelimit } from '@/lib/ratelimit'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
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

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Basic validation
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
       return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP allowed.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
       return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const ext = file.type.split('/')[1]
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`

    // Use service role to bypass RLS for uploads from the owner
    const supabaseAdmin = getServiceRoleClient()

    const { data, error } = await supabaseAdmin.storage
      .from('project-images')
      .upload(filename, file, { contentType: file.type })

    if (error) throw error

    // Get public URL using standard client as it doesn't require admin
    const { data: { publicUrl } } = supabaseAdmin.storage.from('project-images').getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
