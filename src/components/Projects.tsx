import { Github, ArrowUpRight, Cpu, Cog, FileText, ExternalLink, Eye, Heart, BookOpen, MessageSquare, Factory } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, memo, useCallback, useMemo } from "react";
import ProjectImageCarousel from "./ProjectImageCarousel";
import { itProjects, engineeringProjects, Project } from "@/data/projectsData";
import { useProjectListCounts } from "@/hooks/useProjectData";

// Memoized project card components for better performance
const ProjectLinks = memo(({ project }: { project: Project }) => {
  return (
    <div className="flex gap-2">
      {project.liveUrl && (
        <a 
          href={project.liveUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-card text-foreground hover:bg-muted transition-colors shadow-md border-2 border-border"
          title="View Live"
        >
          <ExternalLink size={16} />
        </a>
      )}
      {project.articleUrl && (
        <a 
          href={project.articleUrl} 
          className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          title="Read Case Study"
        >
          <FileText size={16} />
        </a>
      )}
      {project.githubUrl && (
        <a 
          href={project.githubUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-card text-foreground hover:bg-muted transition-colors shadow-md border-2 border-border"
          title="View on GitHub"
        >
          <Github size={16} />
        </a>
      )}
    </div>
  );
});
ProjectLinks.displayName = 'ProjectLinks';

const SmallProjectLinks = memo(({ project }: { project: Project }) => {
  return (
    <div className="flex gap-2">
      {project.liveUrl && (
        <a 
          href={project.liveUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-secondary text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          title="View Live"
        >
          <ExternalLink size={14} />
        </a>
      )}
      {project.articleUrl && (
        <a 
          href={project.articleUrl} 
          className="p-2 bg-secondary text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          title="Read Case Study"
        >
          <FileText size={14} />
        </a>
      )}
      {project.githubUrl && (
        <a 
          href={project.githubUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-secondary text-secondary-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          title="View on GitHub"
        >
          <Github size={14} />
        </a>
      )}
    </div>
  );
});
SmallProjectLinks.displayName = 'SmallProjectLinks';

const Projects = () => {
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");
  const projects = activeTab === "it" ? itProjects : engineeringProjects;
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const projectIds = useMemo(() => projects.map(p => String(p.id)), [projects]);
  const { viewCounts, likeCounts, readCounts, commentCounts } = useProjectListCounts(projectIds);

  const handleTabChange = useCallback((tab: "it" | "engineering") => {
    setActiveTab(tab);
  }, []);

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-mesh">
      {/* Background decoration */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-2/3 bg-primary/5 -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
            <span className="section-badge-dot-sharp" />
            <span className="text-secondary-foreground font-medium text-xs sm:text-sm">My Work</span>
          </div>
          
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-10 px-4">
            A curated selection of my best work across IT and Engineering domains.
          </p>

          {/* Category Tabs - Sharp Design */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-secondary">
            <button
              onClick={() => handleTabChange("it")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 font-medium transition-all duration-200 w-full sm:w-auto text-sm sm:text-base ${
                activeTab === "it" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu size={16} />
              IT Projects ({itProjects.length})
            </button>
            <button
              onClick={() => handleTabChange("engineering")}
              className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 font-medium transition-all duration-200 w-full sm:w-auto text-sm sm:text-base ${
                activeTab === "engineering" 
                  ? "bg-accent text-accent-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cog size={16} />
              Engineering ({engineeringProjects.length})
            </button>
          </div>
        </div>

        {/* Featured Projects - Large Cards */}
        <div 
          key={activeTab}
          className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 animate-fade-in"
        >
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="group sharp-card overflow-hidden hover:border-primary/30 transition-all duration-200 hover-lift"
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                {project.images && project.images.length > 0 ? (
                  <>
                    <ProjectImageCarousel images={project.images} title={project.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-6 text-center">
                    <span className="font-display font-bold text-xl sm:text-2xl text-primary animate-pulse">Update in Progress</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`px-3 py-1 text-xs font-medium ${
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
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary text-xs font-medium text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Eye size={14} className="text-primary/70" />
                    <span>{viewCounts[project.id] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Heart size={14} className="text-primary/70" />
                    <span>{likeCounts[project.id] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <BookOpen size={14} className="text-primary/70" />
                    <span>{readCounts[project.id] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <MessageSquare size={14} className="text-primary/70" />
                    <span>{commentCounts[project.id] || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects - Smaller Cards */}
        <div 
          key={`other-${activeTab}`}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-10 animate-fade-in"
        >
          {otherProjects.map((project) => (
            <div 
              key={project.id}
              className="group sharp-card overflow-hidden hover:border-primary/30 transition-all duration-200 hover-lift p-4"
            >
              <div className="relative overflow-hidden aspect-video mb-4">
                {project.images && project.images.length > 0 ? (
                  <ProjectImageCarousel images={project.images} title={project.title} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4 text-center">
                    <span className="font-display font-bold text-lg text-primary animate-pulse">Update in Progress</span>
                  </div>
                )}
              </div>
              <h3 className="font-display text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground mb-4">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Eye size={12} />
                  <span>{viewCounts[project.id] || 0}</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Heart size={12} />
                  <span>{likeCounts[project.id] || 0}</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <BookOpen size={12} />
                  <span>{readCounts[project.id] || 0}</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <MessageSquare size={12} />
                  <span>{commentCounts[project.id] || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <SmallProjectLinks project={project} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none border-2">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
