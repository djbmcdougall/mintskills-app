import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tokenSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('embed_tokens')
    .select(`
      *,
      purchases (
        listing_id,
        listings ( title, slug )
      )
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

  const parsed = tokenSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { purchase_id, domain_allowlist, expires_at } = parsed.data

  // Verify purchase belongs to this buyer and is completed
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('id, buyer_id, listing_id, licence_tier, status')
    .eq('id', purchase_id)
    .eq('buyer_id', user.id)
    .single()

  if (purchaseError || !purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  if (purchase.status !== 'completed') {
    return NextResponse.json({ error: 'Purchase not completed' }, { status: 402 })
  }

  if (purchase.licence_tier === 'source') {
    return NextResponse.json(
      { error: 'Source-tier licences do not include embed tokens' },
      { status: 403 }
    )
  }

  // TODO: generate RS256 signed JWT with payload:
  // { buyer_id: user.id, listing_id: purchase.listing_id, domain_allowlist, exp: expires_at }
  // const token = await signJwt(payload, process.env.JWT_PRIVATE_KEY)

  const { data, error } = await supabase
    .from('embed_tokens')
    .insert({
      purchase_id,
      buyer_id: user.id,
      listing_id: purchase.listing_id,
      domain_allowlist,
      expires_at: expires_at ?? null,
      active: true,
      token: 'stub_pending_jwt_implementation',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
