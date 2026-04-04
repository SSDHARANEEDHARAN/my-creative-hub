import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Factory, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

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

  useEffect(() => {
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
  }, []);

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
