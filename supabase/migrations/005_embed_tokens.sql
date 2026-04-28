CREATE TABLE public.embed_tokens (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id    uuid        NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  buyer_id       uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id     uuid        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  -- Signed RS256 JWT validated by the render API
  token          text        NOT NULL,
  domain_allowlist text[]    NOT NULL DEFAULT '{}',
  active         boolean     NOT NULL DEFAULT true,
  revoked_at     timestamptz,
  last_used_at   timestamptz,
  use_count      integer     NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  expires_at     timestamptz
);

ALTER TABLE public.embed_tokens ENABLE ROW LEVEL SECURITY;

-- Buyers can view and manage their own embed tokens
CREATE POLICY "Buyers view own tokens" ON public.embed_tokens
  FOR SELECT USING (auth.uid() = buyer_id);

-- Buyers can update their tokens (domain allowlist, revoke)
CREATE POLICY "Buyers update own tokens" ON public.embed_tokens
  FOR UPDATE USING (auth.uid() = buyer_id);

-- Token generation and revocation-on-refund handled server-side
CREATE POLICY "Service role full access" ON public.embed_tokens
  USING (auth.role() = 'service_role');

-- Token must be globally unique — used as the primary lookup key by the render API
CREATE UNIQUE INDEX embed_tokens_token_idx      ON public.embed_tokens (token);

CREATE INDEX embed_tokens_buyer_id_idx   ON public.embed_tokens (buyer_id);
CREATE INDEX embed_tokens_listing_id_idx ON public.embed_tokens (listing_id);
CREATE INDEX embed_tokens_active_idx     ON public.embed_tokens (active) WHERE active = true;
