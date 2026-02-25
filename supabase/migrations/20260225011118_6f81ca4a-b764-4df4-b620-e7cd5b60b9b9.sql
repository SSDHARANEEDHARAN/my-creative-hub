
-- Work experiences table
CREATE TABLE public.work_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  skills text[] DEFAULT '{}',
  category text NOT NULL DEFAULT 'it',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work experiences" ON public.work_experiences FOR SELECT USING (true);
CREATE POLICY "Admins can create work experiences" ON public.work_experiences FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update work experiences" ON public.work_experiences FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete work experiences" ON public.work_experiences FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default work experiences from AboutPage
INSERT INTO public.work_experiences (title, company, location, duration, description, skills, category, sort_order) VALUES
  ('CAD Engineer Intern', 'Mahindra & Mahindra', 'Chennai, India', 'Jun 2023 - Aug 2023', 'Worked on automotive component design using SolidWorks and Siemens NX. Contributed to chassis optimization projects.', ARRAY['SolidWorks', 'Siemens NX', 'GD&T', 'DFMEA'], 'engineering', 1),
  ('PLM Intern', 'L&T Technology Services', 'Chennai, India', 'Jan 2023 - Mar 2023', 'Managed product lifecycle using PTC Windchill. Assisted in engineering change management and BOM structuring.', ARRAY['PTC Windchill', 'PLM', 'ECM', 'BOM Management'], 'engineering', 2),
  ('Warehouse Simulation Analyst', 'Flipkart (Contract)', 'Bangalore, India', 'Sep 2022 - Dec 2022', 'Developed FlexSim simulation models for warehouse optimization. Improved throughput efficiency by 25%.', ARRAY['FlexSim', 'Simulation', 'Lean Manufacturing', 'Data Analysis'], 'engineering', 3),
  ('Full Stack Developer', 'Freelance', 'Remote', '2021 - Present', 'Building web applications using React, Python, and IoT solutions. Delivered 10+ projects for clients globally.', ARRAY['React', 'Python', 'Node.js', 'IoT', 'Arduino'], 'it', 4);
