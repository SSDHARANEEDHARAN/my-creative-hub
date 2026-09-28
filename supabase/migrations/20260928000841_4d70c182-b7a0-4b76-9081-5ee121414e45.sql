
-- Add optional group link column
ALTER TABLE public.connector_files ADD COLUMN IF NOT EXISTS group_link text;

-- Move MecAgent videos into their own folder
UPDATE public.connector_files
SET group_name = 'MecAgent',
    group_description = 'AI CAD copilot demo videos',
    group_link = 'https://mecagent.com/blog/ai-in-cad-how-2025-is-reshaping-mechanical-design-workflows'
WHERE file_name ILIKE 'MECHAGENT%';

-- Add the two new SolidWorks files to the Leo AI folder
INSERT INTO public.connector_files (group_name, group_description, file_name, storage_path, extension, size_bytes, kind, sort_order)
VALUES
  ('Leo AI', 'AI co-pilot for mechanical engineering — source files', 'AI_Test_Base_Plate-2.SLDDRW', 'leo/AI_Test_Base_Plate-2.SLDDRW', 'SLDDRW', 85005, 'file', 10),
  ('Leo AI', 'AI co-pilot for mechanical engineering — source files', 'AI_Test_Base_Plate-2.SLDPRT', 'leo/AI_Test_Base_Plate-2.SLDPRT', 'SLDPRT', 56370, 'file', 11);
