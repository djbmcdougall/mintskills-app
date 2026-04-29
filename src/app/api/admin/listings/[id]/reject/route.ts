import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rejectSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function POST(
  request: NextRequest,
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

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = rejectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { data: listing, error: fetchError } = await supabase
    .from('listings')
    .select('id, status, creator_id')
    .eq('id', id)
    .single()

  if (fetchError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('listings')
    .update({
      status: 'rejected',
      rejection_reason: parsed.data.reason,
      rejected_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // TODO: send rejection email via Resend to listing creator
  // await resend.emails.send({
  //   from: 'noreply@mintskills.ai',
  //   to: creatorEmail,
  //   subject: 'Your MintSkills submission was not approved',
  //   react: RejectionEmail({ reason: parsed.data.reason }),
  // })

  return NextResponse.json(data)
}
