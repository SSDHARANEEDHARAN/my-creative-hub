import { useEffect, useState } from "react";
import { Code, Palette, Zap, Coffee, Lightbulb, Users, Award, Target, Cpu, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: "Turning Vision Into\nDigital Reality",
    paragraph1: "Hello! I'm Dharaneedharan SS, a passionate Full Stack Developer and CAD Engineer based in Namakkal, India. With over 3+ years of experience in web development and engineering design, I've had the privilege of working with innovative companies across IT and manufacturing domains.",
    paragraph2: "My approach combines technical excellence with creative thinking, ensuring every project not only functions flawlessly but also delivers an exceptional user experience that drives business results.",
  });

  useEffect(() => {
    supabase.from("about_content").select("*").eq("section_key", "intro").single().then(({ data }) => {
      if (data?.content) {
        const c = data.content as Record<string, string>;
        setAboutData({
          title: c.title || aboutData.title,
          paragraph1: c.paragraph1 || aboutData.paragraph1,
          paragraph2: c.paragraph2 || aboutData.paragraph2,
        });
      }
    });
  }, []);

  const skills = [
    { icon: <Code size={24} />, title: "Development", desc: "React, TypeScript, Node.js, Next.js", color: "text-primary" },
    { icon: <Palette size={24} />, title: "Design", desc: "UI/UX, Figma, Branding, Prototyping", color: "text-accent" },
    { icon: <Zap size={24} />, title: "Performance", desc: "Optimization, SEO, Core Web Vitals", color: "text-primary" },
    { icon: <Coffee size={24} />, title: "Passion", desc: "Continuous Learning & Innovation", color: "text-accent" },
    { icon: <Cpu size={24} />, title: "Raspberry Pi", desc: "IoT, Embedded Linux, GPIO, Sensors", color: "text-primary" },
    { icon: <Bot size={24} />, title: "ROS 2", desc: "Robotics, Navigation, Simulation", color: "text-accent" },
  ];

  const highlights = [
    { icon: <Award size={20} />, text: "Award-winning designer" },
    { icon: <Target size={20} />, text: "Goal-oriented approach" },
    { icon: <Users size={20} />, text: "Team collaboration expert" },
    { icon: <Lightbulb size={20} />, text: "Creative problem solver" },
  ];

  const titleParts = aboutData.title.split("\n");

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/50 rounded-bl-[200px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-secondary-foreground font-medium text-sm">About Me</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 line-decoration pb-6">
              {titleParts[0]}
              {titleParts[1] && <span className="text-gradient block mt-2">{titleParts[1]}</span>}
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{aboutData.paragraph1}</p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{aboutData.paragraph2}</p>

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

          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.title} className="p-6 bg-card border-glow hover-lift group text-center">
                  <div className={`w-12 h-12 bg-secondary flex items-center justify-center mb-4 mx-auto ${skill.color} group-hover:scale-110 transition-transform duration-300`}>{skill.icon}</div>
                  <h3 className="font-display text-lg font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground text-sm">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
