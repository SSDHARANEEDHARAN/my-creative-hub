
-- Project comments table
CREATE TABLE public.project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  is_spam boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

-- Public view (hides email)
CREATE VIEW public.project_comments_public WITH (security_invoker = on) AS
SELECT id, project_id, name, content, is_approved, created_at
FROM public.project_comments
WHERE is_approved = true AND is_spam = false;

-- RLS policies
CREATE POLICY "Anyone can insert project comments" ON public.project_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all project comments" ON public.project_comments FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update project comments" ON public.project_comments FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete project comments" ON public.project_comments FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow public to read the view
GRANT SELECT ON public.project_comments_public TO anon, authenticated;
