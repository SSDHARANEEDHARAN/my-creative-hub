
ALTER VIEW public.blog_view_counts SET (security_invoker = on);
ALTER VIEW public.blog_comments_public SET (security_invoker = on);
ALTER VIEW public.blog_likes_public SET (security_invoker = on);

-- Allow public SELECT on the view counts (no RLS on views, but the underlying table needs a policy for the view to work)
-- Since we want anyone to see counts, add a select policy
CREATE POLICY "Anyone can read view counts" ON public.blog_views FOR SELECT USING (true);
