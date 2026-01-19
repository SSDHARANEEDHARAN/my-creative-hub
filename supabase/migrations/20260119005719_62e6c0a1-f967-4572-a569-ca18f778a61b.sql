-- Fix error-level security issue: Blog likes DELETE policy
-- Remove overly permissive policy
DROP POLICY IF EXISTS "Anyone can delete their own likes" ON public.blog_likes;

-- Add admin-only delete policy for moderation
CREATE POLICY "Admins can delete likes"
ON public.blog_likes FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));