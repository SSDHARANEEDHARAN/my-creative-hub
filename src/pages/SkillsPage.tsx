import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const SkillsPage = () => {
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
    <>
      <Helmet>
        <title>Skills | Alex Chen - Creative Developer</title>
        <meta name="description" content="Explore Alex Chen's technical skills and expertise in React, TypeScript, Node.js, UI/UX design, and more." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section ref={sectionRef} className="py-24">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="text-primary font-medium text-sm tracking-widest uppercase mb-4 block">
                    Expertise
                  </span>
                  <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                    Skills & <span className="text-gradient">Technologies</span>
                  </h1>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    A comprehensive toolkit refined through years of building digital products and exploring new technologies.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <ScrollReveal delay={100}>
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
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div>
                    <h3 className="font-display text-2xl font-semibold mb-8">Other Technologies</h3>
                    <div className="flex flex-wrap gap-3 mb-12">
                      {technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium text-sm 
                                     border border-border hover:border-primary hover:bg-primary/10 
                                     transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
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

export default SkillsPage;
