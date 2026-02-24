
-- Project views table
CREATE TABLE public.project_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  viewer_email text,
  viewer_name text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert project views" ON public.project_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all project views" ON public.project_views
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read project view counts" ON public.project_views
  FOR SELECT USING (true);

-- Project likes table
CREATE TABLE public.project_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, email)
);

ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert project likes" ON public.project_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all project likes" ON public.project_likes
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project likes" ON public.project_likes
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Public view for project view counts
CREATE VIEW public.project_view_counts AS
  SELECT project_id, count(*) AS view_count, count(DISTINCT COALESCE(viewer_email, ip_hash)) AS unique_viewers
  FROM public.project_views
  GROUP BY project_id;

-- Public view for project likes (no email exposed)
CREATE VIEW public.project_likes_public AS
  SELECT id, project_id, name, created_at
  FROM public.project_likes;
