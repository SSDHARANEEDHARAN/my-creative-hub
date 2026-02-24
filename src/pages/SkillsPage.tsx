import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef, memo } from "react";
import { Cpu, Cog } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const itSkills = [
  { name: "React", level: 90 },
  { name: "Python", level: 85 },
  { name: "Embedded Systems", level: 80 },
  { name: "Web Development", level: 88 },
  { name: "App Development", level: 82 },
];

const nonItSkills = [
  { name: "SolidWorks", level: 92 },
  { name: "FlexSim", level: 88 },
  { name: "Siemens NX", level: 85 },
  { name: "PTC Creo", level: 87 },
  { name: "PTC Windchill", level: 83 },
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
  skill: { name: string; level: number }; 
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
      <span className="font-medium text-foreground text-sm sm:text-base">{skill.name}</span>
      <span className="text-xs sm:text-sm text-muted-foreground font-mono">{skill.level}%</span>
    </div>
    <div className="h-2 sm:h-3 bg-muted overflow-hidden border border-border">
      <div
        className="h-full bg-foreground transition-all duration-1000 ease-out"
        style={{
          width: isVisible ? `${skill.level}%` : '0%',
          transitionDelay: `${delayOffset + index * 150}ms`
        }}
      />
    </div>
  </div>
));

SkillBar.displayName = "SkillBar";

const TechTag = memo(({ tech, index, isVisible, delayOffset = 0 }: { 
  tech: string; 
  index: number; 
  isVisible: boolean;
  delayOffset?: number;
}) => (
  <span
    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-card text-foreground font-medium text-xs sm:text-sm 
               border-2 border-border hover:border-foreground hover:bg-foreground hover:text-background
               transition-all duration-300 cursor-default"
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
        <title>Skills | Dharaneedharan SS - Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Explore technical skills in React, Python, Embedded Systems, SolidWorks, FlexSim, NX, Creo, and PTC Windchill." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 bg-mesh">
            <div className="container mx-auto px-4 sm:px-6">
              {/* Header */}
              <div 
                className="text-center mb-10 sm:mb-16 transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 block">
                  Expertise
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  Skills & <span className="text-gradient">Technologies</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                  A comprehensive toolkit spanning both IT and Engineering domains, refined through years of hands-on experience.
                </p>
              </div>

              {/* IT Skills Section */}
              <div className="mb-12 sm:mb-20">
                <div className="flex items-center gap-3 mb-6 sm:mb-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground flex items-center justify-center">
                    <Cpu className="text-background" size={20} />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold">IT & Software Development</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                  <div className="space-y-4 sm:space-y-6">
                    {itSkills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} isVisible={isVisible} delayOffset={100} />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-display text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-muted-foreground">Related Technologies</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {itTechnologies.map((tech, index) => (
                        <TechTag 
                          key={tech} 
                          tech={tech} 
                          index={index} 
                          isVisible={isVisible} 
                          delayOffset={200}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-IT Skills Section */}
              <div>
                <div className="flex items-center gap-3 mb-6 sm:mb-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted-foreground flex items-center justify-center">
                    <Cog className="text-background" size={20} />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold">Engineering & CAD Tools</h2>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                  <div className="space-y-4 sm:space-y-6">
                    {nonItSkills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} isVisible={isVisible} delayOffset={500} />
                    ))}
                  </div>

                  <div>
                    <h4 className="font-display text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-muted-foreground">Related Technologies</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {nonItTechnologies.map((tech, index) => (
                        <TechTag 
                          key={tech} 
                          tech={tech} 
                          index={index} 
                          isVisible={isVisible} 
                          delayOffset={600}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-20">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 sm:p-6 bg-card border-2 border-border hover:border-foreground transition-all duration-300"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      transitionDelay: `${1000 + index * 100}ms`
                    }}
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
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