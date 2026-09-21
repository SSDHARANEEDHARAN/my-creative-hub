CREATE TABLE public.connector_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name text NOT NULL,
  group_description text,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  extension text NOT NULL,
  size_bytes bigint NOT NULL DEFAULT 0,
  kind text NOT NULL DEFAULT 'file',
  enabled boolean NOT NULL DEFAULT true,
  downloadable boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.connector_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.connector_files TO authenticated;
GRANT ALL ON public.connector_files TO service_role;

ALTER TABLE public.connector_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible connector files"
  ON public.connector_files FOR SELECT
  USING (enabled = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage connector files"
  ON public.connector_files FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read connector file objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'connector-files');

CREATE POLICY "Admins can upload connector file objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'connector-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update connector file objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'connector-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete connector file objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'connector-files' AND public.has_role(auth.uid(), 'admin'));