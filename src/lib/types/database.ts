export interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'creator' | 'admin'
  stripe_account_id: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string
  category: string
  price: number
  currency: string
  platform_compatibility: string[]
  tags: string[]
  file_url: string | null
  render_entry_point: string | null
  delivery_model: 'embed' | 'source_download' | 'extended_commercial'
  status: 'draft' | 'pending_review' | 'verified' | 'rejected' | 'suspended'
  mint_verified_at: string | null
  verified_report_url: string | null
  watermark_hash: string | null
  fingerprint_seed: string | null
  mcp_pool_eligible: boolean
  downloads_count: number
  embed_count: number
  mcp_pool_usage_count: number
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  buyer_id: string
  listing_id: string
  stripe_payment_id: string
  amount: number
  platform_fee: number
  creator_payout: number
  licence_tier: 'embed' | 'source' | 'extended'
  licence_key: string
  buyer_fingerprint: string | null
  status: 'completed' | 'refunded'
  created_at: string
}

export interface Install {
  id: string
  purchase_id: string
  listing_id: string
  buyer_id: string
  host: string
  repo_context_hash: string | null
  installed_at: string
}

export interface EmbedToken {
  id: string
  purchase_id: string
  buyer_id: string
  listing_id: string
  token: string
  domain_allowlist: string[]
  active: boolean
  revoked_at: string | null
  last_used_at: string | null
  use_count: number
  created_at: string
  expires_at: string | null
}

export interface Review {
  id: string
  buyer_id: string
  listing_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface FreeSkill {
  id: string
  repo_url: string
  title: string
  description: string
  category: string
  stars: number
  last_updated: string
  author: string
  indexed_at: string
}

export interface VerificationReport {
  id: string
  listing_id: string
  status: 'pass' | 'warning' | 'fail'
  checks_run: Record<string, unknown>
  issues_found: Record<string, unknown>
  binary_detected: boolean
  postinstall_scripts_found: boolean
  suspicious_patterns: Record<string, unknown>
  base64_strings_found: boolean
  dependency_issues: Record<string, unknown>
  watermark_injected: boolean
  fingerprint_provisioned: boolean
  watermark_signature: string | null
  created_at: string
}

export interface LicenceViolation {
  id: string
  listing_id: string
  reported_by: string
  evidence_url: string
  watermark_match: boolean
  matched_licence_key: string | null
  fingerprint_match: boolean
  matched_buyer_fingerprint: string | null
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  created_at: string
}

export interface SkillRequest {
  id: string
  posted_by: string
  title: string
  description: string
  category: string
  suggested_price_gbp: number | null
  upvote_count: number
  status: 'open' | 'in_progress' | 'fulfilled'
  fulfilled_listing_id: string | null
  created_at: string
  updated_at: string
}

export interface SkillRequestVote {
  id: string
  request_id: string
  voter_id: string
  created_at: string
}
