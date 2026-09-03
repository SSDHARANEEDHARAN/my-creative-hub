
-- Create project_reads table
CREATE TABLE public.project_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  reader_email TEXT,
  reader_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert project reads" ON public.project_reads
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view all project reads" ON public.project_reads
  FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Add unique constraint on project_likes to prevent duplicates
ALTER TABLE public.project_likes ADD CONSTRAINT project_likes_unique_email_project UNIQUE (project_id, email);

-- Enable realtime for project_reads
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_reads;

-- Create a view for project read counts
CREATE OR REPLACE VIEW public.project_read_counts AS
SELECT project_id, count(*) as read_count
FROM public.project_reads
GROUP BY project_id;
