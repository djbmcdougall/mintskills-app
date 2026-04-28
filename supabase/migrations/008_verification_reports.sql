-- Includes all fields from both the TypeScript types and PRD Section 5 schema.
-- sandbox_log_url, postinstall_scripts_reviewed, and low_dependent_count_flag
-- are present in the PRD schema but not yet in database.ts — add them there too.

CREATE TABLE public.verification_reports (
  id                            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id                    uuid    NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  status                        text    NOT NULL CHECK (status IN ('pass','warning','fail')),
  checks_run                    jsonb   NOT NULL DEFAULT '{}',
  issues_found                  jsonb   NOT NULL DEFAULT '{}',
  sandbox_log_url               text,
  binary_detected               boolean NOT NULL DEFAULT false,
  postinstall_scripts_found     boolean NOT NULL DEFAULT false,
  postinstall_scripts_reviewed  boolean NOT NULL DEFAULT false,
  suspicious_patterns           jsonb   NOT NULL DEFAULT '{}',
  base64_strings_found          boolean NOT NULL DEFAULT false,
  dependency_issues             jsonb   NOT NULL DEFAULT '{}',
  low_dependent_count_flag      boolean NOT NULL DEFAULT false,
  watermark_injected            boolean NOT NULL DEFAULT false,
  watermark_signature           text,
  fingerprint_provisioned       boolean NOT NULL DEFAULT false,
  created_at                    timestamptz DEFAULT now()
);

ALTER TABLE public.verification_reports ENABLE ROW LEVEL SECURITY;

-- Verification reports contain security analysis details — service role only
CREATE POLICY "Service role only" ON public.verification_reports
  USING (auth.role() = 'service_role');

CREATE INDEX verification_reports_listing_id_idx ON public.verification_reports (listing_id);
CREATE INDEX verification_reports_status_idx     ON public.verification_reports (status);
