ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industrial_access boolean NOT NULL DEFAULT false;

CREATE TABLE public.explorations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'exploring',
  tags text[] NOT NULL DEFAULT '{}',
  contact_note text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.explorations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.explorations TO authenticated;
GRANT ALL ON public.explorations TO service_role;

ALTER TABLE public.explorations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible explorations"
ON public.explorations FOR SELECT
USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert explorations"
ON public.explorations FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update explorations"
ON public.explorations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete explorations"
ON public.explorations FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_explorations_updated_at
BEFORE UPDATE ON public.explorations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();