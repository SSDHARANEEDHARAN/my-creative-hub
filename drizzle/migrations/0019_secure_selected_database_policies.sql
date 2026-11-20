-- Tighten only the access rules selected in the security scan.
DROP POLICY "Anyone can insert comments" ON public.blog_comments;
CREATE POLICY "Validated public comment submissions"
ON public.blog_comments FOR INSERT TO public
WITH CHECK (
  char_length(btrim(post_id)) BETWEEN 1 AND 200
  AND char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND char_length(btrim(content)) BETWEEN 1 AND 5000
  AND is_approved = false
  AND reply IS NULL
  AND reply_date IS NULL
);

DROP POLICY "Anyone can insert likes" ON public.blog_likes;
CREATE POLICY "Validated public blog likes"
ON public.blog_likes FOR INSERT TO public
WITH CHECK (
  char_length(btrim(post_id)) BETWEEN 1 AND 200
  AND char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

DROP POLICY "Anyone can insert views" ON public.blog_views;
CREATE POLICY "Validated public blog views"
ON public.blog_views FOR INSERT TO public
WITH CHECK (
  char_length(btrim(post_id)) BETWEEN 1 AND 200
  AND (viewer_email IS NULL OR (char_length(viewer_email) <= 320 AND viewer_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
  AND (viewer_name IS NULL OR char_length(viewer_name) <= 120)
  AND (ip_hash IS NULL OR char_length(ip_hash) <= 128)
);

DROP POLICY "Anyone can read content" ON public.content_overrides;
CREATE POLICY "Public can read project and blog content"
ON public.content_overrides FOR SELECT TO public
USING (kind IN ('project', 'blog') AND char_length(btrim(item_id)) BETWEEN 1 AND 200);
REVOKE SELECT ON public.content_overrides FROM anon, authenticated;
GRANT SELECT (kind, item_id, data, updated_at) ON public.content_overrides TO anon, authenticated;

DROP POLICY "Anyone can read gallery overrides" ON public.gallery_overrides;
CREATE POLICY "Public can read gallery presentation settings"
ON public.gallery_overrides FOR SELECT TO public
USING (char_length(btrim(base)) BETWEEN 1 AND 300);

DROP POLICY "Anyone can read toolchain overrides" ON public.toolchain_overrides;
CREATE POLICY "Public can read toolchain presentation settings"
ON public.toolchain_overrides FOR SELECT TO public
USING (char_length(btrim(name)) BETWEEN 1 AND 200);

DROP POLICY "Anyone can view hidden static posts" ON public.hidden_static_blog_posts;
CREATE POLICY "Public can read hidden post identifiers"
ON public.hidden_static_blog_posts FOR SELECT TO public
USING (char_length(btrim(post_id)) BETWEEN 1 AND 200);
REVOKE SELECT ON public.hidden_static_blog_posts FROM anon, authenticated;
GRANT SELECT (post_id) ON public.hidden_static_blog_posts TO anon, authenticated;

DROP POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Validated public newsletter subscriptions"
ON public.newsletter_subscribers FOR INSERT TO public
WITH CHECK (
  char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND (name IS NULL OR char_length(name) <= 120)
  AND is_active = true
  AND (source IS NULL OR char_length(source) <= 100)
);

DROP POLICY "Anyone can insert project comments" ON public.project_comments;
CREATE POLICY "Validated public project comments"
ON public.project_comments FOR INSERT TO public
WITH CHECK (
  char_length(btrim(project_id)) BETWEEN 1 AND 200
  AND char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND char_length(btrim(content)) BETWEEN 1 AND 5000
  AND is_spam = false
);

DROP POLICY "Anyone can insert project likes" ON public.project_likes;
CREATE POLICY "Validated public project likes"
ON public.project_likes FOR INSERT TO public
WITH CHECK (
  char_length(btrim(project_id)) BETWEEN 1 AND 200
  AND char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

DROP POLICY "Authenticated can view project likes" ON public.project_likes;
CREATE POLICY "Users can view their own project likes"
ON public.project_likes FOR SELECT TO authenticated
USING (
  email = (SELECT auth.jwt() ->> 'email')
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY "Anyone can insert project reads" ON public.project_reads;
CREATE POLICY "Validated public project reads"
ON public.project_reads FOR INSERT TO public
WITH CHECK (
  char_length(btrim(project_id)) BETWEEN 1 AND 200
  AND (reader_email IS NULL OR (char_length(reader_email) <= 320 AND reader_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
  AND (reader_name IS NULL OR char_length(reader_name) <= 120)
);

DROP POLICY "Authenticated can view project reads" ON public.project_reads;
CREATE POLICY "Admins can view project read details"
ON public.project_reads FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE VIEW public.project_read_counts AS
SELECT project_id, count(*) AS read_count
FROM public.project_reads
GROUP BY project_id;
ALTER VIEW public.project_read_counts RESET (security_invoker);
GRANT SELECT ON public.project_read_counts TO anon, authenticated;

DROP POLICY "Anyone can insert project views" ON public.project_views;
CREATE POLICY "Validated public project views"
ON public.project_views FOR INSERT TO public
WITH CHECK (
  char_length(btrim(project_id)) BETWEEN 1 AND 200
  AND (viewer_email IS NULL OR (char_length(viewer_email) <= 320 AND viewer_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
  AND (viewer_name IS NULL OR char_length(viewer_name) <= 120)
  AND (ip_hash IS NULL OR char_length(ip_hash) <= 128)
);

DROP POLICY "Anyone can insert site visits" ON public.site_visits;
CREATE POLICY "Validated public site visits"
ON public.site_visits FOR INSERT TO public
WITH CHECK (
  char_length(btrim(path)) BETWEEN 1 AND 2048
  AND (referrer IS NULL OR char_length(referrer) <= 2048)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
  AND (ip IS NULL OR char_length(ip) <= 100)
  AND (user_id IS NULL OR user_id = auth.uid())
  AND (user_email IS NULL OR (auth.uid() IS NOT NULL AND user_email = (SELECT auth.jwt() ->> 'email')))
);

DROP POLICY "Anyone can register as guest" ON public.guest_visitors;
CREATE POLICY "Validated public guest registrations"
ON public.guest_visitors FOR INSERT TO public
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[^:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND (ip_address IS NULL OR char_length(ip_address) <= 100)
  AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
);

DROP POLICY "Anyone can track downloads" ON public.download_tracking;
CREATE POLICY "Validated public download tracking"
ON public.download_tracking FOR INSERT TO anon, authenticated
WITH CHECK (
  content_type IN ('blog', 'project')
  AND char_length(btrim(content_id)) BETWEEN 1 AND 200
  AND char_length(btrim(file_type)) BETWEEN 1 AND 100
  AND (downloader_name IS NULL OR char_length(downloader_name) <= 120)
  AND (downloader_email IS NULL OR (char_length(downloader_email) <= 320 AND downloader_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
);

DROP POLICY "Anyone can submit an exploration inquiry" ON public.exploration_inquiries;
CREATE POLICY "Validated public exploration inquiries"
ON public.exploration_inquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  exploration_id IS NOT NULL
  AND (exploration_title IS NULL OR char_length(exploration_title) <= 300)
  AND char_length(btrim(name)) BETWEEN 1 AND 120
  AND char_length(email) <= 320
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND char_length(btrim(message)) BETWEEN 1 AND 5000
);

DROP POLICY "Anyone can check blocked IPs" ON public.blocked_ips;
