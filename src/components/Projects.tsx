import { Github, ArrowUpRight, Cpu, Cog, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useState, memo, useCallback } from "react";
import ProjectImageCarousel from "./ProjectImageCarousel";
import { itProjects, engineeringProjects, Project } from "@/data/projectsData";

// Memoized project card components for better performance
const ProjectLinks = memo(({ project }: { project: Project }) => {
  if (project.category === "it") {
    return (
      <a 
        href={project.githubUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className="p-2.5 bg-card rounded-lg text-foreground hover:bg-muted transition-colors shadow-md border border-border"
        title="View on GitHub"
      >
        <Github size={16} />
      </a>
    );
  }
  return (
    <a 
      href={project.articleUrl} 
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
      title="Read Article"
    >
      <FileText size={16} />
    </a>
  );
});
ProjectLinks.displayName = 'ProjectLinks';

const SmallProjectLinks = memo(({ project }: { project: Project }) => {
  if (project.category === "it") {
    return (
      <a 
        href={project.githubUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-secondary rounded-lg text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        title="View on GitHub"
      >
        <Github size={14} />
      </a>
    );
  }
  return (
    <a 
      href={project.articleUrl} 
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-secondary rounded-lg text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
      title="Read Article"
    >
      <FileText size={14} />
    </a>
  );
});
SmallProjectLinks.displayName = 'SmallProjectLinks';

const Projects = () => {
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");
  const projects = activeTab === "it" ? itProjects : engineeringProjects;
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const handleTabChange = useCallback((tab: "it" | "engineering") => {
    setActiveTab(tab);
  }, []);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-mesh">
      {/* Background decoration */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-2/3 bg-primary/5 rounded-l-[80px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-badge mb-6">
            <span className="section-badge-dot" />
            <span className="text-secondary-foreground font-medium text-sm">My Work</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            A curated selection of my best work across IT and Engineering domains.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-secondary rounded-xl">
            <button
              onClick={() => handleTabChange("it")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "it" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu size={18} />
              IT Projects ({itProjects.length})
            </button>
            <button
              onClick={() => handleTabChange("engineering")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "engineering" 
                  ? "bg-accent text-accent-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cog size={18} />
              Engineering ({engineeringProjects.length})
            </button>
          </div>
        </div>

        {/* Featured Projects - Large Cards */}
        <div 
          key={activeTab}
          className="grid md:grid-cols-2 gap-6 mb-10 animate-fade-in"
        >
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-200 hover-lift"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <ProjectImageCarousel images={project.images} title={project.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 z-20">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    activeTab === "it" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent text-accent-foreground"
                  }`}>
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-20">
                  <ProjectLinks project={project} />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary text-xs font-medium rounded-md text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects - Smaller Cards */}
        <div 
          key={`other-${activeTab}`}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 animate-fade-in"
        >
          {otherProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-200 hover-lift p-4"
            >
              <div className="relative overflow-hidden aspect-video rounded-lg mb-4">
                <ProjectImageCarousel images={project.images} title={project.title} />
              </div>
              <h3 className="font-display text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex gap-2">
                <SmallProjectLinks project={project} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
