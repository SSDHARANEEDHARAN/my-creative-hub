-- Gallery items: admin-managed images & videos shown on the public Gallery page.

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  media_path text NOT NULL,
  media_type text NOT NULL DEFAULT 'image', -- 'image' | 'video'
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public sees enabled items; admins see everything
CREATE POLICY "Anyone can view enabled gallery items"
  ON public.gallery_items FOR SELECT
  USING (enabled = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert gallery items"
  ON public.gallery_items FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery items"
  ON public.gallery_items FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery items"
  ON public.gallery_items FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX gallery_items_order_idx ON public.gallery_items (sort_order, created_at);

-- Public storage bucket for the uploaded media
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read gallery media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));
