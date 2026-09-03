
-- Add last_ip column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_ip text;

-- Create blocked_ips table
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL UNIQUE,
  user_id uuid,
  reason text DEFAULT 'blocked by admin',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on blocked_ips
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read blocked_ips (needed for IP check without auth)
CREATE POLICY "Anyone can check blocked IPs" ON public.blocked_ips FOR SELECT TO anon, authenticated USING (true);

-- Only admins can manage blocked IPs
CREATE POLICY "Admins can manage blocked IPs" ON public.blocked_ips FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
