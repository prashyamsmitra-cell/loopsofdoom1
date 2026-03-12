import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyticsRatelimit } from '@/lib/ratelimit'
import { AnalyticsSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const { success } = await analyticsRatelimit.limit(ip)
    
    if (!success) {
      // Return 200 to fail silently as requested for analytics
      return NextResponse.json({ success: false, reason: 'rate_limited' })
    }

    const body = await request.json()
    const validatedData = AnalyticsSchema.parse(body)

    // Fire-and-forget insert
    supabase.from('analytics_events').insert([validatedData]).then(({ error }) => {
      if(error) console.error('Analytics Insert Error:', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Analytics failures are silent
    console.error('Analytics Route Error:', error)
    return NextResponse.json({ success: false }) 
  }
}
