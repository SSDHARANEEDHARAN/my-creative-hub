import { ArrowDown, Github, Linkedin, Twitter, Sparkles, Code2, Palette } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "5+", label: "Years Experience" },
    { value: "30+", label: "Happy Clients" },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-shape top-20 -left-20 w-96 h-96 bg-primary/20" style={{ animationDelay: "0s" }} />
        <div className="floating-shape bottom-20 -right-20 w-80 h-80 bg-accent/20" style={{ animationDelay: "2s" }} />
        <div className="floating-shape top-1/2 left-1/4 w-64 h-64 bg-sky-light/15" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" 
             style={{ background: "var(--gradient-glow)" }} />
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-32 right-20 hidden lg:block animate-float">
        <div className="p-4 bg-card rounded-2xl border border-border shadow-lg">
          <Code2 className="text-primary" size={28} />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
        <div className="p-4 bg-card rounded-2xl border border-border shadow-lg">
          <Palette className="text-accent" size={28} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-8 animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <Sparkles className="text-accent" size={16} />
            <span className="text-secondary-foreground font-medium text-sm">Available for Freelance Work</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            Hi, I'm <span className="text-gradient">Alex Chen</span>
            <span className="block mt-2 text-4xl md:text-5xl lg:text-6xl text-muted-foreground font-medium">
              Creative Developer & Designer
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            I craft beautiful, high-performance web experiences that captivate users and drive results. 
            Specializing in <span className="text-primary font-medium">React</span>, <span className="text-accent font-medium">TypeScript</span>, and <span className="text-primary font-medium">modern UI/UX</span> design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
            <Button variant="hero" size="xl" onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}>
              Explore My Work
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Let's Connect
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16 animate-fade-up opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}>
            <span className="text-sm text-muted-foreground">Find me on</span>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-wider uppercase">Scroll Down</span>
            <ArrowDown size={20} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
