
-- Track each publish-notify event
CREATE TABLE public.publish_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('blog','project','update')),
  content_id UUID,
  title TEXT NOT NULL,
  slug TEXT,
  triggered_by UUID,
  total_subscribers INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','partial','failed','no_subscribers')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.publish_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view publish notifications"
ON public.publish_notifications FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert publish notifications"
ON public.publish_notifications FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update publish notifications"
ON public.publish_notifications FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_publish_notifications_created ON public.publish_notifications(created_at DESC);
CREATE INDEX idx_publish_notifications_kind ON public.publish_notifications(kind);
