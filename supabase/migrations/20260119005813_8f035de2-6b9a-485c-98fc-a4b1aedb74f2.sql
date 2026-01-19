-- Add name column to newsletter_subscribers for personalization
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN name text;