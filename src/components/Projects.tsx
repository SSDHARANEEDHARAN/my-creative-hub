import { ExternalLink, Github, ArrowUpRight, Cpu, Cog } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

const itProjects = [
  {
    id: 1,
    title: "E-Commerce Web Platform",
    description: "Full-stack e-commerce website with React frontend, Node.js backend, payment integration, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "IoT Smart Home System",
    description: "Embedded system project with Arduino and Raspberry Pi for home automation with mobile app control.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    tags: ["Python", "Arduino", "IoT", "React Native"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 3,
    title: "Inventory Management App",
    description: "Cross-platform mobile application for stock management with barcode scanning and real-time sync.",
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800&h=600&fit=crop",
    tags: ["React Native", "Firebase", "Python"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Data Analytics Dashboard",
    description: "Real-time analytics dashboard with Python backend, data visualization, and automated reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["Python", "React", "PostgreSQL", "Charts"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const nonItProjects = [
  {
    id: 5,
    title: "Automotive Component Design",
    description: "3D CAD design of automotive parts using SolidWorks with FEA analysis and manufacturing drawings.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
    tags: ["SolidWorks", "FEA", "CAD"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 6,
    title: "Manufacturing Line Simulation",
    description: "FlexSim simulation of production line for optimization, bottleneck analysis, and efficiency improvement.",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
    tags: ["FlexSim", "Simulation", "Analysis"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 7,
    title: "Product Assembly Design",
    description: "Complex product assembly design using PTC Creo with motion analysis and interference checks.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    tags: ["PTC Creo", "NX", "Assembly"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 8,
    title: "PLM Implementation Project",
    description: "PTC Windchill implementation for product lifecycle management and document control system.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    tags: ["Windchill", "PLM", "Workflow"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const Projects = () => {
  const [activeTab, setActiveTab] = useState<"it" | "nonit">("it");
  const projects = activeTab === "it" ? itProjects : nonItProjects;
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-32 relative overflow-hidden bg-mesh">
      {/* Background decoration */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-2/3 bg-accent/5 rounded-l-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-foreground font-medium text-sm">My Work</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            A curated selection of my best work across IT and Engineering domains.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex items-center gap-2 p-2 bg-card border-2 border-border rounded-2xl">
            <button
              onClick={() => setActiveTab("it")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "it" 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Cpu size={18} />
              IT Projects
            </button>
            <button
              onClick={() => setActiveTab("nonit")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "nonit" 
                  ? "bg-secondary text-secondary-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Cog size={18} />
              Engineering Projects
            </button>
          </div>
        </div>

        {/* Featured Projects - Large Cards */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {featuredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-3xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover-lift"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    activeTab === "it" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  }`}>
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <a href={project.liveUrl} className="p-3 bg-primary rounded-xl text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                    <ExternalLink size={18} />
                  </a>
                  <a href={project.githubUrl} className="p-3 bg-card rounded-xl text-foreground hover:bg-muted transition-colors shadow-lg border border-border">
                    <Github size={18} />
                  </a>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="font-display text-2xl font-semibold mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-muted text-xs font-medium rounded-lg text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Other Projects - Smaller Cards */}
        <motion.div 
          key={`other-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {otherProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover-lift p-5"
            >
              <div className="relative overflow-hidden aspect-video rounded-xl mb-4">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex gap-2">
                <a href={project.liveUrl} className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <ExternalLink size={16} />
                </a>
                <a href={project.githubUrl} className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Github size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Button variant="heroOutline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
