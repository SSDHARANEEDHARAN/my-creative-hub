ALTER TABLE public.gallery_overrides ADD COLUMN IF NOT EXISTS deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.toolchain_overrides ADD COLUMN IF NOT EXISTS deleted boolean NOT NULL DEFAULT false;
ALTER TABLE public.toolchain_overrides ADD COLUMN IF NOT EXISTS custom boolean NOT NULL DEFAULT false;