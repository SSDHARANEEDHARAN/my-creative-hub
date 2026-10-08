CREATE TABLE public.content_overrides (
  kind text NOT NULL CHECK (kind IN ('project','blog')),
  item_id text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kind, item_id)
);
GRANT SELECT ON public.content_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.content_overrides TO authenticated;
GRANT ALL ON public.content_overrides TO service_role;
ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read content" ON public.content_overrides FOR SELECT USING (true);
CREATE POLICY "Admins insert content" ON public.content_overrides FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update content" ON public.content_overrides FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete content" ON public.content_overrides FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_content_overrides_updated_at BEFORE UPDATE ON public.content_overrides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_overrides;