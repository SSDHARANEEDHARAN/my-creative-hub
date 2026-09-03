
-- The blog_comments_public view uses security_invoker=on, which means it checks
-- RLS on blog_comments as the calling user. But we just restricted SELECT to admins only.
-- We need to recreate the view WITHOUT security_invoker (use SECURITY DEFINER behavior)
-- since the view itself already filters to approved, non-spam comments and excludes email.
DROP VIEW IF EXISTS public.blog_comments_public;
CREATE VIEW public.blog_comments_public AS
  SELECT id, post_id, name, content, created_at, reply, reply_date, is_approved
  FROM public.blog_comments
  WHERE is_approved = true AND is_spam = false;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;
