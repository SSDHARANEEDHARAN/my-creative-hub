-- Allow authenticated users to see project read counts
CREATE POLICY "Authenticated can view project reads"
ON public.project_reads FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to see approved project comments
CREATE POLICY "Authenticated can view approved comments"
ON public.project_comments FOR SELECT
TO authenticated
USING (is_approved = true AND is_spam = false);

-- Allow authenticated users to see project likes (to check if already liked)
CREATE POLICY "Authenticated can view project likes"
ON public.project_likes FOR SELECT
TO authenticated
USING (true);