import { z } from 'zod'

// ─── Listings ────────────────────────────────────────────────────────────────

export const listingSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(2000),
  category: z.string().min(1),
  price: z.number().int().min(0).max(100000), // pence
  currency: z.literal('GBP').default('GBP'),
  delivery_model: z.enum(['embed', 'source', 'extended']),
  tags: z.array(z.string().max(40)).max(10).default([]),
  platforms: z.array(z.string()).max(10).default([]),
  readme_url: z.string().url().optional(),
})

export const listingQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['trending', 'newest', 'installs', 'rating']).default('trending'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  free: z.coerce.boolean().default(false),
})

export const listingUpdateSchema = listingSchema.partial()

// ─── Purchases ───────────────────────────────────────────────────────────────

export const purchaseSchema = z.object({
  listing_id: z.string().uuid(),
  licence_tier: z.enum(['embed', 'source', 'extended']),
})

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  listing_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(10).max(2000).optional(),
})

// ─── Skill Requests ──────────────────────────────────────────────────────────

export const requestSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(1000),
  category: z.string().optional(),
  bounty_gbp: z.number().int().min(0).max(10000).optional(),
})

export const requestQuerySchema = z.object({
  sort: z.enum(['upvotes', 'newest', 'fulfilled']).default('upvotes'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// ─── Tokens ──────────────────────────────────────────────────────────────────

export const tokenSchema = z.object({
  purchase_id: z.string().uuid(),
  domain_allowlist: z.array(z.string().max(253)).max(20).default([]),
  expires_at: z.string().datetime().optional(),
})

export const tokenUpdateSchema = z.object({
  domain_allowlist: z.array(z.string().max(253)).max(20),
})

// ─── Violations ──────────────────────────────────────────────────────────────

export const violationSchema = z.object({
  listing_id: z.string().uuid(),
  evidence_url: z.string().url(),
  description: z.string().max(2000).optional(),
})

// ─── Admin ───────────────────────────────────────────────────────────────────

export const rejectSchema = z.object({
  reason: z.string().min(10).max(1000),
})

// ─── Free skills query ────────────────────────────────────────────────────────

export const freeSkillQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['stars', 'indexed_at']).default('stars'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
})

// ─── Shared helpers ───────────────────────────────────────────────────────────

export type ListingInput = z.infer<typeof listingSchema>
export type ListingUpdateInput = z.infer<typeof listingUpdateSchema>
export type ListingQuery = z.infer<typeof listingQuerySchema>
export type PurchaseInput = z.infer<typeof purchaseSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type RequestInput = z.infer<typeof requestSchema>
export type RequestQuery = z.infer<typeof requestQuerySchema>
export type TokenInput = z.infer<typeof tokenSchema>
export type TokenUpdateInput = z.infer<typeof tokenUpdateSchema>
export type ViolationInput = z.infer<typeof violationSchema>
export type RejectInput = z.infer<typeof rejectSchema>
export type FreeSkillQuery = z.infer<typeof freeSkillQuerySchema>
