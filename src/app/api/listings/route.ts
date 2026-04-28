import { NextResponse } from 'next/server'

// TODO: Implement listing creation — requires Supabase service-role, file upload to
// private storage, and Mint Verification queue. Alain to wire up.
export async function POST() {
  return NextResponse.json({ success: true })
}
