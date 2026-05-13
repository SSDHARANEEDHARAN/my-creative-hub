CREATE TABLE public.hidden_static_blog_posts (
  post_id text PRIMARY KEY,
  title text,
  hidden_by uuid,
  hidden_by_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hidden_static_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hidden static posts"
  ON public.hidden_static_blog_posts FOR SELECT USING (true);

CREATE POLICY "Admins can hide static posts"
  ON public.hidden_static_blog_posts FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can unhide static posts"
  ON public.hidden_static_blog_posts FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));