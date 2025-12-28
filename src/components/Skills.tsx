import { useEffect, useState, useRef } from "react";

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const skills = [
    { name: "React / Next.js", level: 95, color: "hsl(var(--primary))" },
    { name: "TypeScript", level: 90, color: "hsl(var(--accent))" },
    { name: "Node.js", level: 85, color: "hsl(var(--primary))" },
    { name: "UI/UX Design", level: 88, color: "hsl(var(--accent))" },
    { name: "Tailwind CSS", level: 92, color: "hsl(var(--primary))" },
    { name: "PostgreSQL", level: 80, color: "hsl(var(--accent))" },
  ];

  const technologies = [
    "JavaScript", "Python", "GraphQL", "Docker", "AWS", "Figma", 
    "Git", "MongoDB", "Redis", "Prisma", "Framer Motion", "Three.js"
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
    <section id="skills" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">
            Expertise
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A comprehensive toolkit refined through years of building digital products and exploring new technologies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Progress Bars */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-semibold mb-8">Core Proficiencies</h3>
            {skills.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${skill.level}%` : "0%",
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                      transitionDelay: `${index * 150}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Tags */}
          <div>
            <h3 className="font-display text-2xl font-semibold mb-8">Other Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium text-sm 
                             border border-border hover:border-primary hover:bg-primary/10 
                             transition-all duration-300 cursor-default animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-muted/50 rounded-2xl border border-border">
                <div className="text-3xl font-bold text-gradient mb-2">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-2xl border border-border">
                <div className="text-3xl font-bold text-gradient mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Projects Done</div>
              </div>
              <div className="text-center p-6 bg-muted/50 rounded-2xl border border-border">
                <div className="text-3xl font-bold text-gradient mb-2">20+</div>
                <div className="text-sm text-muted-foreground">Countries Visited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
