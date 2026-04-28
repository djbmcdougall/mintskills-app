CREATE TABLE public.listings (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title                text        NOT NULL,
  slug                 text        NOT NULL,
  description          text        NOT NULL,
  category             text        NOT NULL,
  price                numeric(10,2) NOT NULL CHECK (price >= 0),
  currency             text        NOT NULL DEFAULT 'GBP',
  platform_compatibility text[]    NOT NULL DEFAULT '{}',
  tags                 text[]      NOT NULL DEFAULT '{}',
  file_url             text,
  render_entry_point   text,
  delivery_model       text        NOT NULL CHECK (delivery_model IN ('embed','source_download','extended_commercial')),
  status               text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_review','verified','rejected','suspended')),
  mint_verified_at     timestamptz,
  verified_report_url  text,
  watermark_hash       text,
  fingerprint_seed     text,
  mcp_pool_eligible    boolean     NOT NULL DEFAULT false,
  downloads_count      integer     NOT NULL DEFAULT 0,
  embed_count          integer     NOT NULL DEFAULT 0,
  mcp_pool_usage_count integer     NOT NULL DEFAULT 0,
  rating_avg           numeric(3,2) NOT NULL DEFAULT 0,
  rating_count         integer     NOT NULL DEFAULT 0,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read verified listings (public browse)
CREATE POLICY "Verified listings are publicly visible" ON public.listings
  FOR SELECT USING (status = 'verified');

-- Creators can read all their own listings regardless of status
CREATE POLICY "Creators view own listings" ON public.listings
  FOR SELECT USING (auth.uid() = creator_id);

-- Creators can insert new listings (must set themselves as creator)
CREATE POLICY "Creators insert own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own listings
CREATE POLICY "Creators update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = creator_id);

-- Creators can delete their own listings
CREATE POLICY "Creators delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = creator_id);

-- Service role bypasses all restrictions (verification pipeline, admin)
CREATE POLICY "Service role full access" ON public.listings
  USING (auth.role() = 'service_role');

-- Unique slug across all listings
CREATE UNIQUE INDEX listings_slug_idx ON public.listings (slug);

CREATE INDEX listings_creator_id_idx  ON public.listings (creator_id);
CREATE INDEX listings_status_idx      ON public.listings (status);
CREATE INDEX listings_category_idx    ON public.listings (category);
