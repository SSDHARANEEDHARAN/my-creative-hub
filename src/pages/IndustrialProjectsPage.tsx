import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Factory, Loader2, ShieldX, Clock3, Mail, FileText, Eye, Heart, BookOpen, MessageSquare, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { industrialProjects } from "@/data/projectsData";
import { useProjectListCounts } from "@/hooks/useProjectData";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import ImageLightbox from "@/components/ImageLightbox";
import ProjectComments from "@/components/ProjectComments";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import LoginPopupModal from "@/components/LoginPopupModal";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const IndustrialProjectsPage = () => {
  const { user, isAdmin, userStatus, isLoading: authLoading } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

  const isApproved = isAdmin || userStatus === "approved";
  const isRejected = userStatus === "restricted" || userStatus === "rejected";
  const isPending = userStatus === "pending";
  const isTemporaryLocked = userStatus === "temporary_locked";
  const isBlocked = userStatus === "blocked";

  const currentUserEmail = user?.email || null;
  const currentUserName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || null;

  const projectIds = useMemo(() => industrialProjects.map(p => String(p.id)), []);
  const { viewCounts, likeCounts, readCounts, commentCounts, refresh: refreshCounts } = useProjectListCounts(projectIds);

  // Show login popup after loading if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => setShowLoginPopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

  // Track views for each industrial project (approved users only, once per session)
  useEffect(() => {
    if (!isApproved || !currentUserEmail) return;
    const trackViews = async () => {
      for (const project of industrialProjects) {
        const key = `project_viewed_${project.id}`;
        if (sessionStorage.getItem(key)) continue;
        sessionStorage.setItem(key, "1");
        await supabase.from("project_views").insert({
          project_id: String(project.id),
          viewer_email: currentUserEmail,
          viewer_name: currentUserName,
        });
      }
      refreshCounts();
    };
    trackViews();
  }, [isApproved, currentUserEmail, currentUserName, refreshCounts]);

  // Track reads when user clicks/enters a project detail (every click = +1 read)
  const handleReadProject = useCallback(async (projectId: number) => {
    if (!currentUserEmail) return;
    await supabase.from("project_reads").insert({
      project_id: String(projectId),
      reader_email: currentUserEmail,
      reader_name: currentUserName,
    });
    refreshCounts();
  }, [currentUserEmail, currentUserName, refreshCounts]);

  // Track if user already liked (from DB via counts hook)
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  // Check which projects user already liked from DB
  useEffect(() => {
    if (!currentUserEmail) return;
    const checkLikes = async () => {
      const { data } = await supabase
        .from("project_likes")
        .select("project_id")
        .eq("email", currentUserEmail)
        .in("project_id", projectIds);
      const likedMap: Record<string, boolean> = {};
      data?.forEach(item => { likedMap[item.project_id] = true; });
      setUserLikes(likedMap);
    };
    checkLikes();
  }, [currentUserEmail, projectIds]);

  const handleLikeProject = async (projectId: number) => {
    if (!currentUserEmail || !currentUserName) {
      setShowLoginPopup(true);
      return;
    }

    if (userLikes[String(projectId)]) {
      toast({ description: "You already liked this project." });
      return;
    }

    const { error } = await supabase.from("project_likes").insert({
      project_id: String(projectId),
      name: currentUserName,
      email: currentUserEmail,
    });

    if (!error) {
      setUserLikes(prev => ({ ...prev, [String(projectId)]: true }));
      toast({ description: "Project liked!" });
      refreshCounts();
      return;
    }

    if (error.code === "23505") {
      setUserLikes(prev => ({ ...prev, [String(projectId)]: true }));
      toast({ description: "You already liked this project." });
      return;
    }

    toast({ title: "Error", description: "Failed to like project.", variant: "destructive" });
  };

  // Loading state - wait for auth to fully load before rendering any content
  if (authLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  // Not logged in - show page with login popup overlay
  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md p-8"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Factory className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Industrial Projects</h2>
                <p className="text-muted-foreground mb-6">Sign in to access exclusive industrial-grade projects.</p>
                <Button onClick={() => setShowLoginPopup(true)} variant="default">
                  Sign In to Access
                </Button>
              </motion.div>
            </div>
          </main>
          <Footer />
          <LoginPopupModal
            isOpen={showLoginPopup}
            onClose={() => setShowLoginPopup(false)}
            title="Sign In Required"
            description="Sign in to access Industrial Projects"
          />
        </div>
      </PageTransition>
    );
  }

  if (isBlocked) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md p-8 bg-card border border-red-600/30 rounded-xl shadow-lg"
              >
                <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Ban className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Account Blocked</h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been blocked based on IP address. This action was taken to prevent disturbance to others.
                </p>
                <a
                  href="mailto:TharaneeTharanss@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact TharaneeTharanss@gmail.com
                </a>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (isRejected) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md p-8 bg-card border border-destructive/30 rounded-xl shadow-lg"
              >
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <ShieldX className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Verification Cancelled</h2>
                <p className="text-muted-foreground mb-6">
                  Verification cancelled. Please try again.
                </p>
                <a
                  href="mailto:tharaneetharanss@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact tharaneetharanss@gmail.com
                </a>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (isPending) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-24 pb-16">
            <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md p-8 bg-card border border-yellow-500/30 rounded-xl shadow-lg"
              >
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Clock3 className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Pending Verification</h2>
                <p className="text-muted-foreground mb-6">
                  Your account is awaiting admin verification. You'll be able to access Industrial Projects once approved.
                </p>
                <div className="px-4 py-3 bg-muted rounded-lg text-sm text-muted-foreground mb-6">
                  <span className="font-medium text-foreground">Status:</span> Pending Approval
                </div>
                <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm mb-6">
                  <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                    ⏱️ Please wait for 24 hours for admin review.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    If you don't see updates after 24 hours, kindly contact the administrator.
                  </p>
                </div>
                <a
                  href="mailto:TharaneeTharanss@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact TharaneeTharanss@gmail.com
                </a>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Factory className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Industrial Projects
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Exclusive industrial-grade projects — collaborative robotics, automation systems, and Industry 4.0 platforms.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {industrialProjects.map((project, index) => {
                const pid = String(project.id);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group sharp-card overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <div
                      className="relative aspect-video overflow-hidden cursor-pointer"
                      onClick={() => {
                        handleReadProject(project.id);
                        if (project.images && project.images.length > 0) {
                          setLightbox({
                            images: project.images.map((img, i) => ({ src: img, alt: `${project.title} - Image ${i + 1}` })),
                            index: 0,
                          });
                        }
                      }}
                    >
                      {project.images && project.images.length > 0 ? (
                        <ProjectImageCarousel images={project.images} title={project.title} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-6 text-center">
                          <span className="font-display font-bold text-2xl text-primary animate-pulse">Update in Progress</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded">
                          Industrial
                        </span>
                        {project.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Eye size={12} />
                          {viewCounts[pid] || 0}
                        </span>
                        <button
                          onClick={() => handleLikeProject(project.id)}
                          className="flex items-center gap-1 whitespace-nowrap hover:text-primary transition-colors"
                        >
                          <Heart
                            size={12}
                            className={userLikes[String(project.id)] ? "text-red-500 fill-red-500" : "text-primary/70"}
                          />
                          {likeCounts[pid] || 0}
                        </button>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <BookOpen size={12} />
                          {readCounts[pid] || 0}
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <MessageSquare size={12} />
                          {commentCounts[pid] || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {project.articleUrl ? (
                          <Link
                            to={project.articleUrl}
                            onClick={() => handleReadProject(project.id)}
                            className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                          >
                            Read More <FileText size={12} />
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-sm">Read More coming soon</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
        {/* Lightbox */}
        <ImageLightbox
          images={lightbox?.images || []}
          initialIndex={lightbox?.index || 0}
          isOpen={!!lightbox}
          onClose={() => setLightbox(null)}
        />
      </div>
    </PageTransition>
  );
};

export default IndustrialProjectsPage;
