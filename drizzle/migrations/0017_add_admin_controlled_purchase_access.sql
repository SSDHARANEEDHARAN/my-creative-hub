ALTER TABLE public.profiles ADD COLUMN purchase_access boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.protect_profile_admin_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := OLD.status;
    NEW.industrial_access := OLD.industrial_access;
    NEW.locked_at := OLD.locked_at;
    NEW.access_expires_at := OLD.access_expires_at;
    NEW.daily_download_limit := OLD.daily_download_limit;
    NEW.can_download := OLD.can_download;
    NEW.purchase_access := OLD.purchase_access;
  END IF;
  RETURN NEW;
END;
$function$;

DROP POLICY "Visible offers" ON public.exploration_offers;
CREATE POLICY "Purchase access offers"
ON public.exploration_offers
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.purchase_access
    )
    AND EXISTS (
      SELECT 1 FROM public.explorations e
      WHERE e.id = exploration_offers.exploration_id AND e.is_visible
    )
  )
);

DROP POLICY "Own purchase status or admin" ON public.exploration_purchases;
CREATE POLICY "Purchase access own status or admin"
ON public.exploration_purchases
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.purchase_access
    )
  )
);