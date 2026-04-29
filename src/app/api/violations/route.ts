import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { violationSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = violationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const supabase = await createClient()

  // Verify listing exists
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id')
    .eq('id', parsed.data.listing_id)
    .single()

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Optionally attach reporter identity if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('violations')
    .insert({
      ...parsed.data,
      reporter_id: user?.id ?? null,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
