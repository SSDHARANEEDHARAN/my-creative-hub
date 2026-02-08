
-- Fix 1: Allow anyone to delete their own likes (enables unlike)
CREATE POLICY "Anyone can delete their own likes"
ON public.blog_likes FOR DELETE
TO anon, authenticated
USING (true);

-- Fix 2: Replace permissive SELECT on blog_comments with restricted policy
DROP POLICY IF EXISTS "Anyone can view comments" ON public.blog_comments;

CREATE POLICY "Public can view approved comments"
ON public.blog_comments FOR SELECT
TO anon, authenticated
USING (is_approved = true AND is_spam = false);

-- Create a public view excluding email
CREATE OR REPLACE VIEW public.blog_comments_public AS
SELECT id, post_id, name, content, created_at, reply, reply_date, is_approved
FROM public.blog_comments
WHERE is_approved = true AND is_spam = false;
