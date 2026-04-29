import { NextResponse } from 'next/server'

// TODO: ALAIN — full implementation required
// Verify Stripe signature: stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
//
// Handle payment_intent.succeeded:
//   - Create purchase record (status: 'completed')
//   - Generate licence_key as UUID (crypto.randomUUID())
//   - Generate buyer_fingerprint STUB:
//     // TODO: HMAC-SHA256(fingerprint_seed, purchase_id+buyer_id) per INSTALL-HOOK-SPEC.md
//   - Send confirmation email via Resend (stub the template call)
//
// Handle payment_intent.payment_failed:
//   - Update purchase status to 'failed'
//   - Log for investigation
//
// Handle account.updated:
//   - Update creator stripe_account_status in users table
//
// See /docs/PRD_v5.md Section 8 for the full payment flow
//
// IMPORTANT: Must use NextRequest with { bodyUsed: false } to get raw body for
// Stripe signature verification — do NOT call request.json() before constructEvent.
// Example:
//   const rawBody = await request.text()
//   const sig = request.headers.get('stripe-signature') ?? ''
//   const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)

export async function POST() {
  return NextResponse.json(
    { received: true, note: 'stub — Alain implements full webhook handler' },
    { status: 200 }
  )
}
