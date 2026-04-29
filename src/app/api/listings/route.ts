import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listingSchema, listingQuerySchema } from '@/lib/validations'

interface ListingsResponse {
  listings: unknown[]
  total: number
  page: number
  pageSize: number
}

interface ErrorResponse {
  error: string
  details?: unknown
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ListingsResponse | ErrorResponse>> {
  const { searchParams } = request.nextUrl
  const parsed = listingQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { category, search, sort, page, pageSize, free } = parsed.data
  const supabase = await createClient()

  const table = free ? 'free_skills' : 'listings'
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from(table).select('*', { count: 'exact' })

  if (!free) {
    query = query.eq('status', 'verified')
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'installs':
      query = query.order('install_count', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'trending':
    default:
      // TODO: implement trending score (installs in last 7 days weighted by recency)
      query = query.order('install_count', { ascending: false })
      break
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    listings: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  })
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<{ id: string } | ErrorResponse>> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = listingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...parsed.data,
      creator_id: user.id,
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // TODO: trigger Mint Verified pipeline after file confirmed uploaded

  return NextResponse.json({ id: data.id }, { status: 201 })
}
