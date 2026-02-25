import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ReactMarkdown from "react-markdown";
import {
  Check, X, Trash2, AlertTriangle, MessageSquare, Users, RefreshCw,
  Plus, Edit, Eye, Upload, Image, FileText, FolderOpen, Send,
  Award, BarChart3, GraduationCap, Info,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface Comment {
  id: string; post_id: string; name: string; email: string; content: string;
  created_at: string; is_approved: boolean; is_spam: boolean; reply: string | null;
}
interface GuestVisitor { id: string; name: string; email: string; visited_at: string; }
interface BlogPost {
  id: string; title: string; slug: string; excerpt: string; content: string;
  cover_image: string | null; category: string; read_time: string | null;
  is_published: boolean; created_at: string;
}
interface Project {
  id: string; title: string; description: string; category: string;
  tech_stack: string[] | null; images: string[] | null; github_url: string | null;
  live_url: string | null; article_slug: string | null; featured: boolean | null;
  is_published: boolean; created_at: string;
}
interface Skill {
  id: string; name: string; level: number; category: string;
  skill_type: string; color_token: string; sort_order: number;
}
interface Certificate {
  id: string; title: string; issuer: string; date: string;
  image_url: string | null; category: string; sort_order: number;
}
interface AboutContent {
  id: string; section_key: string; content: Record<string, any>;
}

const emptyBlog: Partial<BlogPost> = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "", category: "tech", read_time: "5 min read", is_published: false,
};
const emptyProject: Partial<Project> = {
  title: "", description: "", category: "it", tech_stack: [], images: [], github_url: "", live_url: "", article_slug: "", featured: false, is_published: false,
};
const emptySkill: Partial<Skill> = {
  name: "", level: 50, category: "it", skill_type: "primary", color_token: "primary", sort_order: 0,
};
const emptyCert: Partial<Certificate> = {
  title: "", issuer: "", date: "", image_url: "", category: "it", sort_order: 0,
};

