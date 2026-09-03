
-- Fix: Restrict guest_visitors SELECT policy to authenticated role only
DROP POLICY IF EXISTS "Admins can view guests" ON public.guest_visitors;
CREATE POLICY "Admins can view guests"
  ON public.guest_visitors
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
