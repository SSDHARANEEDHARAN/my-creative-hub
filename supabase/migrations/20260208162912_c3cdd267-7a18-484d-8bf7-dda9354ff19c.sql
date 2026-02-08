
-- Fix 1: Recreate blog_comments_public view with security_invoker=true
DROP VIEW IF EXISTS public.blog_comments_public;
CREATE VIEW public.blog_comments_public
WITH (security_invoker=on) AS
  SELECT id, post_id, name, content, created_at, reply, reply_date, is_approved
  FROM public.blog_comments
  WHERE is_approved = true AND is_spam = false;

-- Fix 2: Replace overly permissive blog_likes DELETE policy
DROP POLICY IF EXISTS "Anyone can delete their own likes" ON public.blog_likes;
-- Keep only admin deletion for moderation (safest approach for anonymous likes)
