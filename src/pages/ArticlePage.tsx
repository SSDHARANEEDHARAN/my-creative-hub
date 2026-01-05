import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { memo, useEffect, useState, useRef } from "react";
import { ArrowLeft, Clock, User, Briefcase, CheckCircle, Lightbulb, Wrench, Users, Building, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/data/articleContent";
import { engineeringProjects } from "@/data/projectsData";

const ArticlePage = memo(() => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const project = article ? engineeringProjects.find(p => p.id === article.id) : undefined;
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!article || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
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
        <title>{article.title} | Case Study - Tharanee Tharan S.S</title>
        <meta name="description" content={article.overview.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-20">
          {/* Hero Section */}
          <section 
            className="relative py-16 bg-mesh"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            <div className="container mx-auto px-6">
              <Link 
                to="/projects" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={18} />
                Back to Projects
              </Link>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                    {article.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    {article.subtitle}
                  </p>
                  
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
                  <img 
                    src={project.images[0]} 
                    alt={article.title}
                    className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
                  />
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
            </div>
          </section>

          {/* Content Section */}
          <section ref={contentRef} className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
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
                  {project.images.slice(1).map((image, index) => (
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

              {/* CTA */}
              <div 
                className="mt-16 text-center p-8 bg-card rounded-2xl border border-border"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out',
                  transitionDelay: '900ms'
                }}
              >
                <h3 className="font-display text-2xl font-bold mb-4">
                  Interested in Similar Projects?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Let's discuss how I can help with your engineering challenges.
                </p>
                <div className="flex justify-center gap-4">
                  <Link 
                    to="/contact"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get in Touch
                  </Link>
                  <Link 
                    to="/projects"
                    className="px-6 py-3 bg-card border-2 border-border rounded-xl font-medium hover:border-primary/50 transition-colors"
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