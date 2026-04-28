CREATE TABLE public.skill_requests (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by           uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title               text        NOT NULL,
  description         text        NOT NULL,
  category            text        NOT NULL,
  suggested_price_gbp numeric(10,2),
  upvote_count        integer     NOT NULL DEFAULT 0,
  status              text        NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','fulfilled')),
  -- Set when a creator fulfils the request with a published listing
  fulfilled_listing_id uuid        REFERENCES public.listings(id) ON DELETE SET NULL,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

ALTER TABLE public.skill_requests ENABLE ROW LEVEL SECURITY;

-- Public board — no login required to browse
CREATE POLICY "Skill requests are publicly visible" ON public.skill_requests
  FOR SELECT USING (true);

-- Login required to post a request
CREATE POLICY "Authenticated users can post requests" ON public.skill_requests
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

-- Poster can update their own request
CREATE POLICY "Users can update own requests" ON public.skill_requests
  FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "Service role full access" ON public.skill_requests
  USING (auth.role() = 'service_role');

CREATE INDEX skill_requests_upvote_count_idx ON public.skill_requests (upvote_count DESC);
CREATE INDEX skill_requests_status_idx       ON public.skill_requests (status);
CREATE INDEX skill_requests_category_idx     ON public.skill_requests (category);
CREATE INDEX skill_requests_posted_by_idx    ON public.skill_requests (posted_by);

-- ---------------------------------------------------------------------------

CREATE TABLE public.skill_request_votes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.skill_requests(id) ON DELETE CASCADE,
  voter_id   uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  -- One vote per user per request
  UNIQUE (request_id, voter_id)
);

ALTER TABLE public.skill_request_votes ENABLE ROW LEVEL SECURITY;

-- Authenticated users can vote
CREATE POLICY "Authenticated users can insert votes" ON public.skill_request_votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

-- Users can remove their own vote
CREATE POLICY "Users can delete own votes" ON public.skill_request_votes
  FOR DELETE USING (auth.uid() = voter_id);

CREATE POLICY "Service role full access on votes" ON public.skill_request_votes
  USING (auth.role() = 'service_role');

CREATE INDEX skill_request_votes_request_id_idx ON public.skill_request_votes (request_id);
CREATE INDEX skill_request_votes_voter_id_idx   ON public.skill_request_votes (voter_id);

-- ---------------------------------------------------------------------------
-- Trigger: keep upvote_count on skill_requests in sync with votes table

CREATE OR REPLACE FUNCTION update_skill_request_upvote_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.skill_requests
       SET upvote_count = upvote_count + 1
     WHERE id = NEW.request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.skill_requests
       SET upvote_count = GREATEST(upvote_count - 1, 0)
     WHERE id = OLD.request_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_vote_change
AFTER INSERT OR DELETE ON public.skill_request_votes
FOR EACH ROW EXECUTE FUNCTION update_skill_request_upvote_count();
