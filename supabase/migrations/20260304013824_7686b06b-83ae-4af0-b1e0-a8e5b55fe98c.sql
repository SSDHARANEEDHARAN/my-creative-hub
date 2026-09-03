
CREATE TABLE public.download_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('blog', 'project')),
  content_id text NOT NULL,
  file_type text NOT NULL,
  downloader_name text,
  downloader_email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.download_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track downloads"
  ON public.download_tracking
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read download counts"
  ON public.download_tracking
  FOR SELECT
  TO anon, authenticated
  USING (true);
