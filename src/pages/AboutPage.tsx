import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ResumeButton from "@/components/ResumeButton";
import { Code, Cpu, Settings, Wrench, GraduationCap, Briefcase, Target, Lightbulb } from "lucide-react";

const AboutPage = () => {
  const skills = [
    { icon: <Code size={24} />, title: "Web Development", desc: "React, Python, Full-Stack Apps", color: "text-primary" },
    { icon: <Cpu size={24} />, title: "Embedded Systems", desc: "Arduino, IoT, Hardware Integration", color: "text-accent" },
    { icon: <Settings size={24} />, title: "CAD Engineering", desc: "SolidWorks, NX, Creo, Windchill", color: "text-primary" },
    { icon: <Wrench size={24} />, title: "Simulation", desc: "FlexSim, FEA, Process Optimization", color: "text-accent" },
  ];

  const highlights = [
    { icon: <GraduationCap size={20} />, text: "Engineering Graduate" },
    { icon: <Target size={20} />, text: "Problem Solver" },
    { icon: <Briefcase size={20} />, text: "Cross-Domain Expert" },
    { icon: <Lightbulb size={20} />, text: "Innovative Thinker" },
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

  return (
    <>
      <Helmet>
        <title>About | Tharanee Tharan S.S - Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Learn more about Tharanee Tharan S.S, a versatile professional with expertise in IT development and CAD engineering." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/40 rounded-bl-[200px] -z-10" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-tr-[150px] -z-10" />
            
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <div className="section-badge mb-6">
                    <span className="section-badge-dot" />
                    <span className="text-secondary-foreground font-medium text-sm">About Me</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    Bridging Technology
                    <span className="text-gradient block mt-2">& Engineering</span>
                  </h1>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <ScrollReveal delay={100}>
                  <div>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      Hi, I'm <span className="text-foreground font-semibold">Tharanee Tharan S.S</span>, a versatile 
                      professional with a unique blend of IT development and mechanical engineering expertise. 
                      My journey spans across <span className="text-primary font-medium">full-stack web development</span>, 
                      <span className="text-accent font-medium"> embedded systems</span>, and 
                      <span className="text-primary font-medium"> advanced CAD engineering</span>.
                    </p>
                    
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      With hands-on experience in both IT and Non-IT domains, I bring a holistic approach 
                      to problem-solving. Whether it's building responsive web applications with React, 
                      developing IoT solutions, or designing complex assemblies in SolidWorks and NX, 
                      I thrive on creating solutions that make a difference.
                    </p>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                      My expertise in <span className="text-primary font-medium">FlexSim simulation</span> and 
                      <span className="text-accent font-medium"> PTC Windchill PLM</span> allows me to optimize 
                      manufacturing processes and manage product lifecycles effectively. I believe in continuous 
                      learning and staying at the forefront of technological advancements.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {highlights.map((item) => (
                        <div key={item.text} className="flex items-center gap-3 text-muted-foreground">
                          <div className="text-primary">{item.icon}</div>
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <ResumeButton />
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="space-y-8">
                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div 
                          key={skill.title}
                          className="p-5 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg group transition-all duration-300"
                        >
                          <div className={`w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3 ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                            {skill.icon}
                          </div>
                          <h3 className="font-display text-base font-semibold mb-1">{skill.title}</h3>
                          <p className="text-muted-foreground text-sm">{skill.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* IT Proficiency */}
                    <div className="bg-card p-6 rounded-2xl border border-border">
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
                            <div className="skill-bar">
                              <div 
                                className="skill-bar-fill"
                                style={{ width: `${tech.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CAD Proficiency */}
                    <div className="bg-card p-6 rounded-2xl border border-border">
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
                            <div className="skill-bar">
                              <div 
                                className="skill-bar-fill"
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
