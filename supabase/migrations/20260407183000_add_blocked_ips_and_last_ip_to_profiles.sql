-- Migration: Create blocked_ips table and add last_ip to profiles

ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS last_ip text;

CREATE TABLE IF NOT EXISTS blocked_ips (
  ip text PRIMARY KEY,
  user_id uuid,
  reason text,
  blocked_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS blocked_ips_ip_key ON blocked_ips (ip);
