
-- Fix 1: Remove overly permissive newsletter UPDATE policy
-- The unsubscribe edge function uses service_role_key which bypasses RLS
DROP POLICY IF EXISTS "Anyone can unsubscribe" ON public.newsletter_subscribers;

-- Fix 2: Remove overly permissive blog_likes DELETE policy  
DROP POLICY IF EXISTS "Users can delete their own likes by email" ON public.blog_likes;

-- Fix 3: Remove public SELECT on blog_likes (exposes emails)
DROP POLICY IF EXISTS "Anyone can view likes" ON public.blog_likes;

-- Create a view for public like counts (no email exposure)
CREATE OR REPLACE VIEW public.blog_likes_public
WITH (security_invoker = on) AS
SELECT id, post_id, name, created_at
FROM public.blog_likes;

-- Allow authenticated/admin to still SELECT blog_likes directly
CREATE POLICY "Admins can view all likes"
ON public.blog_likes FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
