import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef, memo } from "react";
import { Cpu, Cog } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Done" },
  { value: "10+", label: "Technologies" },
  { value: "5+", label: "CAD Tools" },
];

const SkillBar = memo(({ skill, index, isVisible, delayOffset = 0 }: { 
  skill: { name: string; level: number; color: string }; 
  index: number; 
  isVisible: boolean;
  delayOffset?: number;
}) => (
  <div 
    className="space-y-3 transition-all duration-500"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
      transitionDelay: `${delayOffset + index * 100}ms`
    }}
  >
    <div className="flex justify-between items-center">
      <span className="font-medium text-foreground">{skill.name}</span>
      <span className="text-sm text-muted-foreground">{skill.level}%</span>
    </div>
    <div className="h-3 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: isVisible ? `${skill.level}%` : '0%',
          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
          transitionDelay: `${delayOffset + index * 150}ms`
        }}
      />
    </div>
  </div>
));

SkillBar.displayName = "SkillBar";

const TechTag = memo(({ tech, index, isVisible, delayOffset = 0, hoverClass }: { 
  tech: string; 
  index: number; 
  isVisible: boolean;
  delayOffset?: number;
  hoverClass: string;
}) => (
  <span
    className={`px-4 py-2 bg-card text-foreground rounded-xl font-medium text-sm 
               border-2 border-border ${hoverClass}
               transition-all duration-300 cursor-default`}
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
      transitionDelay: `${delayOffset + index * 50}ms`
    }}
  >
    {tech}
  </span>
));

TechTag.displayName = "TechTag";

const SkillsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Skills | Tharanee Tharan S.S - Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Explore technical skills in React, Python, Embedded Systems, SolidWorks, FlexSim, NX, Creo, and PTC Windchill." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section ref={sectionRef} className="py-24 bg-mesh">
            <div className="container mx-auto px-6">
              {/* Header */}
              <div 
                className="text-center mb-16 transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">
                  Expertise
                </span>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                  Skills & <span className="text-gradient">Technologies</span>
                </h1>
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
                  <h2 className="font-display text-2xl font-bold">IT & Software Development</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-6">
                    {itSkills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} isVisible={isVisible} delayOffset={100} />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-semibold mb-6 text-muted-foreground">Related Technologies</h4>
                    <div className="flex flex-wrap gap-3">
                      {itTechnologies.map((tech, index) => (
                        <TechTag 
                          key={tech} 
                          tech={tech} 
                          index={index} 
                          isVisible={isVisible} 
                          delayOffset={200}
                          hoverClass="hover:border-primary hover:bg-primary/10"
                        />
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
                  <h2 className="font-display text-2xl font-bold">Engineering & CAD Tools</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-6">
                    {nonItSkills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} isVisible={isVisible} delayOffset={500} />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-display text-lg font-semibold mb-6 text-muted-foreground">Related Technologies</h4>
                    <div className="flex flex-wrap gap-3">
                      {nonItTechnologies.map((tech, index) => (
                        <TechTag 
                          key={tech} 
                          tech={tech} 
                          index={index} 
                          isVisible={isVisible} 
                          delayOffset={600}
                          hoverClass="hover:border-secondary hover:bg-secondary/10"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center p-6 bg-card rounded-3xl border-2 border-border hover:border-primary/50 transition-all duration-300"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transitionDelay: `${1000 + index * 100}ms`
                    }}
                  >
                    <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default SkillsPage;