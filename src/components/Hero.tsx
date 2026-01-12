import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Cpu, MapPin, Calendar, Zap } from "lucide-react";
import { Button } from "./ui/button";
import SocialLinks from "./SocialLinks";
import ResumeButton from "./ResumeButton";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const highlights = [
    { icon: <Cpu size={16} />, text: "Full Stack Developer" },
    { icon: <MapPin size={16} />, text: "CAD & PLM Expert" },
    { icon: <Calendar size={16} />, text: "3+ Years Experience" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/20 to-violet-light/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-secondary/15 to-orange-light/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-card/80 backdrop-blur-xl border-2 border-border mb-6 sm:mb-10"
          >
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-foreground opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 bg-foreground"></span>
            </span>
            <span className="text-foreground font-medium text-xs sm:text-sm">Available for Freelance Work</span>
            <Sparkles className="text-muted-foreground" size={14} />
          </motion.div>
          
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-8 leading-[1.1] tracking-tight"
          >
            Hi, I'm{" "}
            <span className="text-gradient relative">
              Tharanee Tharan S.S
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-2 bg-foreground origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <Zap className="text-muted-foreground" size={18} />
            <p className="text-lg sm:text-2xl md:text-3xl font-display font-semibold text-foreground">
              Full Stack Developer & CAD Engineer
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-muted-foreground text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-4 sm:px-0"
          >
            I build modern web applications and design engineering solutions. 
            Passionate about React, Python, embedded systems, and CAD tools like SolidWorks and Creo.
          </motion.p>

          {/* Quick Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-foreground text-xs sm:text-sm transition-colors"
              >
                <span className="text-foreground">{item.icon}</span>
                <span className="text-foreground font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 px-4 sm:px-0"
          >
            <Link to="/about" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Learn More About Me
              </Button>
            </Link>
            <div className="w-full sm:w-auto">
              <ResumeButton variant="heroOutline" size="xl" className="w-full sm:w-auto" />
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <span className="text-sm text-muted-foreground">Find me on</span>
            <SocialLinks />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;