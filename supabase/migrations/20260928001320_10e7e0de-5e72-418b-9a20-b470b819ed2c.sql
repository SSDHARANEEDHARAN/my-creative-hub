ALTER TABLE public.connector_files
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS blocked_until timestamptz;

CREATE TABLE public.connector_file_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid REFERENCES public.connector_files(id) ON DELETE SET NULL,
  file_name text NOT NULL,
  group_name text NOT NULL,
  user_id uuid,
  user_email text,
  user_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.connector_file_downloads TO anon;
GRANT SELECT, INSERT, DELETE ON public.connector_file_downloads TO authenticated;
GRANT ALL ON public.connector_file_downloads TO service_role;
ALTER TABLE public.connector_file_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a download" ON public.connector_file_downloads
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Admins read downloads" ON public.connector_file_downloads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete downloads" ON public.connector_file_downloads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX ON public.connector_file_downloads (file_id);
CREATE INDEX ON public.connector_file_downloads (created_at);