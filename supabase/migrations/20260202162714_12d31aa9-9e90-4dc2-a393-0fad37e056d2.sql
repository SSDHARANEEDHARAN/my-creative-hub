-- Create table for tracking guest visitors
CREATE TABLE public.guest_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.guest_visitors ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (register as guest)
CREATE POLICY "Anyone can register as guest"
ON public.guest_visitors
FOR INSERT
WITH CHECK (true);

-- Only admins can view guests
CREATE POLICY "Admins can view guests"
ON public.guest_visitors
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add approved column to blog_comments for moderation
ALTER TABLE public.blog_comments
ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false;

-- Add honeypot field check - comments with honeypot filled are spam
ALTER TABLE public.blog_comments
ADD COLUMN is_spam BOOLEAN NOT NULL DEFAULT false;