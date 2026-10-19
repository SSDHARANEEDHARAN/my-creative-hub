CREATE TABLE public.exploration_parts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 exploration_id uuid NOT NULL REFERENCES public.explorations(id) ON DELETE CASCADE,
 file_name text NOT NULL,
 storage_path text NOT NULL UNIQUE,
 size_bytes bigint NOT NULL DEFAULT 0 CHECK (size_bytes >= 0),
 description text NOT NULL DEFAULT '',
 enabled boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exploration_parts TO authenticated;
GRANT ALL ON public.exploration_parts TO service_role;
ALTER TABLE public.exploration_parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage exploration parts" ON public.exploration_parts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage private exploration storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'exploration-parts' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'exploration-parts' AND public.has_role(auth.uid(), 'admin'));
