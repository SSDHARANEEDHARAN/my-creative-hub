CREATE OR REPLACE FUNCTION public.protect_profile_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.status := OLD.status;
    NEW.industrial_access := OLD.industrial_access;
    NEW.locked_at := OLD.locked_at;
    NEW.access_expires_at := OLD.access_expires_at;
    NEW.daily_download_limit := OLD.daily_download_limit;
    NEW.can_download := OLD.can_download;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER protect_profile_admin_fields BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_admin_fields();