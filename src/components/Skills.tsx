import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Cog, Briefcase, Calendar, MapPin } from "lucide-react";

interface WorkExperience {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  skills: string[];
  category: "it" | "engineering";
}

const workExperiences: WorkExperience[] = [
  // IT Experiences
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Infosys Limited",
    location: "Chennai, India",
    duration: "2023 - Present",
    description: "Leading development of enterprise web applications using React and Node.js. Architecting microservices and implementing CI/CD pipelines. Managing a team of 4 junior developers.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    category: "it",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "TCS (Tata Consultancy Services)",
    location: "Bangalore, India",
    duration: "2022 - 2023",
    description: "Developed IoT dashboards and real-time monitoring systems. Built RESTful APIs and integrated with industrial sensors and PLCs for manufacturing clients.",
    skills: ["React", "Python", "MongoDB", "IoT", "MQTT"],
    category: "it",
  },
  {
    id: 3,
    title: "Software Developer",
    company: "Zoho Corporation",
    location: "Chennai, India",
    duration: "2021 - 2022",
    description: "Worked on Zoho CRM customizations and integrations. Developed mobile applications using React Native for enterprise clients.",
    skills: ["React Native", "JavaScript", "REST API", "Firebase"],
    category: "it",
  },
  {
    id: 4,
    title: "Software Developer Intern",
    company: "Wipro Technologies",
    location: "Hyderabad, India",
    duration: "2020 - 2021",
    description: "Trained in full stack development using MERN stack. Contributed to client projects involving data analytics dashboards and automation tools.",
    skills: ["React", "Node.js", "MongoDB", "Express.js"],
    category: "it",
  },
  // Engineering Experiences
  {
    id: 5,
    title: "Senior CAD Design Engineer",
    company: "Mahindra & Mahindra",
    location: "Chennai, India",
    duration: "2023 - Present",
    description: "Leading powertrain component design using SolidWorks and PTC Creo. Performing advanced FEA simulations and managing engineering changes through Windchill PLM.",
    skills: ["SolidWorks", "PTC Creo", "Windchill", "FEA", "GD&T"],
    category: "engineering",
  },
  {
    id: 6,
    title: "CAD Design Engineer",
    company: "Sundram Fasteners",
    location: "Chennai, India",
    duration: "2022 - 2023",
    description: "Designed automotive components for Tier-1 manufacturing. Created manufacturing drawings with GD&T specifications and managed product data in enterprise PLM systems.",
    skills: ["SolidWorks", "CATIA V5", "GD&T", "AutoCAD"],
    category: "engineering",
  },
  {
    id: 7,
    title: "Simulation Engineer",
    company: "Ashok Leyland",
    location: "Chennai, India",
    duration: "2021 - 2022",
    description: "Developed FlexSim simulations for assembly line optimization. Achieved 25% throughput improvement through bottleneck analysis and layout optimization.",
    skills: ["FlexSim", "Simulation", "Lean Manufacturing", "Six Sigma"],
    category: "engineering",
  },
  {
    id: 8,
    title: "Engineering Intern",
    company: "TAFE (Tractors and Farm Equipment)",
    location: "Chennai, India",
    duration: "2020 - 2021",
    description: "Supported CAD modeling and drafting activities. Learned industrial engineering principles and participated in kaizen projects for process improvement.",
    skills: ["AutoCAD", "SolidWorks", "Technical Drawing", "5S"],
    category: "engineering",
  },
];

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const itSkills = [
    { name: "React", level: 90, color: "hsl(var(--primary))" },
    { name: "Python", level: 85, color: "hsl(var(--accent))" },
    { name: "Embedded Systems", level: 80, color: "hsl(var(--primary))" },
    { name: "Web Development", level: 88, color: "hsl(var(--accent))" },
    { name: "App Development", level: 82, color: "hsl(var(--primary))" },
  ];

  const nonItSkills = [
    { name: "SolidWorks", level: 92, color: "hsl(var(--secondary))" },
    { name: "FlexSim", level: 88, color: "hsl(var(--orange))" },
    { name: "Siemens NX", level: 85, color: "hsl(var(--secondary))" },
    { name: "PTC Creo", level: 87, color: "hsl(var(--orange))" },
    { name: "PTC Windchill", level: 83, color: "hsl(var(--secondary))" },
  ];

  const itTechnologies = [
    "JavaScript", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", 
    "Docker", "Git", "REST API", "Arduino", "Raspberry Pi", "IoT"
  ];

  const nonItTechnologies = [
    "CAD Design", "3D Modeling", "Simulation", "PLM", "Manufacturing", 
    "Product Design", "FEA Analysis", "CAM", "Technical Drawing"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const itExperiences = workExperiences.filter(exp => exp.category === "it");
  const engExperiences = workExperiences.filter(exp => exp.category === "engineering");

  return (
    <section id="skills" ref={sectionRef} className="py-24 bg-background bg-mesh">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">
            Expertise
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A comprehensive toolkit spanning both IT and Engineering domains, refined through years of hands-on experience.
          </p>
        </div>

        {/* IT Skills Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Cpu className="text-primary-foreground" size={24} />
            </div>
            <h3 className="font-display text-2xl font-bold">IT & Software Development</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-12">
            <div className="space-y-6">
              {itSkills.map((skill, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <h4 className="font-display text-lg font-semibold mb-6 text-muted-foreground">Related Technologies</h4>
              <div className="flex flex-wrap gap-3">
                {itTechnologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 bg-card text-foreground rounded-xl font-medium text-sm 
                               border-2 border-border hover:border-primary hover:bg-primary/10 
                               transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* IT Work Experience */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-primary" size={20} />
              <h4 className="font-display text-lg font-semibold text-muted-foreground">Work Experience</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {itExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-5 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <h5 className="font-display font-semibold text-foreground mb-1">{exp.title}</h5>
                  <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Non-IT Skills Section */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-orange flex items-center justify-center">
              <Cog className="text-secondary-foreground" size={24} />
            </div>
            <h3 className="font-display text-2xl font-bold">Engineering & CAD Tools</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-12">
            <div className="space-y-6">
              {nonItSkills.map((skill, index) => (
                <motion.div 
                  key={index} 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + index * 0.15, ease: "easeOut" }}
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <h4 className="font-display text-lg font-semibold mb-6 text-muted-foreground">Related Technologies</h4>
              <div className="flex flex-wrap gap-3">
                {nonItTechnologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="px-4 py-2 bg-card text-foreground rounded-xl font-medium text-sm 
                               border-2 border-border hover:border-secondary hover:bg-secondary/10 
                               transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Engineering Work Experience */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="text-accent" size={20} />
              <h4 className="font-display text-lg font-semibold text-muted-foreground">Work Experience</h4>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {engExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-5 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300"
                >
                  <h5 className="font-display font-semibold text-foreground mb-1">{exp.title}</h5>
                  <p className="text-accent font-medium text-sm mb-2">{exp.company}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { value: "3+", label: "Years Experience" },
            { value: "25+", label: "Projects Done" },
            { value: "10+", label: "Technologies" },
            { value: "5+", label: "CAD Tools" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="text-center p-6 bg-card rounded-3xl border-2 border-border hover:border-primary/50 transition-colors"
            >
              <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
