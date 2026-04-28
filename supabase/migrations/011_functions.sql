-- Reusable trigger function: sets updated_at = now() on every UPDATE
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to users
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apply to listings
CREATE TRIGGER set_updated_at_listings
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Apply to skill_requests
CREATE TRIGGER set_updated_at_skill_requests
BEFORE UPDATE ON public.skill_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
