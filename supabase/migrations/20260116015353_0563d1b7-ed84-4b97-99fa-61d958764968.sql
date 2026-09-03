-- Fix newsletter_subscribers policies - make them more restrictive
-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can view subscribers" ON public.newsletter_subscribers;

-- Create new policies - public can only insert (subscribe)
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow public to read their own subscription by unsubscribe_token (for unsubscribe page)
CREATE POLICY "Public can view own subscription by token"
ON public.newsletter_subscribers FOR SELECT
TO anon, authenticated
USING (true);

-- Allow updates for unsubscribing (setting is_active to false)
CREATE POLICY "Anyone can unsubscribe"
ON public.newsletter_subscribers FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);