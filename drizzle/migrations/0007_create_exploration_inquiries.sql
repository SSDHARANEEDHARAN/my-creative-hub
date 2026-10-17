CREATE TABLE public.exploration_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exploration_id UUID,
  exploration_title TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.exploration_inquiries TO anon, authenticated;
GRANT SELECT ON public.exploration_inquiries TO authenticated;
GRANT ALL ON public.exploration_inquiries TO service_role;

ALTER TABLE public.exploration_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an exploration inquiry"
  ON public.exploration_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view exploration inquiries"
  ON public.exploration_inquiries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));