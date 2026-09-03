
-- 1. Secure otp_codes table - enable RLS and deny all access (only edge functions use service role)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- No SELECT policy needed - edge functions use service_role to bypass RLS
-- No INSERT policy needed - edge functions use service_role to bypass RLS

-- 2. Fix download_tracking - restrict SELECT to admins only
DROP POLICY IF EXISTS "Anyone can read download counts" ON public.download_tracking;

CREATE POLICY "Admins can read download tracking"
  ON public.download_tracking
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Enable leaked password protection
ALTER TABLE public.otp_codes FORCE ROW LEVEL SECURITY;
