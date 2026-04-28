CREATE TABLE public.free_skills (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_url     text        NOT NULL,
  title        text        NOT NULL,
  description  text        NOT NULL,
  category     text        NOT NULL,
  stars        integer     NOT NULL DEFAULT 0,
  last_updated timestamptz NOT NULL,
  author       text        NOT NULL,
  indexed_at   timestamptz DEFAULT now()
);

ALTER TABLE public.free_skills ENABLE ROW LEVEL SECURITY;

-- Free skills are publicly visible — primary SEO and discovery surface
CREATE POLICY "Free skills are publicly visible" ON public.free_skills
  FOR SELECT USING (true);

-- Only the indexing pipeline (service role) can write to this table
CREATE POLICY "Service role can insert and update" ON public.free_skills
  FOR ALL USING (auth.role() = 'service_role');

-- Sorted by popularity on /browse
CREATE INDEX free_skills_stars_idx    ON public.free_skills (stars DESC);
CREATE INDEX free_skills_category_idx ON public.free_skills (category);
