import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ArrowRight, BookOpen, TrendingUp, X, Send, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface DBComment {
  id: string;
  name: string;
  content: string;
  created_at: string;
  reply: string | null;
  reply_date: string | null;
}

const staticPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape, from AI integration to WebAssembly.",
    content: "The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024. We're seeing a massive shift towards AI-assisted development, where tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code. WebAssembly is enabling near-native performance in browsers, opening doors for complex applications that were previously impossible on the web.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    category: "Technology",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: "2",
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices that benefit all users.",
    content: "Accessibility isn't just a nice-to-have—it's essential. Learn how to make your websites inclusive for everyone. This comprehensive guide covers WCAG guidelines, semantic HTML, ARIA labels, keyboard navigation, and color contrast requirements.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Design",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for creating maintainable React codebases that grow with your team.",
    content: "Scaling React applications requires careful planning. Here are the patterns that have worked for me in production. We'll cover component composition, state management strategies, code splitting, and folder structure best practices.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: "4",
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns that will level up your development skills and code quality.",
    content: "TypeScript offers powerful features beyond basic types. Let's explore advanced patterns that make your code more robust including generics, conditional types, mapped types, and template literal types.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024",
    readTime: "12 min read",
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: "5",
    title: "Introduction to CAD Engineering with SolidWorks",
    excerpt: "Getting started with SolidWorks for mechanical design and 3D modeling in engineering projects.",
    content: "SolidWorks is one of the most powerful CAD tools for mechanical engineering. This beginner's guide covers the fundamentals of 3D modeling, assemblies, and engineering drawings.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
    date: "Dec 1, 2024",
    readTime: "7 min read",
    category: "Engineering",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: "6",
    title: "IoT Project: Building a Smart Home System",
    excerpt: "Step-by-step guide to creating an IoT-based home automation system using Arduino and Raspberry Pi.",
    content: "Learn how to build a complete smart home system from scratch. We'll cover sensor integration, microcontroller programming, and creating a mobile app for control.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Nov 28, 2024",
    readTime: "15 min read",
    category: "IoT",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
];

