CREATE TABLE public.gallery_drive_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  drive_url text NOT NULL,
  hidden boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_drive_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_drive_videos TO authenticated;
GRANT ALL ON public.gallery_drive_videos TO service_role;
ALTER TABLE public.gallery_drive_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads visible drive videos" ON public.gallery_drive_videos FOR SELECT USING (hidden = false OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage drive videos" ON public.gallery_drive_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));