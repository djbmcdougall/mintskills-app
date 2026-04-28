CREATE TABLE public.licence_violations (
  id                       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id               uuid    NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  reported_by              uuid    NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  evidence_url             text    NOT NULL,
  watermark_match          boolean NOT NULL DEFAULT false,
  matched_licence_key      text,
  fingerprint_match        boolean NOT NULL DEFAULT false,
  matched_buyer_fingerprint text,
  status                   text    NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','dismissed')),
  created_at               timestamptz DEFAULT now()
);

ALTER TABLE public.licence_violations ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can file a violation report
CREATE POLICY "Authenticated users can report violations" ON public.licence_violations
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Reporters can view their own submissions
CREATE POLICY "Reporters view own violations" ON public.licence_violations
  FOR SELECT USING (auth.uid() = reported_by);

-- Admin and enforcement pipeline uses service role for full access
CREATE POLICY "Service role full access" ON public.licence_violations
  USING (auth.role() = 'service_role');

CREATE INDEX licence_violations_listing_id_idx ON public.licence_violations (listing_id);
CREATE INDEX licence_violations_status_idx     ON public.licence_violations (status);
CREATE INDEX licence_violations_reported_by_idx ON public.licence_violations (reported_by);
