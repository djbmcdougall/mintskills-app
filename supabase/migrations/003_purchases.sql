CREATE TABLE public.purchases (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id          uuid        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  listing_id        uuid        NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  stripe_payment_id text        NOT NULL,
  amount            numeric(10,2) NOT NULL CHECK (amount >= 0),
  platform_fee      numeric(10,2) NOT NULL CHECK (platform_fee >= 0),
  creator_payout    numeric(10,2) NOT NULL CHECK (creator_payout >= 0),
  licence_tier      text        NOT NULL CHECK (licence_tier IN ('embed','source','extended')),
  -- UUID licence key embedded in the delivered artifact for traceability
  licence_key       uuid        NOT NULL DEFAULT gen_random_uuid(),
  buyer_fingerprint text,
  status            text        NOT NULL DEFAULT 'completed' CHECK (status IN ('completed','refunded')),
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own purchase history
CREATE POLICY "Buyers view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = buyer_id);

-- No direct INSERT from the browser — all purchases are created server-side
-- via the Stripe webhook handler using the service role key
CREATE POLICY "Service role full access" ON public.purchases
  USING (auth.role() = 'service_role');

CREATE INDEX purchases_buyer_id_idx   ON public.purchases (buyer_id);
CREATE INDEX purchases_listing_id_idx ON public.purchases (listing_id);
CREATE INDEX purchases_status_idx     ON public.purchases (status);
