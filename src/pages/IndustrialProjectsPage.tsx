import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Factory, Clock, CheckCircle, AlertCircle, Loader2, ShieldX, Clock3, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";

interface IndustrialProject {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  created_at: string;
}

const IndustrialProjectsPage = () => {
  const [projects, setProjects] = useState<IndustrialProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin, userStatus, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const isApproved = isAdmin || userStatus === "approved";
  const isRejected = userStatus === "restricted";
  const isPending = userStatus === "pending";

  useEffect(() => {
    if (!isApproved) return;
    
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("industrial_projects")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data as IndustrialProject[]);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, [isApproved]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-primary" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "Upcoming";
    }
  };

  if (authLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  // Not logged in — redirect to login
  if (!user) {
    navigate("/login", { state: { returnPath: "/industrial-projects" }, replace: true });
    return null;
  }

  // Rejected / Restricted user
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
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Verification Rejected
                </h2>
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
                  <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
                    Go to Home
                  </Button>
                </div>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  // Pending user
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
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Pending Verification
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your account is awaiting admin verification. You'll be able to access Industrial Projects once your account is approved.
                </p>
                <div className="px-4 py-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Status:</span> Pending Approval
                </div>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
                    Go to Home
                  </Button>
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
                Explore our upcoming and ongoing industrial projects
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Factory className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground">Industrial projects will appear here once published.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(project.status)}
                      <Badge variant="outline" className="text-xs">
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.category}</span>
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default IndustrialProjectsPage;
