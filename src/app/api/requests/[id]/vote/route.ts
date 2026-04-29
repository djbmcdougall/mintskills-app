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

  // Insert vote — if duplicate, the unique constraint fires; handle gracefully
  const { error } = await supabase
    .from('skill_request_votes')
    .insert({ request_id: id, voter_id: user.id })

  if (error) {
    if (error.code === '23505') {
      // Already voted — idempotent, return 200
      return NextResponse.json({ voted: true, note: 'Already voted' })
    }
    if (error.code === '23503') {
      // FK violation — request doesn't exist
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Increment denormalised upvote_count
  await supabase.rpc('increment_request_votes', { request_id: id })

  return NextResponse.json({ voted: true }, { status: 201 })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { error } = await supabase
    .from('skill_request_votes')
    .delete()
    .eq('request_id', id)
    .eq('voter_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Decrement denormalised upvote_count
  await supabase.rpc('decrement_request_votes', { request_id: id })

  return new NextResponse(null, { status: 204 })
}
