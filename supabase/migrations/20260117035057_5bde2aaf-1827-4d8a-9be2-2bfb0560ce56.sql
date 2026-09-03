-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  reply TEXT,
  reply_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_likes table
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, email)
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Blog comments policies
CREATE POLICY "Anyone can view comments"
ON public.blog_comments FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert comments"
ON public.blog_comments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can update comments"
ON public.blog_comments FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete comments"
ON public.blog_comments FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Blog likes policies
CREATE POLICY "Anyone can view likes"
ON public.blog_likes FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert likes"
ON public.blog_likes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
ON public.blog_likes FOR DELETE
USING (true);