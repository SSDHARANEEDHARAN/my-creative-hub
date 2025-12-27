import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store with cart, checkout, and Stripe payment integration. Built with React, Node.js, and MongoDB for seamless shopping experience.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "Stripe", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Dashboard Analytics",
    description: "Real-time analytics dashboard with beautiful charts, data visualization, and AI-powered insights for business intelligence.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["TypeScript", "D3.js", "Tailwind", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    id: 3,
    title: "Social Media App",
    description: "Modern social platform with real-time messaging, stories feature, and an engaging user interface for seamless connections.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    tags: ["Next.js", "Socket.io", "MongoDB", "Redis"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 4,
    title: "AI Portfolio Generator",
    description: "AI-powered tool that helps developers create stunning portfolios in minutes with customizable templates and smart content suggestions.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["React", "OpenAI", "Vercel", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 5,
    title: "Health & Fitness Tracker",
    description: "Comprehensive fitness app with workout plans, nutrition tracking, and progress analytics with beautiful data visualizations.",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
    tags: ["React Native", "Firebase", "Charts", "HealthKit"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
  {
    id: 6,
    title: "Task Management System",
    description: "Collaborative project management tool with Kanban boards, team chat, and automated workflows for productive teams.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    tags: ["Vue.js", "GraphQL", "AWS", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

const Projects = () => {
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-2/3 bg-accent/5 rounded-l-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-secondary-foreground font-medium text-sm">My Work</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A curated selection of my best work, showcasing expertise in building 
            beautiful, scalable, and user-centric web applications.
          </p>
        </div>

        {/* Featured Projects - Large Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-card rounded-3xl overflow-hidden border-glow hover-lift"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <a href={project.liveUrl} className="p-3 bg-primary rounded-xl text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                    <ExternalLink size={18} />
                  </a>
                  <a href={project.githubUrl} className="p-3 bg-card rounded-xl text-foreground hover:bg-secondary transition-colors shadow-lg border border-border">
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
                    <span key={tag} className="px-3 py-1.5 bg-secondary text-xs font-medium rounded-lg text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects - Smaller Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {otherProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-card rounded-2xl overflow-hidden border-glow hover-lift p-5"
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
                <a href={project.liveUrl} className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <ExternalLink size={16} />
                </a>
                <a href={project.githubUrl} className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Github size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

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
