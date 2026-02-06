-- Fix newsletter subscriber privacy by removing overly permissive SELECT policy
-- The unsubscribe flow correctly uses Edge Functions with service role, so this policy is unnecessary

DROP POLICY IF EXISTS "Public can view own subscription by token" ON public.newsletter_subscribers;