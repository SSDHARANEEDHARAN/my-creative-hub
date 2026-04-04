
-- Add status column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Create user_activity table for tracking login/logout
CREATE TABLE public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Only admins can view all activity
CREATE POLICY "Admins can view all activity"
ON public.user_activity
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
ON public.user_activity
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Anyone authenticated can insert their own activity
CREATE POLICY "Users can insert own activity"
ON public.user_activity
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create industrial_projects table
CREATE TABLE public.industrial_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'upcoming',
  category text NOT NULL DEFAULT 'industrial',
  created_by uuid,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.industrial_projects ENABLE ROW LEVEL SECURITY;

-- Approved users can view published industrial projects
CREATE POLICY "Approved users can view published industrial projects"
ON public.industrial_projects
FOR SELECT
TO authenticated
USING (is_published = true);

-- Admins can do everything with industrial projects
CREATE POLICY "Admins can manage industrial projects"
ON public.industrial_projects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles RLS: admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any profile (for approval/restriction)
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
