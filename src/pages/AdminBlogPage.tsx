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
import { Plus, Edit, Trash2, Eye, Save, X, ArrowLeft, Loader2, Upload, FileText } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  read_time: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const AdminBlogPage = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "tech",
    read_time: "5 min read",
    is_published: false,
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
      return;
    }
    fetchPosts();
  }, [user, isAdmin, authLoading, navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("content")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("content")
        .getPublicUrl(filePath);

      setCoverImage(publicUrl);
      toast.success("Cover image uploaded");
    } catch (error) {
      console.error("Error uploading cover:", error);
      toast.error("Failed to upload cover image");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "tech",
      read_time: "5 min read",
      is_published: false,
    });
    setCoverImage(null);
    setEditingPost(null);
    setIsEditing(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      read_time: post.read_time || "5 min read",
      is_published: post.is_published,
    });
    setCoverImage(post.cover_image);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Title, excerpt, and content are required");
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: coverImage,
        category: formData.category,
        read_time: formData.read_time,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        created_by: user?.id,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Blog post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);

        if (error) throw error;

        // Notify subscribers if publishing new post
        if (formData.is_published) {
          await supabase.functions.invoke("notify-subscribers", {
            body: {
              type: "new_blog",
              title: formData.title,
              excerpt: formData.excerpt,
            },
          });
        }

        toast.success("Blog post created successfully");
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      if (error.code === "23505") {
        toast.error("A post with this slug already exists");
      } else {
        toast.error("Failed to save blog post");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Blog post deleted");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          is_published: !post.is_published,
          published_at: !post.is_published ? new Date().toISOString() : post.published_at,
        })
        .eq("id", post.id);

      if (error) throw error;

      // Notify subscribers when publishing
      if (!post.is_published) {
        await supabase.functions.invoke("notify-subscribers", {
          body: {
            type: "new_blog",
            title: post.title,
            excerpt: post.excerpt,
          },
        });
      }

      toast.success(post.is_published ? "Post unpublished" : "Post published");
      fetchPosts();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update post");
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
        <title>Manage Blog | Admin</title>
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
                <h1 className="font-display text-3xl font-bold">Manage Blog</h1>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Post
                </Button>
              )}
            </div>

            {isEditing ? (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingPost ? "Edit Post" : "New Blog Post"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Blog post title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="url-friendly-slug"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                            <SelectItem value="tutorial">Tutorial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="read_time">Read Time</Label>
                        <Input
                          id="read_time"
                          value={formData.read_time}
                          onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                          placeholder="5 min read"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief description for preview"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Full blog post content (supports markdown)"
                        rows={12}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Cover Image</Label>
                      <div className="flex items-start gap-4">
                        {coverImage ? (
                          <div className="relative w-40 h-24 border rounded overflow-hidden">
                            <img src={coverImage} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setCoverImage(null)}
                              className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="w-40 h-24 border-2 border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverUpload}
                              className="hidden"
                              disabled={uploading}
                            />
                            {uploading ? (
                              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            )}
                          </label>
                        )}
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
                        {editingPost ? "Update" : "Create"} Post
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
              <h2 className="font-semibold text-lg">All Posts ({posts.length})</h2>
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No blog posts yet. Create your first post!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <Card key={post.id} className={!post.is_published ? "opacity-70" : ""}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {post.cover_image ? (
                              <img
                                src={post.cover_image}
                                alt=""
                                className="w-20 h-14 object-cover rounded shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-14 bg-secondary rounded flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold truncate">{post.title}</h3>
                                <span className="text-xs px-2 py-0.5 rounded bg-secondary">{post.category}</span>
                                {!post.is_published && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                              <p className="text-xs text-muted-foreground mt-1">/{post.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePublish(post)}
                              title={post.is_published ? "Unpublish" : "Publish"}
                            >
                              <Eye className={`w-4 h-4 ${post.is_published ? "text-green-500" : "text-muted-foreground"}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
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

export default AdminBlogPage;
