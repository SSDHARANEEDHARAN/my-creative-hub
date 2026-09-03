
-- Skills table (IT and Engineering skills with percentages)
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 50,
  category text NOT NULL DEFAULT 'it',
  skill_type text NOT NULL DEFAULT 'primary',
  color_token text DEFAULT 'primary',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can create skills" ON public.skills FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  date text DEFAULT '',
  image_url text,
  category text NOT NULL DEFAULT 'it',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Admins can create certificates" ON public.certificates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update certificates" ON public.certificates FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete certificates" ON public.certificates FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- About content table (key-value style for editable sections)
CREATE TABLE public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Admins can update about content" ON public.about_content FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert about content" ON public.about_content FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default skills data
INSERT INTO public.skills (name, level, category, skill_type, color_token, sort_order) VALUES
  ('React', 90, 'it', 'primary', 'primary', 1),
  ('Python', 85, 'it', 'primary', 'accent', 2),
  ('Embedded Systems', 80, 'it', 'primary', 'primary', 3),
  ('Web Development', 88, 'it', 'primary', 'accent', 4),
  ('App Development', 82, 'it', 'primary', 'primary', 5),
  ('SolidWorks', 92, 'engineering', 'primary', 'secondary', 1),
  ('FlexSim', 88, 'engineering', 'primary', 'orange', 2),
  ('Siemens NX', 85, 'engineering', 'primary', 'secondary', 3),
  ('PTC Creo', 87, 'engineering', 'primary', 'orange', 4),
  ('PTC Windchill', 83, 'engineering', 'primary', 'secondary', 5);

-- Seed default about content
INSERT INTO public.about_content (section_key, content) VALUES
  ('intro', '{"title": "Turning Vision Into Digital Reality", "paragraph1": "Hello! I''m Dharaneedharan SS, a passionate Full Stack Developer and CAD Engineer based in Namakkal, India. With over 3+ years of experience in web development and engineering design, I''ve had the privilege of working with innovative companies across IT and manufacturing domains.", "paragraph2": "My approach combines technical excellence with creative thinking, ensuring every project not only functions flawlessly but also delivers an exceptional user experience that drives business results."}'),
  ('highlights', '{"items": [{"icon": "Award", "text": "Award-winning designer"}, {"icon": "Target", "text": "Goal-oriented approach"}, {"icon": "Users", "text": "Team collaboration expert"}, {"icon": "Lightbulb", "text": "Creative problem solver"}]}');
