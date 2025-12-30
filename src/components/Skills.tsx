import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Cog } from "lucide-react";

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
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
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
        </div>

        {/* Non-IT Skills Section */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-orange flex items-center justify-center">
              <Cog className="text-secondary-foreground" size={24} />
            </div>
            <h3 className="font-display text-2xl font-bold">Engineering & CAD Tools</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { value: "3+", label: "Years Experience" },
            { value: "20+", label: "Projects Done" },
            { value: "10+", label: "Technologies" },
            { value: "5+", label: "CAD Tools" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 + index * 0.1 }}
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