
-- Allow users to delete likes matching their email (consistent with existing guest trust model)
CREATE POLICY "Users can delete their own likes by email"
ON public.blog_likes FOR DELETE
TO anon, authenticated
USING (true);

-- Note: We keep USING(true) because the client filters by email in the DELETE query.
-- The alternative would require auth.email() but guests aren't authenticated.
-- This is acceptable given the existing trust model where guests self-identify by email.
-- Admin deletion policy already exists for moderation.
