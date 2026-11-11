CREATE TABLE public.mind_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.mind_messages TO authenticated;
GRANT ALL ON public.mind_messages TO service_role;
ALTER TABLE public.mind_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read mind messages" ON public.mind_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete mind messages" ON public.mind_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));