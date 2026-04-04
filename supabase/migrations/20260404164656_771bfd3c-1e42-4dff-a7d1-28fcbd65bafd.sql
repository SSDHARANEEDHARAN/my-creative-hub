
DROP VIEW IF EXISTS public.project_read_counts;
CREATE VIEW public.project_read_counts WITH (security_invoker = on) AS
SELECT project_id, count(*) as read_count
FROM public.project_reads
GROUP BY project_id;
