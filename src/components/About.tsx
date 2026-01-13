import { Code, Palette, Zap, Coffee, Lightbulb, Users, Award, Target } from "lucide-react";
import { Button } from "./ui/button";

const About = () => {
  const skills = [
    { icon: <Code size={24} />, title: "Development", desc: "React, TypeScript, Node.js, Next.js", color: "text-primary" },
    { icon: <Palette size={24} />, title: "Design", desc: "UI/UX, Figma, Branding, Prototyping", color: "text-accent" },
    { icon: <Zap size={24} />, title: "Performance", desc: "Optimization, SEO, Core Web Vitals", color: "text-primary" },
    { icon: <Coffee size={24} />, title: "Passion", desc: "Continuous Learning & Innovation", color: "text-accent" },
  ];

  const highlights = [
    { icon: <Award size={20} />, text: "Award-winning designer" },
    { icon: <Target size={20} />, text: "Goal-oriented approach" },
    { icon: <Users size={20} />, text: "Team collaboration expert" },
    { icon: <Lightbulb size={20} />, text: "Creative problem solver" },
  ];

  const techStack = [
    { name: "React", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "Tailwind CSS", level: 95 },
    { name: "Node.js", level: 80 },
    { name: "Figma", level: 88 },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/50 rounded-bl-[200px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-secondary-foreground font-medium text-sm">About Me</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 line-decoration pb-6">
              Turning Vision Into
              <span className="text-gradient block mt-2">Digital Reality</span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Hello! I'm Tharaneetharan SS, a passionate Full Stack Developer and CAD Engineer based in Tamil Nadu, India. 
              With over <span className="text-foreground font-medium">3+ years of experience</span> in web development and engineering design, 
              I've had the privilege of working with innovative companies across IT and manufacturing domains.
            </p>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              My approach combines <span className="text-primary font-medium">technical excellence</span> with 
              <span className="text-accent font-medium"> creative thinking</span>, ensuring every project not only 
              functions flawlessly but also delivers an exceptional user experience that drives business results.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-muted-foreground">
                  <div className="text-primary">{item.icon}</div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Download Resume
            </Button>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={skill.title}
                  className="p-6 bg-card rounded-2xl border-glow hover-lift group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                    {skill.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground text-sm">{skill.desc}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack Progress */}
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-display text-xl font-semibold mb-6">Tech Proficiency</h3>
              <div className="space-y-4">
                {techStack.map((tech) => (
                  <div key={tech.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{tech.name}</span>
                      <span className="text-muted-foreground">{tech.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${tech.level}%`,
                          background: "var(--gradient-sky)"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
