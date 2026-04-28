CREATE TABLE public.installs (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id       uuid        NOT NULL REFERENCES public.purchases(id) ON DELETE RESTRICT,
  listing_id        uuid        NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  buyer_id          uuid        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  -- Identifies which MCP host the skill was installed into
  host              text        NOT NULL CHECK (host IN (
    'claude-code', 'cursor', 'codex', 'windsurf', 'vscode-copilot', 'cowork', 'web'
  )),
  repo_context_hash text,
  installed_at      timestamptz DEFAULT now()
);

ALTER TABLE public.installs ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own install history
CREATE POLICY "Buyers view own installs" ON public.installs
  FOR SELECT USING (auth.uid() = buyer_id);

-- Installs are written server-side by the install_skill handler
CREATE POLICY "Service role full access" ON public.installs
  USING (auth.role() = 'service_role');

CREATE INDEX installs_buyer_id_idx    ON public.installs (buyer_id);
CREATE INDEX installs_purchase_id_idx ON public.installs (purchase_id);
CREATE INDEX installs_listing_id_idx  ON public.installs (listing_id);
