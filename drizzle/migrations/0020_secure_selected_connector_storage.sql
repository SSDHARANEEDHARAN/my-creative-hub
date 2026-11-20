DROP POLICY "Anyone can read connector file objects" ON storage.objects;
CREATE POLICY "Read eligible connector file objects"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'connector-files'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1
      FROM public.connector_files AS cf
      WHERE cf.storage_path = storage.objects.name
        AND cf.enabled = true
        AND (cf.blocked_until IS NULL OR cf.blocked_until <= now())
        AND (cf.downloadable = true OR cf.kind = 'video')
    )
  )
);

DROP POLICY "Validated public guest registrations" ON public.guest_visitors;
CREATE POLICY "Validated public guest registrations"
ON public.guest_visitors FOR INSERT TO public
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND (ip_address IS NULL OR char_length(ip_address) <= 100)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
);
