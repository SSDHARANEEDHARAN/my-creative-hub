
DELETE FROM work_experiences;

INSERT INTO work_experiences (title, company, location, duration, description, skills, category, sort_order) VALUES
(
  'Mechatronics Design Engineer',
  'Janatics India Pvt Ltd',
  'Coimbatore, India',
  'Sep 2023 – Present',
  'Designed Industry 4.0 based mechatronics systems. Developed robotics systems and cobot trainer kits. Integrated PLC, HMI, pneumatics and IIoT. Built modular automation systems for real-time industrial workflows.',
  ARRAY['Industry 4.0', 'Robotics', 'PLC', 'HMI', 'Pneumatics', 'IIoT', 'Cobot'],
  'engineering',
  1
),
(
  'Engine & ECU Diagnostics',
  'TV Sundram Iyengar & Sons Pvt Ltd',
  'Namakkal, India',
  '2020 – 2021',
  'Worked on engine and ECU diagnostics for automotive systems.',
  ARRAY['Engine Diagnostics', 'ECU', 'Automotive'],
  'engineering',
  2
),
(
  'Inline Sales Executive',
  'Rinex Technology Pvt Ltd',
  'Mangalore, India',
  '2023 – 2023',
  'Worked as an inline sales executive for technology products.',
  ARRAY['Sales', 'Technology', 'Client Relations'],
  'engineering',
  3
);
