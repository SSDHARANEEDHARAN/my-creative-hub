import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { memo, useEffect, useState, useRef } from "react";
import { ArrowLeft, Clock, User, Briefcase, CheckCircle, Lightbulb, Wrench, Users, Building, Target, ExternalLink, Eye, Heart, MessageSquare } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/data/articleContent";
import { engineeringProjects, itProjects } from "@/data/projectsData";
import ProjectDownloadDialog from "@/components/ProjectDownloadDialog";
import { useDownloadCount } from "@/hooks/useDownloadCount";
import { useProjectViewLikes } from "@/hooks/useProjectData";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import ProjectComments from "@/components/ProjectComments";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ArticlePage = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const project = article ? (engineeringProjects.find(p => p.id === article.id) || itProjects.find(p => p.articleUrl?.includes(slug!))) : undefined;
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { count: projectDownloadCount, refresh: refreshProjectDownloads } = useDownloadCount("project", project ? String(project.id) : "");
  
  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.user_metadata?.display_name || guest?.name || null;
  
  const { viewCount, likeCount, hasLiked, toggleLike } = useProjectViewLikes(
    project ? String(project.id) : "",
    currentUserEmail,
    currentUserName
  );
  
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    if (!project) return;
    supabase
      .from("project_comments_public")
      .select("id")
      .eq("project_id", String(project.id))
      .eq("is_approved", true)
      .then(({ data }) => setCommentCount(data?.length || 0));
  }, [project]);

  const handleLike = () => {
    if (!currentUserEmail || !currentUserName) {
      toast({ title: "Please sign in or enter as guest to like", variant: "destructive" });
      return;
    }
    toggleLike(currentUserName, currentUserEmail);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/projects" className="text-primary hover:underline">
              ← Back to Projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Case Study - Dharaneedharan SS</title>
        <meta name="description" content={article.overview.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-20">
          {/* Hero Section */}
          <section 
            className="relative py-8 sm:py-12 md:py-16 bg-mesh"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            <div className="container mx-auto px-4 sm:px-6">
              <Link 
                to="/projects" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                Back to Projects
              </Link>
              
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project?.tags || article.technologies || []).map((tag) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                   <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                    {article.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6">
                    {article.subtitle}
                  </p>
                  
                  {/* View Live Site button for any project with a live URL */}
                  {project?.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors mb-6 sm:mb-8"
                    >
                      <ExternalLink size={18} />
                      View Live Project
                    </a>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-primary" />
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{article.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={16} className="text-primary" />
                      <div>
                        <p className="text-muted-foreground">Client</p>
                        <p className="font-medium text-xs">{article.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-primary" />
                      <div>
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium">{article.role}</p>
                      </div>
                    </div>
                    {article.teamSize && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-accent" />
                        <div>
                          <p className="text-muted-foreground">Team Size</p>
                          <p className="font-medium">{article.teamSize}</p>
                        </div>
                      </div>
                    )}
                    {article.industry && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building size={16} className="text-accent" />
                        <div>
                          <p className="text-muted-foreground">Industry</p>
                          <p className="font-medium text-xs">{article.industry}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  {project?.images?.[0] ? (
                    <img 
                      src={project.images[0]} 
                      alt={article.title}
                      className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="rounded-2xl shadow-2xl w-full aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-primary">{article.title}</h3>
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/50 to-transparent" />
                </div>
              </div>

              {/* Key Metrics */}
              {article.keyMetrics && article.keyMetrics.length > 0 && (
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {article.keyMetrics.map((metric, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-card rounded-xl border border-border text-center hover:border-primary/50 transition-colors"
                    >
                      <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{metric.value}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Views, Likes, Comments Stats */}
              {project && (
                <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye size={16} />
                    {viewCount} views
                  </span>
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-primary' : 'hover:text-primary'}`}
                  >
                    <Heart size={16} className={hasLiked ? 'fill-primary' : ''} />
                    {likeCount} likes
                  </button>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={16} />
                    {commentCount} Comments
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Content Section */}
          <section ref={contentRef} className="py-8 sm:py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
              {/* Overview */}
              <div 
                className="mb-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '100ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                  Project Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {article.overview}
                </p>
              </div>

              {/* Challenge */}
              <div 
                className="mb-12 p-6 bg-destructive/5 border border-destructive/20 rounded-2xl"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '200ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-4 text-destructive">
                  The Challenge
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {article.challenge}
                </p>
              </div>

              {/* Solution */}
              <div 
                className="mb-12 p-6 bg-accent/5 border border-accent/20 rounded-2xl"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '300ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-4 text-accent">
                  The Solution
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {article.solution}
                </p>
              </div>

              {/* Process */}
              <div 
                className="mb-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '400ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Wrench size={20} className="text-secondary" />
                  </div>
                  Design Process
                </h2>
                <div className="space-y-4">
                  {article.process.map((step, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div 
                className="mb-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '500ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CheckCircle size={20} className="text-accent" />
                  </div>
                  Key Results
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {article.results.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl"
                    >
                      <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
                      <p className="text-foreground">{result}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies & Tools */}
              <div 
                className="mb-12 grid md:grid-cols-2 gap-6"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '600ms'
                }}
              >
                <div>
                  <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                    <Target size={20} className="text-primary" />
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {article.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-2 bg-card border-2 border-border rounded-xl font-medium text-sm hover:border-primary/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {article.toolsUsed && article.toolsUsed.length > 0 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                      <Wrench size={20} className="text-accent" />
                      Tools & Software
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {article.toolsUsed.map((tool) => (
                        <span 
                          key={tool}
                          className="px-3 py-2 bg-accent/10 border border-accent/20 rounded-xl font-medium text-sm text-accent"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lessons Learned */}
              <div 
                className="p-6 bg-primary/5 border border-primary/20 rounded-2xl"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '700ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-3">
                  <Lightbulb size={24} className="text-primary" />
                  Lessons Learned
                </h2>
                <ul className="space-y-3">
                  {article.lessons.map((lesson, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-muted-foreground">{lesson}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image Gallery */}
              <div 
                className="mt-12"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '800ms'
                }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(project?.images || []).slice(1).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${article.title} - Image ${index + 2}`}
                      className="rounded-xl aspect-video object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>

              {/* Conclusion Videos */}
              {(article.conclusionVideoUrls?.length || article.conclusionVideoUrl) && (
                <div 
                  className="mt-12"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out',
                    transitionDelay: '820ms'
                  }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Project Demo Video</h2>
                  {article.conclusionVideoUrls && article.conclusionVideoUrls.length > 0 ? (
                    <div className={`grid gap-4 ${article.conclusionVideoUrls.length >= 2 ? 'md:grid-cols-2' : ''}`}>
                      {article.conclusionVideoUrls.map((videoUrl, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-border">
                          <video
                            src={videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full aspect-video object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : article.conclusionVideoUrl ? (
                    <div className="rounded-xl overflow-hidden border border-border">
                      <video
                        src={article.conclusionVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {project?.category === "engineering" ? (
                <div 
                  className="mt-8 sm:mt-12 p-4 sm:p-6 md:p-8 bg-secondary/30 border border-border"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out',
                    transitionDelay: '850ms'
                  }}
                >
                  <h3 className="font-display text-xl font-bold mb-3">Download Project Files</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Get the full case study as PDF or download the SolidWorks/STEP CAD files for this project.
                  </p>
                  <ProjectDownloadDialog
                    projectId={project?.id || article.id}
                    projectTitle={project?.title || article.title}
                    projectDescription={project?.description || article.overview}
                    tags={project?.tags || article.technologies || []}
                    images={project?.images}
                    downloadCount={projectDownloadCount}
                    onDownloaded={refreshProjectDownloads}
                  />
                </div>
              ) : project?.liveUrl ? (
                <div 
                  className="mt-8 sm:mt-12 p-4 sm:p-6 md:p-8 bg-secondary/30 border border-border"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out',
                    transitionDelay: '850ms'
                  }}
                >
                  <h3 className="font-display text-xl font-bold mb-3">Try It Live</h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Experience the project in action — visit the live site and explore all features.
                  </p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink size={18} />
                    View Live Site
                  </a>
                </div>
              ) : null}

              {/* Comments Section */}
              {project && (
                <div 
                  className="mt-8 sm:mt-12"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out',
                    transitionDelay: '870ms'
                  }}
                >
                  <ProjectComments projectId={String(project.id)} />
                </div>
              )}

              {/* CTA */}
              <div 
                className="mt-10 sm:mt-16 text-center p-4 sm:p-6 md:p-8 bg-card rounded-2xl border border-border"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '900ms'
                }}
              >
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Interested in Similar Projects?
                </h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                  Let's discuss how I can help with your engineering challenges.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Link 
                    to="/contact"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-center text-sm sm:text-base"
                  >
                    Get in Touch
                  </Link>
                  <Link 
                    to="/projects"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-card border-2 border-border rounded-xl font-medium hover:border-primary/50 transition-colors text-center text-sm sm:text-base"
                  >
                    View More Projects
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
});

ArticlePage.displayName = "ArticlePage";

export default ArticlePage;