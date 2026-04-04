import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Factory, Clock, CheckCircle, AlertCircle, Loader2, ShieldX, Clock3, Mail, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { industrialProjects } from "@/data/projectsData";
import ProjectImageCarousel from "@/components/ProjectImageCarousel";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useNavigate, Link } from "react-router-dom";

const IndustrialProjectsPage = () => {
  const { user, isAdmin, userStatus, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const isApproved = isAdmin || userStatus === "approved";
  const isRejected = userStatus === "restricted";
  const isPending = userStatus === "pending";

  if (authLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    navigate("/login", { state: { returnPath: "/industrial-projects" }, replace: true });
    return null;
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
                <h2 className="text-2xl font-bold text-foreground mb-3">Verification Rejected</h2>
                <p className="text-muted-foreground mb-6">
                  Your account verification has been rejected. Please contact the administrator for assistance.
                </p>
                <a
                  href="mailto:tharaneetharanss@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact tharaneetharanss@gmail.com
                </a>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">Go to Home</Button>
                </div>
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
                <div className="px-4 py-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Status:</span> Pending Approval
                </div>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">Go to Home</Button>
                </div>
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
              {industrialProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  {project.images && project.images.length > 0 && (
                    <div className="relative aspect-video overflow-hidden">
                      <ProjectImageCarousel images={project.images} title={project.title} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Industrial
                      </Badge>
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-secondary text-xs font-medium text-secondary-foreground rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.articleUrl && (
                      <Link
                        to={project.articleUrl}
                        className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                      >
                        <FileText size={14} />
                        Read Case Study
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default IndustrialProjectsPage;
