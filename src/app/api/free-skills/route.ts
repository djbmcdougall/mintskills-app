import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { freeSkillQuerySchema } from '@/lib/validations'

interface ErrorResponse { error: string; details?: unknown }

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl
  const parsed = freeSkillQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() } satisfies ErrorResponse,
      { status: 400 }
    )
  }

  const { category, search, sort, page, pageSize } = parsed.data
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('free_skills')
    .select('*', { count: 'exact' })

  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  switch (sort) {
    case 'indexed_at':
      query = query.order('indexed_at', { ascending: false })
      break
    case 'stars':
    default:
      query = query.order('github_stars', { ascending: false })
      break
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    skills: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
  })
}
