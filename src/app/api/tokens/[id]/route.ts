import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tokenUpdateSchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

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

  const { data: token, error: fetchError } = await supabase
    .from('embed_tokens')
    .select('id, buyer_id, active')
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single()

  if (fetchError || !token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  if (!token.active) {
    return NextResponse.json({ error: 'Token already revoked' }, { status: 409 })
  }

  const { error } = await supabase
    .from('embed_tokens')
    .update({ active: false, revoked_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: token, error: fetchError } = await supabase
    .from('embed_tokens')
    .select('id, buyer_id, active')
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single()

  if (fetchError || !token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 })
  }

  if (!token.active) {
    return NextResponse.json({ error: 'Cannot update a revoked token' }, { status: 409 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = tokenUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('embed_tokens')
    .update({ domain_allowlist: parsed.data.domain_allowlist })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
