import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Verify purchase belongs to this buyer
  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('id, buyer_id, listing_id, licence_tier, status')
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single()

  if (purchaseError || !purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  if (purchase.status !== 'completed') {
    return NextResponse.json({ error: 'Purchase not completed' }, { status: 402 })
  }

  if (purchase.licence_tier === 'embed') {
    return NextResponse.json(
      { error: 'Embed-tier purchases do not include a source download' },
      { status: 403 }
    )
  }

  // TODO: generate Supabase Storage pre-signed URL, 60-second expiry
  // const { data: signedUrl } = await supabaseAdmin.storage
  //   .from('listing-files')
  //   .createSignedUrl(`${purchase.listing_id}/source.zip`, 60)
  // return NextResponse.json({ url: signedUrl.signedUrl })

  return NextResponse.json({
    url: 'stub — Alain implements pre-signed URL',
    note: 'Supabase Storage pre-signed URL generation pending',
  })
}
