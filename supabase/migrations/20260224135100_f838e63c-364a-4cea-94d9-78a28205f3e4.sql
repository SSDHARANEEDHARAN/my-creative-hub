
CREATE TABLE public.blog_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id text NOT NULL,
  viewer_email text,
  viewer_name text,
  ip_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Allow anyone to insert views
ALTER TABLE public.blog_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views" ON public.blog_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all views" ON public.blog_views FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a public view for view counts (no PII exposed)
CREATE VIEW public.blog_view_counts AS
SELECT post_id, COUNT(*) as view_count, COUNT(DISTINCT COALESCE(viewer_email, ip_hash)) as unique_viewers
FROM public.blog_views
GROUP BY post_id;
