import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ResumeButton from "@/components/ResumeButton";
import { Code, Cpu, Settings, Wrench, GraduationCap, Briefcase, Target, Lightbulb, MapPin, Calendar, Building2, Award, Mail, Phone, Linkedin, Github } from "lucide-react";

const AboutPage = () => {
  const skills = [
    { icon: <Code size={24} />, title: "Web Development", desc: "React, Python, Full-Stack Apps", color: "text-primary" },
    { icon: <Cpu size={24} />, title: "Embedded Systems", desc: "Arduino, IoT, Hardware Integration", color: "text-accent" },
    { icon: <Settings size={24} />, title: "CAD Engineering", desc: "SolidWorks, NX, Creo, Windchill", color: "text-primary" },
    { icon: <Wrench size={24} />, title: "Simulation", desc: "FlexSim, FEA, Process Optimization", color: "text-accent" },
  ];

  const highlights = [
    { icon: <GraduationCap size={20} />, text: "B.E. Mechanical Engineering" },
    { icon: <Target size={20} />, text: "Problem Solver" },
    { icon: <Briefcase size={20} />, text: "Cross-Domain Expert" },
    { icon: <Lightbulb size={20} />, text: "Innovative Thinker" },
  ];

  const experience = [
    {
      company: "Mahindra & Mahindra",
      role: "CAD Engineer Intern",
      duration: "Jun 2023 - Aug 2023",
      location: "Chennai, India",
      description: "Worked on automotive component design using SolidWorks and Siemens NX. Contributed to chassis optimization projects.",
      skills: ["SolidWorks", "Siemens NX", "GD&T", "DFMEA"]
    },
    {
      company: "L&T Technology Services",
      role: "PLM Intern",
      duration: "Jan 2023 - Mar 2023",
      location: "Chennai, India",
      description: "Managed product lifecycle using PTC Windchill. Assisted in engineering change management and BOM structuring.",
      skills: ["PTC Windchill", "PLM", "ECM", "BOM Management"]
    },
    {
      company: "Flipkart (Contract)",
      role: "Warehouse Simulation Analyst",
      duration: "Sep 2022 - Dec 2022",
      location: "Bangalore, India",
      description: "Developed FlexSim simulation models for warehouse optimization. Improved throughput efficiency by 25%.",
      skills: ["FlexSim", "Simulation", "Lean Manufacturing", "Data Analysis"]
    },
    {
      company: "Freelance",
      role: "Full Stack Developer",
      duration: "2021 - Present",
      location: "Remote",
      description: "Building web applications using React, Python, and IoT solutions. Delivered 10+ projects for clients globally.",
      skills: ["React", "Python", "Node.js", "IoT", "Arduino"]
    },
  ];

  const itStack = [
    { name: "React & Web Development", level: 90 },
    { name: "Python Programming", level: 85 },
    { name: "Embedded Systems", level: 80 },
    { name: "Mobile App Development", level: 75 },
  ];

  const cadStack = [
    { name: "SolidWorks", level: 92 },
    { name: "Siemens NX", level: 85 },
    { name: "PTC Creo", level: 88 },
    { name: "FlexSim Simulation", level: 80 },
    { name: "PTC Windchill", level: 78 },
  ];

  const certifications = [
    "Certified SolidWorks Associate (CSWA)",
    "Python for Data Science - IBM",
    "React Developer Certification",
    "FlexSim Simulation Basics",
  ];

  return (
    <>
      <Helmet>
        <title>About | Tharanee Tharan S.S - Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Learn more about Tharanee Tharan S.S, a versatile professional with expertise in IT development and CAD engineering." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          {/* Hero Profile Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/40 -z-10" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 -z-10" />
            
            <div className="container mx-auto px-6">
              <ScrollReveal>
                {/* Profile Card */}
                <div className="max-w-4xl mx-auto bg-card border-2 border-border p-8 md:p-12 sharp-card mb-16">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Profile Image Placeholder */}
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl md:text-5xl font-bold text-white shrink-0">
                      TT
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1">
                      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                        Tharanee Tharan S.S
                      </h1>
                      <p className="text-xl text-primary font-semibold mb-4">
                        Full Stack Developer & CAD Engineer
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-6">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-primary" />
                          Chennai, India
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} className="text-primary" />
                          tharaneetharanss@gmail.com
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} className="text-primary" />
                          +91 8870086023
                        </span>
                      </div>
                      
                      <div className="flex gap-3 mb-6">
                        <a href="https://www.linkedin.com/in/dharaneedharan-ss-70941a211/" target="_blank" rel="noopener noreferrer" 
                           className="w-10 h-10 bg-secondary border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300">
                          <Linkedin size={18} />
                        </a>
                        <a href="https://github.com/SSDHARANEEDHARAN" target="_blank" rel="noopener noreferrer"
                           className="w-10 h-10 bg-secondary border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300">
                          <Github size={18} />
                        </a>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {highlights.map((item) => (
                          <div key={item.text} className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-2 border border-border">
                            <div className="text-primary">{item.icon}</div>
                            <span className="text-xs font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* About Text */}
              <ScrollReveal delay={100}>
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="section-badge-sharp mb-6">
                    <span className="section-badge-dot-sharp" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">About Me</span>
                  </div>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    I'm a versatile professional with a unique blend of <span className="text-primary font-semibold">IT development</span> and 
                    <span className="text-accent font-semibold"> mechanical engineering</span> expertise. My journey spans across full-stack web development, 
                    embedded systems, and advanced CAD engineering.
                  </p>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    With hands-on experience in both IT and Non-IT domains, I bring a holistic approach to problem-solving. 
                    Whether it's building responsive web applications with React, developing IoT solutions, or designing complex 
                    assemblies in SolidWorks and NX, I thrive on creating solutions that make a difference.
                  </p>
                  
                  <ResumeButton />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Experience Section */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-badge-sharp mx-auto mb-6">
                    <Building2 size={16} className="text-primary" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">Work Experience</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">
                    Professional <span className="text-gradient">Journey</span>
                  </h2>
                </div>
              </ScrollReveal>

              <div className="max-w-4xl mx-auto space-y-6">
                {experience.map((exp, index) => (
                  <ScrollReveal key={exp.company} delay={index * 100}>
                    <div className="bg-card border-2 border-border p-6 md:p-8 sharp-card group hover:border-primary transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                        {/* Company Icon */}
                        <div className="w-14 h-14 bg-secondary border-2 border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                          <Building2 size={24} className="text-primary" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">{exp.role}</h3>
                              <p className="text-primary font-semibold">{exp.company}</p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {exp.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {exp.location}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{exp.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-secondary text-xs font-medium border border-border group-hover:border-primary/30 transition-colors">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <div className="section-badge-sharp mx-auto mb-6">
                    <Award size={16} className="text-primary" />
                    <span className="text-secondary-foreground font-medium text-sm uppercase tracking-wider">Expertise</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">
                    Skills & <span className="text-gradient">Proficiency</span>
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Skills Grid */}
                <ScrollReveal delay={100}>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div 
                        key={skill.title}
                        className="p-5 bg-card border-2 border-border sharp-card group hover:border-primary transition-all duration-300"
                      >
                        <div className={`w-11 h-11 bg-secondary border border-border flex items-center justify-center mb-3 ${skill.color} group-hover:scale-110 group-hover:border-primary transition-all duration-300`}>
                          {skill.icon}
                        </div>
                        <h3 className="font-display text-base font-semibold mb-1 group-hover:text-primary transition-colors">{skill.title}</h3>
                        <p className="text-muted-foreground text-sm">{skill.desc}</p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>

                {/* Certifications */}
                <ScrollReveal delay={200}>
                  <div className="bg-card border-2 border-border p-6 sharp-card h-full">
                    <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                      <Award size={18} className="text-primary" />
                      Certifications
                    </h3>
                    <div className="space-y-3">
                      {certifications.map((cert, index) => (
                        <div key={cert} className="flex items-center gap-3 p-3 bg-secondary/50 border border-border hover:border-primary/50 transition-colors">
                          <span className="w-6 h-6 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Proficiency Bars */}
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
                <ScrollReveal delay={300}>
                  <div className="bg-card border-2 border-border p-6 sharp-card">
                    <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                      <Code size={18} className="text-primary" />
                      IT Proficiency
                    </h3>
                    <div className="space-y-4">
                      {itStack.map((tech) => (
                        <div key={tech.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-muted-foreground">{tech.level}%</span>
                          </div>
                          <div className="skill-bar-sharp">
                            <div 
                              className="skill-bar-fill-sharp"
                              style={{ width: `${tech.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={400}>
                  <div className="bg-card border-2 border-border p-6 sharp-card">
                    <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                      <Settings size={18} className="text-accent" />
                      CAD & Engineering Proficiency
                    </h3>
                    <div className="space-y-4">
                      {cadStack.map((tech) => (
                        <div key={tech.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-muted-foreground">{tech.level}%</span>
                          </div>
                          <div className="skill-bar-sharp">
                            <div 
                              className="skill-bar-fill-sharp"
                              style={{ 
                                width: `${tech.level}%`,
                                background: "linear-gradient(135deg, hsl(172 66% 50%), hsl(199 89% 48%))"
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;