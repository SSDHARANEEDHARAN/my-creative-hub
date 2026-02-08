
-- Fix: blog_comments SELECT policy exposes email to public
-- Remove public SELECT and force use of the secure view (blog_comments_public) which excludes email
DROP POLICY IF EXISTS "Public can view approved comments" ON public.blog_comments;

-- Create a restrictive policy: only admins can SELECT from the base table
CREATE POLICY "Admins can view all comments"
ON public.blog_comments FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
