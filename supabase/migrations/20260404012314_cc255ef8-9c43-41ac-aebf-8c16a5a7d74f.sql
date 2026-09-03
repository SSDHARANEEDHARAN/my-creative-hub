
-- Remove the permissive public SELECT policy from blog_views
DROP POLICY IF EXISTS "Anyone can read view counts" ON public.blog_views;

-- Remove the permissive public SELECT policy from project_views
DROP POLICY IF EXISTS "Anyone can read project view counts" ON public.project_views;
