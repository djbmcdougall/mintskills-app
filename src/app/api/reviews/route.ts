import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reviewSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function GET(request: NextRequest): Promise<NextResponse> {
  const listing_id = request.nextUrl.searchParams.get('listing_id')

  if (!listing_id) {
    return NextResponse.json(
      { error: 'listing_id query parameter is required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, rating, body, created_at,
      users ( full_name, username, avatar_url )
    `)
    .eq('listing_id', listing_id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { listing_id, rating, body: reviewBody } = parsed.data

  // Verify buyer has purchased this listing
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('listing_id', listing_id)
    .eq('buyer_id', user.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) {
    return NextResponse.json(
      { error: 'You must purchase this skill before leaving a review' },
      { status: 403 }
    )
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      listing_id,
      buyer_id: user.id,
      rating,
      body: reviewBody,
    })
    .select()
    .single()

  if (error) {
    // Unique constraint violation — already reviewed
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You have already reviewed this listing' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
