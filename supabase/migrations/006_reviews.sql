CREATE TABLE public.reviews (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id   uuid    NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  listing_id uuid    NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  rating     integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    text,
  created_at timestamptz DEFAULT now(),

  -- One review per buyer per listing
  UNIQUE (buyer_id, listing_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are public — anyone can read them
CREATE POLICY "Reviews are publicly visible" ON public.reviews
  FOR SELECT USING (true);

-- Only the authenticated buyer who wrote the review can insert it
CREATE POLICY "Buyers can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Service role full access" ON public.reviews
  USING (auth.role() = 'service_role');

CREATE INDEX reviews_listing_id_idx ON public.reviews (listing_id);
CREATE INDEX reviews_buyer_id_idx   ON public.reviews (buyer_id);
