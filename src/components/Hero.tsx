import { Link } from "react-router-dom";
import { ArrowDown, Sparkles, Plane, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import SocialLinks from "./SocialLinks";
import ResumeButton from "./ResumeButton";

const Hero = () => {
  const highlights = [
    { icon: <Plane size={16} />, text: "15+ Countries Explored" },
    { icon: <MapPin size={16} />, text: "Based in San Francisco" },
    { icon: <Calendar size={16} />, text: "5+ Years in Tech" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-shape top-20 -left-20 w-96 h-96 bg-primary/20" style={{ animationDelay: "0s" }} />
        <div className="floating-shape bottom-20 -right-20 w-80 h-80 bg-accent/20" style={{ animationDelay: "2s" }} />
        <div className="floating-shape top-1/2 left-1/4 w-64 h-64 bg-sky-light/15" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" 
             style={{ background: "var(--gradient-glow)" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-8 animate-fade-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <Sparkles className="text-accent" size={16} />
            <span className="text-secondary-foreground font-medium text-sm">Available for Freelance Work</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            Hi, I'm <span className="text-gradient">Alex Chen</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            Creative Developer & Digital Nomad
          </p>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            I build beautiful web experiences while exploring the world. 
            Passionate about clean code, stunning design, and finding the best coffee shops in every city I visit.
          </p>

          {/* Quick Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full text-sm">
                <span className="text-primary">{item.icon}</span>
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
            <Link to="/about">
              <Button variant="hero" size="xl">
                Learn More About Me
              </Button>
            </Link>
            <ResumeButton variant="heroOutline" size="xl" />
          </div>

          <div className="flex items-center justify-center gap-4 animate-fade-up opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
            <span className="text-sm text-muted-foreground">Find me on</span>
            <SocialLinks />
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