// ─── Main Component ──────────────────────────────────────────────
const AdminModerationPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [guests, setGuests] = useState<GuestVisitor[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Blog/Project form state
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>(emptyBlog);
  const [projectForm, setProjectForm] = useState<Partial<Project>>(emptyProject);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showBlogDialog, setShowBlogDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [techInput, setTechInput] = useState("");

  // Skill form state
  const [skillForm, setSkillForm] = useState<Partial<Skill>>(emptySkill);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [showSkillDialog, setShowSkillDialog] = useState(false);

  // Certificate form state
  const [certForm, setCertForm] = useState<Partial<Certificate>>(emptyCert);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [showCertDialog, setShowCertDialog] = useState(false);

  // About form state
  const [aboutIntro, setAboutIntro] = useState({ title: "", paragraph1: "", paragraph2: "" });
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const [commentsRes, guestsRes, blogsRes, projectsRes, skillsRes, certsRes, aboutRes] = await Promise.all([
      supabase.from("blog_comments").select("*").order("created_at", { ascending: false }),
      supabase.from("guest_visitors").select("*").order("visited_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("certificates").select("*").order("sort_order", { ascending: true }),
      supabase.from("about_content").select("*"),
    ]);
    if (commentsRes.data) setComments(commentsRes.data);
    if (guestsRes.data) setGuests(guestsRes.data);
    if (blogsRes.data) setBlogs(blogsRes.data as BlogPost[]);
    if (projectsRes.data) setProjects(projectsRes.data as Project[]);
    if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
    if (certsRes.data) setCertificates(certsRes.data as Certificate[]);
    if (aboutRes.data) {
      setAboutContent(aboutRes.data as AboutContent[]);
      const intro = (aboutRes.data as AboutContent[]).find(a => a.section_key === "intro");
      if (intro) setAboutIntro(intro.content as any);
    }
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── Comment actions ──
  const approveComment = async (id: string) => {
    const { error } = await supabase.from("blog_comments").update({ is_approved: true }).eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setComments(prev => prev.map(c => c.id === id ? { ...c, is_approved: true } : c));
    toast({ title: "Comment approved" });
  };
  const markAsSpam = async (id: string) => {
    const { error } = await supabase.from("blog_comments").update({ is_spam: true, is_approved: false }).eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setComments(prev => prev.map(c => c.id === id ? { ...c, is_spam: true, is_approved: false } : c));
    toast({ title: "Marked as spam" });
  };
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("blog_comments").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setComments(prev => prev.filter(c => c.id !== id));
    toast({ title: "Comment deleted" });
  };

  // ── Image upload ──
  const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    setUploading(false);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  // ── Blog CRUD ──
  const openBlogForm = (blog?: BlogPost) => {
    if (blog) { setBlogForm(blog); setEditingBlogId(blog.id); }
    else { setBlogForm({ ...emptyBlog }); setEditingBlogId(null); }
    setShowPreview(false);
    setShowBlogDialog(true);
  };

  const saveBlog = async (publish: boolean) => {
    if (!blogForm.title || !blogForm.slug || !blogForm.content) {
      toast({ title: "Missing fields", description: "Title, slug, and content are required", variant: "destructive" });
      return;
    }
    const payload = {
      title: blogForm.title!, slug: blogForm.slug!, excerpt: blogForm.excerpt || "",
      content: blogForm.content!, cover_image: blogForm.cover_image || null,
      category: blogForm.category || "tech", read_time: blogForm.read_time || "5 min read",
      is_published: publish, ...(publish ? { published_at: new Date().toISOString() } : {}),
    };
    let error;
    if (editingBlogId) { ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editingBlogId)); }
    else { ({ error } = await supabase.from("blog_posts").insert(payload)); }
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (publish && !editingBlogId) {
      await supabase.functions.invoke("notify-subscribers", { body: { type: "blog", title: blogForm.title, slug: blogForm.slug } });
    }
    toast({ title: editingBlogId ? "Blog updated" : "Blog created" });
    setShowBlogDialog(false);
    loadData();
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setBlogs(prev => prev.filter(b => b.id !== id));
    toast({ title: "Blog deleted" });
  };

  // ── Project CRUD ──
  const openProjectForm = (project?: Project) => {
    if (project) { setProjectForm(project); setEditingProjectId(project.id); }
    else { setProjectForm({ ...emptyProject }); setEditingProjectId(null); }
    setTechInput("");
    setShowProjectDialog(true);
  };

  const saveProject = async (publish: boolean) => {
    if (!projectForm.title || !projectForm.description) {
      toast({ title: "Missing fields", description: "Title and description are required", variant: "destructive" });
      return;
    }
    const payload = {
      title: projectForm.title!, description: projectForm.description!,
      category: projectForm.category || "it", tech_stack: projectForm.tech_stack || [],
      images: projectForm.images || [], github_url: projectForm.github_url || null,
      live_url: projectForm.live_url || null, article_slug: projectForm.article_slug || null,
      featured: projectForm.featured || false, is_published: publish,
    };
    let error;
    if (editingProjectId) { ({ error } = await supabase.from("projects").update(payload).eq("id", editingProjectId)); }
    else { ({ error } = await supabase.from("projects").insert(payload)); }
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    if (publish && !editingProjectId) {
      await supabase.functions.invoke("notify-subscribers", { body: { type: "project", title: projectForm.title } });
    }
    toast({ title: editingProjectId ? "Project updated" : "Project created" });
    setShowProjectDialog(false);
    loadData();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Project deleted" });
  };

  const addTechTag = () => {
    if (techInput.trim()) {
      setProjectForm(prev => ({ ...prev, tech_stack: [...(prev.tech_stack || []), techInput.trim()] }));
      setTechInput("");
    }
  };
  const removeTechTag = (idx: number) => {
    setProjectForm(prev => ({ ...prev, tech_stack: (prev.tech_stack || []).filter((_, i) => i !== idx) }));
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "project-images");
    if (url) setProjectForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "blog-images");
    if (url) setBlogForm(prev => ({ ...prev, cover_image: url }));
  };

  // ── Skills CRUD ──
  const openSkillForm = (skill?: Skill) => {
    if (skill) { setSkillForm(skill); setEditingSkillId(skill.id); }
    else { setSkillForm({ ...emptySkill }); setEditingSkillId(null); }
    setShowSkillDialog(true);
  };

  const saveSkill = async () => {
    if (!skillForm.name) {
      toast({ title: "Missing fields", description: "Skill name is required", variant: "destructive" });
      return;
    }
    const payload = {
      name: skillForm.name!, level: skillForm.level || 50,
      category: skillForm.category || "it", skill_type: skillForm.skill_type || "primary",
      color_token: skillForm.color_token || "primary", sort_order: skillForm.sort_order || 0,
    };
    let error;
    if (editingSkillId) { ({ error } = await supabase.from("skills").update(payload).eq("id", editingSkillId)); }
    else { ({ error } = await supabase.from("skills").insert(payload)); }
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editingSkillId ? "Skill updated" : "Skill added" });
    setShowSkillDialog(false);
    loadData();
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setSkills(prev => prev.filter(s => s.id !== id));
    toast({ title: "Skill deleted" });
  };

  // ── Certificate CRUD ──
  const openCertForm = (cert?: Certificate) => {
    if (cert) { setCertForm(cert); setEditingCertId(cert.id); }
    else { setCertForm({ ...emptyCert }); setEditingCertId(null); }
    setShowCertDialog(true);
  };

  const saveCert = async () => {
    if (!certForm.title) {
      toast({ title: "Missing fields", description: "Certificate title is required", variant: "destructive" });
      return;
    }
    const payload = {
      title: certForm.title!, issuer: certForm.issuer || "",
      date: certForm.date || "", image_url: certForm.image_url || null,
      category: certForm.category || "it", sort_order: certForm.sort_order || 0,
    };
    let error;
    if (editingCertId) { ({ error } = await supabase.from("certificates").update(payload).eq("id", editingCertId)); }
    else { ({ error } = await supabase.from("certificates").insert(payload)); }
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: editingCertId ? "Certificate updated" : "Certificate added" });
    setShowCertDialog(false);
    loadData();
  };

  const deleteCert = async (id: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) { toast({ title: "Error", variant: "destructive" }); return; }
    setCertificates(prev => prev.filter(c => c.id !== id));
    toast({ title: "Certificate deleted" });
  };

  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, "certificates");
    if (url) setCertForm(prev => ({ ...prev, image_url: url }));
  };

  // ── About Content ──
  const saveAbout = async () => {
    const existing = aboutContent.find(a => a.section_key === "intro");
    let error;
    if (existing) {
      ({ error } = await supabase.from("about_content").update({ content: aboutIntro as any }).eq("section_key", "intro"));
    } else {
      ({ error } = await supabase.from("about_content").insert({ section_key: "intro", content: aboutIntro as any }));
    }
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "About content updated" });
    setShowAboutDialog(false);
    loadData();
  };

  const pendingComments = comments.filter(c => !c.is_approved && !c.is_spam);
  const approvedComments = comments.filter(c => c.is_approved);

  const itSkills = skills.filter(s => s.category === "it");
  const engSkills = skills.filter(s => s.category === "engineering");

  return (
    <PageTransition>
      <Helmet><title>Admin Dashboard | Dharaneedharan SS</title></Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage content, comments, and visitors</p>
              </div>
              <Button onClick={loadData} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {[
                { val: blogs.length, label: "Blog Posts" },
                { val: projects.length, label: "Projects" },
                { val: skills.length, label: "Skills" },
                { val: certificates.length, label: "Certificates" },
                { val: pendingComments.length, label: "Pending Comments" },
                { val: guests.length, label: "Guest Visitors" },
              ].map((s, i) => (
                <Card key={i}><CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-foreground">{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent></Card>
              ))}
            </div>

            <Tabs defaultValue="blogs" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
                <TabsTrigger value="blogs"><FileText className="w-4 h-4 mr-1" />Blogs</TabsTrigger>
                <TabsTrigger value="projects"><FolderOpen className="w-4 h-4 mr-1" />Projects</TabsTrigger>
                <TabsTrigger value="skills"><BarChart3 className="w-4 h-4 mr-1" />Skills</TabsTrigger>
                <TabsTrigger value="certificates"><GraduationCap className="w-4 h-4 mr-1" />Certs</TabsTrigger>
                <TabsTrigger value="about"><Info className="w-4 h-4 mr-1" />About</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Comments
                  {pendingComments.length > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {pendingComments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="guests"><Users className="w-4 h-4 mr-1" />Guests</TabsTrigger>
              </TabsList>

              {/* ── Blogs Tab ── */}
              <TabsContent value="blogs" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => openBlogForm()}><Plus className="w-4 h-4 mr-2" /> New Blog Post</Button>
                </div>
                {blogs.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">No blog posts yet</CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {blogs.map(blog => (
                      <Card key={blog.id}>
                        <CardContent className="pt-4 pb-4 flex items-center gap-4">
                          {blog.cover_image && <img src={blog.cover_image} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{blog.title}</p>
                            <p className="text-xs text-muted-foreground">{blog.category} · {blog.read_time}</p>
                          </div>
                          <Badge variant={blog.is_published ? "default" : "secondary"}>{blog.is_published ? "Published" : "Draft"}</Badge>
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => openBlogForm(blog)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteBlog(blog.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ── Projects Tab ── */}
              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => openProjectForm()}><Plus className="w-4 h-4 mr-2" /> New Project</Button>
                </div>
                {projects.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet</CardContent></Card>
                ) : (
                  <div className="space-y-3">
                    {projects.map(project => (
                      <Card key={project.id}>
                        <CardContent className="pt-4 pb-4 flex items-center gap-4">
                          {project.images?.[0] && <img src={project.images[0]} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{project.title}</p>
                            <p className="text-xs text-muted-foreground">{project.category} · {(project.tech_stack || []).join(", ")}</p>
                          </div>
                          <div className="flex gap-1.5 items-center">
                            {project.featured && <Badge variant="outline">Featured</Badge>}
                            <Badge variant={project.is_published ? "default" : "secondary"}>{project.is_published ? "Published" : "Draft"}</Badge>
                            <Button size="sm" variant="outline" onClick={() => openProjectForm(project)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteProject(project.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ── Skills Tab ── */}
              <TabsContent value="skills" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => openSkillForm()}><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
                </div>
                {["it", "engineering"].map(cat => (
                  <div key={cat}>
                    <h3 className="font-semibold text-lg mb-3 capitalize">{cat === "it" ? "IT & Software" : "Engineering & CAD"}</h3>
                    <div className="space-y-2">
                      {skills.filter(s => s.category === cat).map(skill => (
                        <Card key={skill.id}>
                          <CardContent className="pt-4 pb-4 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">{skill.name}</p>
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${skill.level}%` }} />
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <Button size="sm" variant="outline" onClick={() => openSkillForm(skill)}><Edit className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteSkill(skill.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {skills.filter(s => s.category === cat).length === 0 && (
                        <p className="text-sm text-muted-foreground py-4 text-center">No {cat} skills yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* ── Certificates Tab ── */}
              <TabsContent value="certificates" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => openCertForm()}><Plus className="w-4 h-4 mr-2" /> Add Certificate</Button>
                </div>
                {certificates.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">No certificates yet</CardContent></Card>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {certificates.map(cert => (
                      <Card key={cert.id}>
                        <CardContent className="pt-4 pb-4 flex items-center gap-4">
                          {cert.image_url && <img src={cert.image_url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{cert.title}</p>
                            <p className="text-xs text-muted-foreground">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => openCertForm(cert)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteCert(cert.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ── About Tab ── */}
              <TabsContent value="about" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAboutDialog(true)}><Edit className="w-4 h-4 mr-2" /> Edit About Content</Button>
                </div>
                <Card>
                  <CardHeader><CardTitle>Current About Content</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Title</p>
                      <p className="text-foreground">{aboutIntro.title || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Paragraph 1</p>
                      <p className="text-foreground text-sm">{aboutIntro.paragraph1 || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Paragraph 2</p>
                      <p className="text-foreground text-sm">{aboutIntro.paragraph2 || "Not set"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ── Comments Tabs ── */}
              <TabsContent value="pending" className="space-y-4">
                {pendingComments.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" /> No pending comments
                  </CardContent></Card>
                ) : pendingComments.map(c => (
                  <CommentCard key={c.id} comment={c} onApprove={() => approveComment(c.id)} onSpam={() => markAsSpam(c.id)} onDelete={() => deleteComment(c.id)} showActions />
                ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedComments.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">No approved comments</CardContent></Card>
                ) : approvedComments.map(c => (
                  <CommentCard key={c.id} comment={c} onDelete={() => deleteComment(c.id)} />
                ))}
              </TabsContent>

              <TabsContent value="guests" className="space-y-4">
                {guests.length === 0 ? (
                  <Card><CardContent className="py-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" /> No guest visitors yet
                  </CardContent></Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {guests.map(g => (
                      <Card key={g.id}><CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div><p className="font-medium">{g.name}</p><p className="text-sm text-muted-foreground">{g.email}</p></div>
                          <Badge variant="secondary">{new Date(g.visited_at).toLocaleDateString()}</Badge>
                        </div>
                      </CardContent></Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>

      {/* ── Blog Dialog ── */}
      <Dialog open={showBlogDialog} onOpenChange={setShowBlogDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingBlogId ? "Edit Blog Post" : "New Blog Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Title" value={blogForm.title || ""} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Slug (url-friendly)" value={blogForm.slug || ""} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} />
            <Input placeholder="Excerpt / Short description" value={blogForm.excerpt || ""} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Select value={blogForm.category || "tech"} onValueChange={v => setBlogForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="iot">IoT</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Read time (e.g. 5 min read)" value={blogForm.read_time || ""} onChange={e => setBlogForm(p => ({ ...p, read_time: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="flex gap-2">
                <Input placeholder="Image URL" value={blogForm.cover_image || ""} onChange={e => setBlogForm(p => ({ ...p, cover_image: e.target.value }))} className="flex-1" />
                <label className="cursor-pointer">
                  <Button variant="outline" asChild disabled={uploading}><span><Upload className="w-4 h-4 mr-1" />{uploading ? "..." : "Upload"}</span></Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBlogImageUpload} />
                </label>
              </div>
              {blogForm.cover_image && <img src={blogForm.cover_image} alt="Cover preview" className="w-full h-40 object-cover rounded" />}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-4 h-4 mr-1" /> {showPreview ? "Edit" : "Preview"}
                </Button>
              </div>
              {showPreview ? (
                <div className="p-4 border rounded min-h-[200px] prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{blogForm.content || "*Nothing to preview*"}</ReactMarkdown>
                </div>
              ) : (
                <Textarea placeholder="Write your blog post in Markdown..." value={blogForm.content || ""} onChange={e => setBlogForm(p => ({ ...p, content: e.target.value }))} rows={12} className="font-mono text-sm" />
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => saveBlog(false)}>Save as Draft</Button>
              <Button onClick={() => saveBlog(true)}><Send className="w-4 h-4 mr-2" /> {editingBlogId ? "Update & Publish" : "Publish & Notify"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Project Dialog ── */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProjectId ? "Edit Project" : "New Project"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Project Title" value={projectForm.title || ""} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} />
            <Textarea placeholder="Description" value={projectForm.description || ""} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} rows={4} />
            <div className="grid grid-cols-2 gap-4">
              <Select value={projectForm.category || "it"} onValueChange={v => setProjectForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={projectForm.featured || false} onChange={e => setProjectForm(p => ({ ...p, featured: e.target.checked }))} id="featured" />
                <label htmlFor="featured" className="text-sm">Featured Project</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="GitHub URL" value={projectForm.github_url || ""} onChange={e => setProjectForm(p => ({ ...p, github_url: e.target.value }))} />
              <Input placeholder="Live URL" value={projectForm.live_url || ""} onChange={e => setProjectForm(p => ({ ...p, live_url: e.target.value }))} />
            </div>
            <Input placeholder="Article Slug" value={projectForm.article_slug || ""} onChange={e => setProjectForm(p => ({ ...p, article_slug: e.target.value }))} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack</label>
              <div className="flex gap-2">
                <Input placeholder="Add technology" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTechTag())} />
                <Button variant="outline" onClick={addTechTag} type="button">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(projectForm.tech_stack || []).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeTechTag(i)}>{tag} <X className="w-3 h-3 ml-1" /></Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Images</label>
              <div className="flex gap-2">
                <Input placeholder="Add image URL" onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) { setProjectForm(p => ({ ...p, images: [...(p.images || []), val] })); (e.target as HTMLInputElement).value = ""; }
                  }
                }} />
                <label className="cursor-pointer">
                  <Button variant="outline" asChild disabled={uploading}><span><Upload className="w-4 h-4 mr-1" />{uploading ? "..." : "Upload"}</span></Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleProjectImageUpload} />
                </label>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(projectForm.images || []).map((img, i) => (
                  <div key={i} className="relative group w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded" />
                    <button onClick={() => setProjectForm(p => ({ ...p, images: (p.images || []).filter((_, idx) => idx !== i) }))} className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => saveProject(false)}>Save as Draft</Button>
              <Button onClick={() => saveProject(true)}><Send className="w-4 h-4 mr-2" /> {editingProjectId ? "Update & Publish" : "Publish & Notify"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Skill Dialog ── */}
      <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingSkillId ? "Edit Skill" : "Add Skill"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Skill Name (e.g. React)" value={skillForm.name || ""} onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))} />
            <div>
              <label className="text-sm font-medium mb-2 block">Proficiency: {skillForm.level || 50}%</label>
              <Slider value={[skillForm.level || 50]} onValueChange={([v]) => setSkillForm(p => ({ ...p, level: v }))} min={0} max={100} step={1} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select value={skillForm.category || "it"} onValueChange={v => setSkillForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT & Software</SelectItem>
                  <SelectItem value="engineering">Engineering & CAD</SelectItem>
                </SelectContent>
              </Select>
              <Select value={skillForm.color_token || "primary"} onValueChange={v => setSkillForm(p => ({ ...p, color_token: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Sort Order (0, 1, 2...)" type="number" value={skillForm.sort_order || 0} onChange={e => setSkillForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowSkillDialog(false)}>Cancel</Button>
              <Button onClick={saveSkill}>{editingSkillId ? "Update" : "Add"} Skill</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Certificate Dialog ── */}
      <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingCertId ? "Edit Certificate" : "Add Certificate"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Certificate Title" value={certForm.title || ""} onChange={e => setCertForm(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Issuer (e.g. Coursera, Google)" value={certForm.issuer || ""} onChange={e => setCertForm(p => ({ ...p, issuer: e.target.value }))} />
            <Input placeholder="Date (e.g. Jan 2025)" value={certForm.date || ""} onChange={e => setCertForm(p => ({ ...p, date: e.target.value }))} />
            <Select value={certForm.category || "it"} onValueChange={v => setCertForm(p => ({ ...p, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate Image</label>
              <div className="flex gap-2">
                <Input placeholder="Image URL" value={certForm.image_url || ""} onChange={e => setCertForm(p => ({ ...p, image_url: e.target.value }))} className="flex-1" />
                <label className="cursor-pointer">
                  <Button variant="outline" asChild disabled={uploading}><span><Upload className="w-4 h-4 mr-1" />{uploading ? "..." : "Upload"}</span></Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCertImageUpload} />
                </label>
              </div>
              {certForm.image_url && <img src={certForm.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />}
            </div>
            <Input placeholder="Sort Order" type="number" value={certForm.sort_order || 0} onChange={e => setCertForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowCertDialog(false)}>Cancel</Button>
              <Button onClick={saveCert}>{editingCertId ? "Update" : "Add"} Certificate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── About Dialog ── */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit About Content</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Section Title" value={aboutIntro.title} onChange={e => setAboutIntro(p => ({ ...p, title: e.target.value }))} />
            <Textarea placeholder="First Paragraph" value={aboutIntro.paragraph1} onChange={e => setAboutIntro(p => ({ ...p, paragraph1: e.target.value }))} rows={4} />
            <Textarea placeholder="Second Paragraph" value={aboutIntro.paragraph2} onChange={e => setAboutIntro(p => ({ ...p, paragraph2: e.target.value }))} rows={4} />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowAboutDialog(false)}>Cancel</Button>
              <Button onClick={saveAbout}>Save About Content</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

// ── Comment Card ─────────────────────────────────────────────────
interface CommentCardProps {
  comment: Comment; onApprove?: () => void; onSpam?: () => void; onDelete?: () => void; showActions?: boolean;
}
const CommentCard = ({ comment, onApprove, onSpam, onDelete, showActions }: CommentCardProps) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div><CardTitle className="text-base">{comment.name}</CardTitle><p className="text-sm text-muted-foreground">{comment.email}</p></div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Post: {comment.post_id}</Badge>
          <Badge variant={comment.is_spam ? "destructive" : comment.is_approved ? "default" : "secondary"}>
            {comment.is_spam ? "Spam" : comment.is_approved ? "Approved" : "Pending"}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-foreground">{comment.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</span>
        <div className="flex gap-2">
          {showActions && onApprove && <Button size="sm" onClick={onApprove}><Check className="w-4 h-4 mr-1" />Approve</Button>}
          {showActions && onSpam && <Button size="sm" variant="outline" onClick={onSpam}><AlertTriangle className="w-4 h-4 mr-1" />Spam</Button>}
          {!showActions && onApprove && <Button size="sm" variant="outline" onClick={onApprove}><Check className="w-4 h-4 mr-1" />Restore</Button>}
          {onDelete && <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminModerationPage;
