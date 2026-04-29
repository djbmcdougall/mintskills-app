import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { purchaseSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      listings ( title, slug, category, delivery_model )
    `)
    .eq('buyer_id', user.id)
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

  const parsed = purchaseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { listing_id, licence_tier } = parsed.data

  // Verify listing exists and is verified
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, price, currency, status, creator_id')
    .eq('id', listing_id)
    .eq('status', 'verified')
    .single()

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found or unavailable' }, { status: 404 })
  }

  // TODO: Alain creates Stripe PaymentIntent here
  // transfer_data.destination = creator stripe_account_id (fetch from users table)
  // application_fee_amount = Math.round(listing.price * 0.20) pence (20% platform cut)
  // metadata: { listing_id, buyer_id: user.id, licence_tier }
  // const paymentIntent = await stripe.paymentIntents.create({ ... })
  // return NextResponse.json({ clientSecret: paymentIntent.client_secret, purchaseId: ... }, { status: 201 })

  return NextResponse.json(
    {
      clientSecret: 'stub_pending_stripe',
      purchaseId: 'stub',
      note: 'Stripe integration pending — Alain to implement',
    },
    { status: 201 }
  )
}
