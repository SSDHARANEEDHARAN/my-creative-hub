import { Code, Palette, Zap, Coffee } from "lucide-react";

const About = () => {
  const skills = [
    { icon: <Code size={24} />, title: "Development", desc: "React, TypeScript, Node.js" },
    { icon: <Palette size={24} />, title: "Design", desc: "UI/UX, Figma, Branding" },
    { icon: <Zap size={24} />, title: "Performance", desc: "Optimization & Speed" },
    { icon: <Coffee size={24} />, title: "Passion", desc: "Continuous Learning" },
  ];

  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-primary font-medium tracking-widest uppercase mb-4">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 line-decoration pb-4">
              Turning Vision Into
              <span className="text-gradient block mt-2">Digital Reality</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              With over 5 years of experience in web development and design, 
              I've had the privilege of working with startups and established 
              companies alike, helping them build products that users love.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              My approach combines technical expertise with creative thinking, 
              ensuring every project not only functions flawlessly but also 
              delivers an exceptional user experience.
            </p>

            <div className="flex flex-wrap gap-3">
              {["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "Figma"].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground border border-border hover:border-primary hover:text-primary transition-colors duration-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Content - Skills Grid */}
          <div className="grid grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={skill.title}
                className="p-6 bg-card rounded-2xl border-glow hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {skill.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
