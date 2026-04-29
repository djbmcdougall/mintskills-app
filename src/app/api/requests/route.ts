import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requestSchema, requestQuerySchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const parsed = requestQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 400 }
    )
  }

  const { sort, page, pageSize } = parsed.data
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('skill_requests')
    .select('*, users ( full_name, username )', { count: 'exact' })

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'fulfilled':
      query = query.eq('status', 'fulfilled').order('fulfilled_at', { ascending: false })
      break
    case 'upvotes':
    default:
      query = query.order('upvote_count', { ascending: false })
      break
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ requests: data ?? [], total: count ?? 0, page, pageSize })
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

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('skill_requests')
    .insert({ ...parsed.data, requester_id: user.id, status: 'open', upvote_count: 0 })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
