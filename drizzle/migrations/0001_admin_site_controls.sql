CREATE TABLE public.gallery_overrides (
  base text PRIMARY KEY,
  title text,
  description text,
  hidden boolean NOT NULL DEFAULT false,
  sort_order integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_overrides TO authenticated;
GRANT ALL ON public.gallery_overrides TO service_role;
ALTER TABLE public.gallery_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read gallery overrides" ON public.gallery_overrides FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery overrides" ON public.gallery_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.toolchain_overrides (
  name text PRIMARY KEY,
  logo_url text,
  description text,
  url text,
  hidden boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.toolchain_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.toolchain_overrides TO authenticated;
GRANT ALL ON public.toolchain_overrides TO service_role;
ALTER TABLE public.toolchain_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read toolchain overrides" ON public.toolchain_overrides FOR SELECT USING (true);
CREATE POLICY "Admins manage toolchain overrides" ON public.toolchain_overrides FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.profiles
  ADD COLUMN access_expires_at timestamptz,
  ADD COLUMN daily_download_limit integer,
  ADD COLUMN can_download boolean NOT NULL DEFAULT true;