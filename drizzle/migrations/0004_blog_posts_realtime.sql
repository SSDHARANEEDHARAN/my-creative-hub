DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='blog_posts') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='gallery_overrides') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_overrides;
  END IF;
END $$;