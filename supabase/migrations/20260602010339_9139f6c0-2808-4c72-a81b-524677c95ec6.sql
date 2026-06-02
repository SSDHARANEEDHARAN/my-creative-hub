ALTER TABLE public.blocked_ips ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON public.blocked_ips (ip);