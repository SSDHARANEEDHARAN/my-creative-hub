import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Code2, Cog, Eye, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import ImageLightbox from "@/components/ImageLightbox";
import { useProjectListCounts } from "@/hooks/useProjectData";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ProjectComments from "@/components/ProjectComments";
import {
  itProjects as sharedItProjects,
  engineeringProjects as sharedEngineeringProjects,
} from "@/data/projectsData";





const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || guest?.name || null;

  const projects = activeTab === "it" ? sharedItProjects : sharedEngineeringProjects;
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const projectIds = useMemo(
    () => [...sharedItProjects, ...sharedEngineeringProjects].map((project) => String(project.id)),
    []
  );
  const { viewCounts, likeCounts, refresh: refreshCounts } = useProjectListCounts(projectIds);

  const openLightbox = (images: string[], title: string, index: number) => {
    setLightboxImages(images.map((src, i) => ({ src, alt: `${title} - Image ${i + 1}` })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLikeProject = async (projectId: number) => {
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }

    const { error } = await supabase.from("project_likes").insert({
      project_id: String(projectId),
      name: currentUserName,
      email: currentUserEmail,
    });

    if (!error) {
      toast({ description: "Project liked!" });
      refreshCounts();
      return;
    }

    if (error.code === "23505") {
      toast({ description: "You already liked this project." });
      refreshCounts();
      return;
    }

    toast({ title: "Error", description: "Failed to update like count.", variant: "destructive" });
  };

  return (
    <>
      <Helmet>
        <title>Projects | Dharaneedharan SS - IT & Engineering Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of IT and Engineering projects including web applications, IoT systems, and CAD designs."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Header Section */}
        <section className="py-10 sm:py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
                <span className="section-badge-dot-sharp" />
                <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                My <span className="text-foreground">Projects</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                A collection of my work spanning IT development and Engineering design.
              </p>
            </motion.div>

            {/* Category Tabs - Sharp Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center mt-6 sm:mt-10 gap-2 sm:gap-4 px-4"
            >
              <button
                onClick={() => setActiveTab("it")}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 border-2 text-sm sm:text-base ${
                  activeTab === "it"
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border-border hover:border-foreground"
                }`}
              >
                <Code2 size={18} />
                IT Projects ({sharedItProjects.length})
              </button>
              <button
                onClick={() => setActiveTab("engineering")}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-all duration-300 border-2 text-sm sm:text-base ${
                  activeTab === "engineering"
                    ? "bg-foreground text-background border-foreground shadow-lg"
                    : "bg-card text-muted-foreground hover:bg-muted border-border hover:border-foreground"
                }`}
              >
                <Cog size={18} />
                Engineering ({sharedEngineeringProjects.length})
              </button>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Featured Section */}
                {featuredProjects.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-primary" />
                      Featured Projects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      {featuredProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group sharp-card overflow-hidden hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                              <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-6 text-center">
                                <span className="font-display font-bold text-2xl text-primary animate-pulse">Update in Progress</span>
                              </div>
                            )}
                            <div className="absolute top-4 left-4 z-10">
                              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold">
                                Featured
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye size={13} /> {viewCounts[String(project.id)] || 0} views</span>
                              <button onClick={() => handleLikeProject(project.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                                <Heart size={13} /> {likeCounts[String(project.id)] || 0} likes
                              </button>
                            </div>
                            <ProjectComments projectId={String(project.id)} />
                            <div className="flex items-center gap-4">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                  View Live <ExternalLink size={14} />
                                </a>
                              )}
                              {project.articleUrl && (
                                <Link
                                  to={project.articleUrl}
                                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                  Read Case Study <FileText size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Projects Grid */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-accent" />
                    All Projects
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {otherProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group sharp-card overflow-hidden hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          {project.images && project.images.length > 0 ? (
                            <ProjectImageCarousel images={project.images} title={project.title} onImageClick={(i) => openLightbox(project.images, project.title, i)} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4 text-center rounded-t-xl">
                              <span className="font-display font-bold text-lg text-primary animate-pulse">Update in Progress</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground relative">
                            <span className="flex items-center gap-1"><Eye size={12} /> {viewCounts[String(project.id)] || 0}</span>
                            <button onClick={() => handleLikeProject(project.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                              <Heart size={12} /> {likeCounts[String(project.id)] || 0}
                            </button>
                            <ProjectComments projectId={String(project.id)} compact />
                          </div>
                          <div className="flex items-center gap-3">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                View Live <ExternalLink size={12} />
                              </a>
                            )}
                            {project.articleUrl && (
                              <Link
                                to={project.articleUrl}
                                className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                              >
                                Read More <FileText size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
      <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
    </>
  );
};

export default ProjectsPage;
