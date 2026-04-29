import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const isAdmin = (user.user_metadata?.role as string | undefined) === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('id, status')
    .eq('id', id)
    .single()

  if (fetchError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.status === 'verified') {
    return NextResponse.json({ error: 'Listing already approved' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('listings')
    .update({
      status: 'verified',
      mint_verified_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // TODO: trigger watermark injection and fingerprint provisioning pipeline
  // await mintVerifiedQueue.add({ listing_id: id })

  return NextResponse.json(data)
}