const BlogPage = () => {
  const [posts] = useState<BlogPost[]>(staticPosts);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postComments, setPostComments] = useState<DBComment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  
  const { user } = useAuth();
  const { guest, isGuest } = useGuest();

  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  // Load like and comment counts from database
  const loadCounts = useCallback(async () => {
    try {
      const postIds = posts.map((p) => p.id);

      // Get like counts and user likes via edge function (no email exposure)
      const [likesRes, commentsRes] = await Promise.all([
        supabase.functions.invoke('manage-blog-likes', {
          body: { action: "check", post_ids: postIds, email: currentUserEmail || undefined }
        }),
        supabase
          .from("blog_comments_public")
          .select("post_id")
          .in("post_id", postIds),
      ]);

      if (likesRes.data) {
        setLikeCounts(likesRes.data.counts || {});
        if (likesRes.data.userLikedPosts) {
          setUserLikes(new Set(likesRes.data.userLikedPosts));
        }
      }

      const newCommentCounts: Record<string, number> = {};
      if (commentsRes.data) {
        commentsRes.data.forEach((comment: { post_id: string }) => {
          newCommentCounts[comment.post_id] = (newCommentCounts[comment.post_id] || 0) + 1;
        });
      }
      setCommentCounts(newCommentCounts);
    } catch (error) {
      console.error("Failed to load counts:", error);
    }
  }, [posts, currentUserEmail]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  // Load comments for selected post
  const loadComments = useCallback(async (postId: string) => {
    try {
      const { data } = await supabase
        .from("blog_comments_public")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (data) {
        setPostComments(data);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost, loadComments]);

  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Check if user/guest is authenticated
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }

    const hasLiked = userLikes.has(postId);

    if (hasLiked) {
      // Remove like via edge function
      const { error } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "remove", post_id: postId, email: currentUserEmail }
      });

      if (!error) {
        setUserLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1),
        }));
        toast({ description: "Removed from liked posts" });
      }
    } else {
      // Add like via edge function
      const { data, error } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "add", post_id: postId, name: currentUserName, email: currentUserEmail }
      });

      if (!error && !data?.error) {
        setUserLikes((prev) => new Set([...prev, postId]));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1,
        }));
        toast({ description: "Added to liked posts!" });

        // Send notification to admin
        const post = posts.find((p) => p.id === postId);
        await supabase.functions.invoke("send-contact-email", {
          body: {
            type: "blog_like",
            name: currentUserName,
            email: currentUserEmail,
            subject: "New Blog Like",
            message: `Liked: ${post?.title}`,
            blogTitle: post?.title,
            blogUrl: window.location.href,
          },
        });
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPost) return;

    // Check honeypot (spam detection)
    if (commentData.honeypot) {
      toast({ title: "Error", description: "Spam detected", variant: "destructive" });
      return;
    }

    const name = commentData.name || currentUserName;
    const email = commentData.email || currentUserEmail;

    if (!name || !email || !commentData.text) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("blog_comments").insert({
        post_id: selectedPost.id,
        name,
        email,
        content: commentData.text,
        is_spam: false,
        is_approved: false, // Requires admin approval
      });

      if (error) throw error;

      toast({
        title: "Comment submitted!",
        description: "Your comment is pending approval.",
      });

      // Send notification to admin
      await supabase.functions.invoke("send-contact-email", {
        body: {
          type: "blog_comment",
          name,
          email,
          subject: `New Comment on: ${selectedPost.title}`,
          message: commentData.text,
          blogTitle: selectedPost.title,
          blogUrl: window.location.href,
          comment: commentData.text,
        },
      });

      setCommentData({ name: "", email: "", text: "", honeypot: "" });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | Tharaneetharan SS - Insights & Tutorials</title>
        <meta
          name="description"
          content="Read articles about web development, design patterns, and lessons learned from building products."
        />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-12 sm:py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-foreground/5 -z-10" />

            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-10 sm:mb-16">
                  <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
                    <BookOpen className="text-foreground" size={14} />
                    <span className="text-secondary-foreground font-medium text-xs sm:text-sm">
                      Latest Articles
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                    Insights & <span className="text-gradient">Tutorials</span>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                    Thoughts on web development, design patterns, and lessons learned from building
                    products used by thousands.
                  </p>
                </div>
              </ScrollReveal>

              {/* Featured Post */}
              <ScrollReveal delay={100}>
                <div
                  className="bg-card overflow-hidden hover:shadow-lg transition-all duration-300 mb-8 sm:mb-12 cursor-pointer group"
                  onClick={() => setSelectedPost(featuredPost)}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2">
                        <span className="px-2 sm:px-3 py-1 bg-foreground text-background text-xs font-semibold flex items-center gap-1">
                          <TrendingUp size={10} /> Trending
                        </span>
                        <span className="px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium">
                          {featuredPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center">
                          <span className="text-background font-bold text-xs sm:text-sm">TS</span>
                        </div>
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{featuredPost.author.name}</p>
                          <p className="text-muted-foreground text-xs">{featuredPost.date}</p>
                        </div>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-muted-foreground transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                            onClick={(e) => handleLike(featuredPost.id, e)}
                            className={`flex items-center gap-1.5 text-xs sm:text-sm transition-colors ${
                              userLikes.has(featuredPost.id)
                                ? "text-red-500"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Heart
                              size={16}
                              fill={userLikes.has(featuredPost.id) ? "currentColor" : "none"}
                            />
                            {likeCounts[featuredPost.id] || 0}
                          </button>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                            <MessageCircle size={16} /> {commentCounts[featuredPost.id] || 0}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                            <Clock size={16} /> {featuredPost.readTime}
                          </span>
                        </div>
                        <span className="text-foreground font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-xs sm:text-sm">
                          Read Article <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Other Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {otherPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 50}>
                    <article
                      className="bg-card overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          <span className="px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-3 sm:mb-4">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3 group-hover:text-muted-foreground transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-3 sm:pt-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button
                              onClick={(e) => handleLike(post.id, e)}
                              className={`flex items-center gap-1 text-xs sm:text-sm transition-colors ${
                                userLikes.has(post.id)
                                  ? "text-red-500"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Heart size={14} fill={userLikes.has(post.id) ? "currentColor" : "none"} />
                              {likeCounts[post.id] || 0}
                            </button>
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <MessageCircle size={14} /> {commentCounts[post.id] || 0}
                            </span>
                          </div>
                          <ArrowRight
                            size={14}
                            className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />

        {/* Blog Post Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setSelectedPost(null);
              setShowCommentForm(false);
            }}
          >
            <div
              className="bg-card max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    setShowCommentForm(false);
                  }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-foreground text-background text-xs font-semibold">
                    {selectedPost.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center">
                    <span className="text-background font-bold text-xs sm:text-sm">TS</span>
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">{selectedPost.author.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{selectedPost.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {selectedPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
                  {selectedPost.title}
                </h2>
                <div className="prose prose-lg text-muted-foreground">
                  <p className="leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    {selectedPost.content}
                  </p>
                </div>

                {/* Like & Comment Section */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-muted">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 transition-colors font-medium text-sm ${
                      userLikes.has(selectedPost.id)
                        ? "bg-red-500 text-white"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart size={16} fill={userLikes.has(selectedPost.id) ? "currentColor" : "none"} />
                    {likeCounts[selectedPost.id] || 0} Likes
                  </button>
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-secondary text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  >
                    <MessageCircle size={16} /> {commentCounts[selectedPost.id] || 0} Comments
                  </button>
                </div>

                {/* Comments List */}
                {postComments.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-sm">Comments</h4>
                    {postComments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-secondary/50 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-foreground/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{comment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                        
                        {/* Admin Reply */}
                        {comment.reply && (
                          <div className="mt-3 ml-6 p-3 bg-primary/10 rounded border-l-2 border-primary">
                            <div className="flex items-center gap-2 mb-1">
                              <User size={14} className="text-primary" />
                              <span className="text-xs font-medium text-primary">Author Reply</span>
                              {comment.reply_date && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.reply_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{comment.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Form */}
                {showCommentForm && (
                  <form onSubmit={handleComment} className="mt-6 p-4 bg-secondary/30 space-y-4">
                    <h4 className="font-semibold text-sm">Leave a Comment</h4>
                    
                    {/* Honeypot field (hidden) */}
                    <input
                      type="text"
                      name="website"
                      value={commentData.honeypot}
                      onChange={(e) => setCommentData({ ...commentData, honeypot: e.target.value })}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name *"
                        value={commentData.name || currentUserName || ""}
                        onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                        required
                        className="h-10 text-sm"
                        disabled={!!currentUserName}
                      />
                      <Input
                        type="email"
                        placeholder="Your Email *"
                        value={commentData.email || currentUserEmail || ""}
                        onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                        required
                        className="h-10 text-sm"
                        disabled={!!currentUserEmail}
                      />
                    </div>
                    <Textarea
                      placeholder="Write your comment... *"
                      value={commentData.text}
                      onChange={(e) => setCommentData({ ...commentData, text: e.target.value })}
                      required
                      rows={3}
                      className="text-sm resize-none"
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-background/30 border-t-background animate-spin rounded-full" />
                          Submitting...
                        </span>
                      ) : (
                        <>
                          Submit Comment <Send size={14} />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your comment will be visible after admin approval.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Guest Access Modal */}
        <GuestAccessModal
          isOpen={showAccessModal}
          onClose={() => setShowAccessModal(false)}
        />
      </div>
    </>
  );
};

export default BlogPage;
