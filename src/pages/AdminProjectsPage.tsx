import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, Save, X, ArrowLeft, Loader2, Upload } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  images: string[];
  github_url: string | null;
  live_url: string | null;
  article_slug: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const AdminProjectsPage = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "it",
    tech_stack: "",
    github_url: "",
    live_url: "",
    article_slug: "",
    is_published: false,
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
      return;
    }
    fetchProjects();
  }, [user, isAdmin, authLoading, navigate]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("content")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("content")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "it",
      tech_stack: "",
      github_url: "",
      live_url: "",
      article_slug: "",
      is_published: false,
    });
    setImages([]);
    setEditingProject(null);
    setIsEditing(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tech_stack: project.tech_stack.join(", "),
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      article_slug: project.article_slug || "",
      is_published: project.is_published,
    });
    setImages(project.images || []);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required");
      return;
    }

    setSaving(true);
    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tech_stack: formData.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        images,
        github_url: formData.github_url || null,
        live_url: formData.live_url || null,
        article_slug: formData.article_slug || null,
        is_published: formData.is_published,
        created_by: user?.id,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);

        if (error) throw error;

        // Notify subscribers if publishing new project
        if (formData.is_published) {
          await supabase.functions.invoke("notify-subscribers", {
            body: {
              type: "new_project",
              title: formData.title,
              description: formData.description,
            },
          });
        }

        toast.success("Project created successfully");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_published: !project.is_published })
        .eq("id", project.id);

      if (error) throw error;

      // Notify subscribers when publishing
      if (!project.is_published) {
        await supabase.functions.invoke("notify-subscribers", {
          body: {
            type: "new_project",
            title: project.title,
            description: project.description,
          },
        });
      }

      toast.success(project.is_published ? "Project unpublished" : "Project published");
      fetchProjects();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update project");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Projects | Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="font-display text-3xl font-bold">Manage Projects</h1>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              )}
            </div>

            {isEditing ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingProject ? "Edit Project" : "New Project"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Project title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="it">IT Project</SelectItem>
                            <SelectItem value="engineering">Engineering Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Project description"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                      <Input
                        id="tech_stack"
                        value={formData.tech_stack}
                        onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                        placeholder="React, TypeScript, Tailwind CSS"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          value={formData.github_url}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="live_url">Live URL</Label>
                        <Input
                          id="live_url"
                          value={formData.live_url}
                          onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="article_slug">Article Slug (for engineering projects)</Label>
                      <Input
                        id="article_slug"
                        value={formData.article_slug}
                        onChange={(e) => setFormData({ ...formData, article_slug: e.target.value })}
                        placeholder="chassis-redesign-project"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Project Images</Label>
                      <div className="flex flex-wrap gap-4">
                        {images.map((img, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-24 h-24 border-2 border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                          {uploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                          ) : (
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                      />
                      <Label htmlFor="is_published">Publish immediately</Label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {editingProject ? "Update" : "Create"} Project
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}

            <div className="space-y-4">
              <h2 className="font-semibold text-lg">All Projects ({projects.length})</h2>
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No projects yet. Create your first project!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className={!project.is_published ? "opacity-70" : ""}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{project.title}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded ${project.category === "it" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                                {project.category === "it" ? "IT" : "Engineering"}
                              </span>
                              {!project.is_published && (
                                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            {project.tech_stack.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.tech_stack.slice(0, 5).map((tech) => (
                                  <span key={tech} className="text-xs px-2 py-0.5 bg-secondary rounded">{tech}</span>
                                ))}
                                {project.tech_stack.length > 5 && (
                                  <span className="text-xs text-muted-foreground">+{project.tech_stack.length - 5} more</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePublish(project)}
                              title={project.is_published ? "Unpublish" : "Publish"}
                            >
                              <Eye className={`w-4 h-4 ${project.is_published ? "text-green-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminProjectsPage;
