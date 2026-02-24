import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ArrowLeft, Send, User, Calendar, Tag, Eye, Share2, Twitter, Linkedin, Link2, Facebook } from "lucide-react";
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
  author: { name: string; avatar: string };
}

interface DBComment {
  id: string;
  name: string;
  content: string;
  created_at: string;
  reply: string | null;
  reply_date: string | null;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape.",
    content: `## Introduction\n\nThe web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024.\n\n## AI-Assisted Development\n\nWe're seeing a massive shift towards **AI-assisted development**, where tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code.\n\n- Automated code generation\n- Intelligent code review suggestions\n- Bug detection and fixing\n- Documentation generation\n\n## WebAssembly Revolution\n\n**WebAssembly** is enabling near-native performance in browsers, opening doors for complex applications that were previously impossible on the web.\n\n### Key Benefits:\n1. Near-native execution speed\n2. Language-agnostic compilation\n3. Secure sandboxed execution\n4. Seamless JavaScript interop\n\n## Server Components\n\nReact Server Components and frameworks like **Next.js 14** are blurring the line between server and client rendering, offering:\n\n- Improved initial load times\n- Reduced client-side JavaScript\n- Better SEO out of the box\n- Simplified data fetching\n\n## Conclusion\n\nThe future of web development is exciting. By embracing these technologies, developers can build faster, more accessible, and more powerful web applications.`,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024", readTime: "5 min read", category: "Technology",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "2",
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices.",
    content: `## Why Accessibility Matters\n\nAccessibility isn't just a nice-to-have — it's **essential**. Over 1 billion people worldwide live with some form of disability.\n\n## WCAG Guidelines\n\nThe Web Content Accessibility Guidelines (WCAG) provide a framework:\n\n### Four Principles (POUR):\n1. **Perceivable** — Information must be presentable to users\n2. **Operable** — Interface components must be operable\n3. **Understandable** — Information and operation must be understandable\n4. **Robust** — Content must be robust enough for assistive technologies\n\n## Practical Tips\n\n- Use semantic HTML elements (\`<nav>\`, \`<main>\`, \`<article>\`)\n- Provide alt text for all images\n- Ensure sufficient color contrast (4.5:1 ratio minimum)\n- Support keyboard navigation throughout\n- Use ARIA labels where semantic HTML isn't sufficient\n\n## Conclusion\n\nBuilding accessible websites benefits everyone. Start with semantic HTML, add proper labels, and test with real assistive technologies.`,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024", readTime: "8 min read", category: "Design",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for maintainable React codebases.",
    content: `## Architecture Matters\n\nScaling React applications requires careful planning. Here are the patterns that have worked in production.\n\n## Component Composition\n\nUse **composition over inheritance**:\n\n- Break components into small, focused pieces\n- Use render props and hooks for shared logic\n- Keep components under 200 lines\n\n## State Management\n\nChoose the right tool for the job:\n\n- **Local state** — \`useState\` for component-specific data\n- **Context API** — For theme, auth, and global settings\n- **React Query** — For server state and caching\n- **Zustand/Jotai** — For complex client state\n\n## Code Splitting\n\nImplement lazy loading for better performance:\n\n- Route-based splitting with \`React.lazy()\`\n- Component-level splitting for heavy modules\n- Use \`Suspense\` boundaries for loading states\n\n## Conclusion\n\nA well-structured React app scales naturally. Invest in architecture early to save time later.`,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024", readTime: "10 min read", category: "Development",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "4",
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns for better code quality.",
    content: `## Beyond Basic Types\n\nTypeScript offers powerful features beyond basic type annotations. Let's explore advanced patterns.\n\n## Generics\n\nGenerics allow you to write reusable, type-safe code:\n\n\`\`\`typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n\`\`\`\n\n## Conditional Types\n\nCreate types that depend on conditions:\n\n\`\`\`typescript\ntype IsString<T> = T extends string ? true : false;\n\`\`\`\n\n## Best Practices\n\n1. Prefer **interfaces** for object shapes\n2. Use **type** for unions and intersections\n3. Avoid **any** — use **unknown** instead\n4. Enable strict mode in tsconfig\n\n## Conclusion\n\nAdvanced TypeScript patterns make your code more expressive and catch bugs at compile time.`,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024", readTime: "12 min read", category: "Development",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "5",
    title: "Introduction to CAD Engineering with SolidWorks",
    excerpt: "Getting started with SolidWorks for mechanical design and 3D modeling.",
    content: `## What is SolidWorks?\n\n**SolidWorks** is one of the most powerful CAD tools for mechanical engineering, used by millions of engineers worldwide.\n\n## Getting Started\n\n### Core Concepts:\n1. **Sketching** — 2D profiles that define 3D features\n2. **Features** — Extrude, revolve, sweep, loft\n3. **Assemblies** — Combining multiple parts\n4. **Drawings** — 2D engineering documentation\n\n## Best Practices\n\n- Start with a clear **design intent**\n- Use **reference planes** for complex geometry\n- Apply **GD&T** standards for manufacturing\n- Organize features logically in the feature tree\n\n## Conclusion\n\nSolidWorks is an essential tool for any mechanical engineer. Master the fundamentals and build from there.`,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
    date: "Dec 1, 2024", readTime: "7 min read", category: "Engineering",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "6",
    title: "IoT Project: Building a Smart Home System",
    excerpt: "Step-by-step guide to creating an IoT-based home automation system.",
    content: `## Project Overview\n\nLearn how to build a complete **smart home system** from scratch using Arduino and Raspberry Pi.\n\n## Hardware Requirements\n\n- **Raspberry Pi 4** — Central hub\n- **Arduino Uno** — Sensor nodes\n- **DHT22** — Temperature & humidity sensor\n- **PIR sensor** — Motion detection\n- **Relay modules** — Appliance control\n- **ESP8266** — WiFi connectivity\n\n## Architecture\n\n### System Design:\n1. Sensor nodes collect data via Arduino\n2. ESP8266 sends data to Raspberry Pi over MQTT\n3. Raspberry Pi processes and stores data\n4. Web dashboard for monitoring and control\n\n## Key Features\n\n- Real-time temperature and humidity monitoring\n- Motion-triggered lighting automation\n- Remote appliance control via mobile app\n- Historical data analysis and trends\n- Alert notifications for anomalies\n\n## Conclusion\n\nBuilding a smart home system teaches invaluable skills in embedded systems, networking, and full-stack development.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Nov 28, 2024", readTime: "15 min read", category: "IoT",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
];

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [postComments, setPostComments] = useState<DBComment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const { user } = useAuth();
  const { guest, isGuest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  // Track view on mount
  useEffect(() => {
    if (!id) return;
    const trackView = async () => {
      try {
        await supabase.from("blog_views").insert({
          post_id: id,
          viewer_email: currentUserEmail || null,
          viewer_name: currentUserName || null,
        });
      } catch (e) {
        console.error("Failed to track view:", e);
      }
    };
    // Only track once per session per post
    const viewKey = `blog_viewed_${id}`;
    if (!sessionStorage.getItem(viewKey)) {
      trackView();
      sessionStorage.setItem(viewKey, "1");
    }
  }, [id, currentUserEmail, currentUserName]);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [likesRes, commentsRes, viewsRes] = await Promise.all([
        supabase.functions.invoke("manage-blog-likes", {
          body: { action: "check", post_ids: [id], email: currentUserEmail || undefined },
        }),
        supabase.from("blog_comments_public").select("*").eq("post_id", id).order("created_at", { ascending: true }),
        supabase.from("blog_view_counts").select("*").eq("post_id", id).maybeSingle(),
      ]);

      if (likesRes.data) {
        setLikeCount(likesRes.data.counts?.[id] || 0);
        setUserHasLiked(likesRes.data.userLikedPosts?.includes(id) || false);
      }
      if (commentsRes.data) {
        setPostComments(commentsRes.data);
        setCommentCount(commentsRes.data.length);
      }
      if (viewsRes.data) {
        setViewCount(viewsRes.data.view_count || 0);
      }
    } catch (error) {
      console.error("Failed to load blog data:", error);
    }
  }, [id, currentUserEmail]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLike = async () => {
    if (!currentUserEmail || !currentUserName) { setShowAccessModal(true); return; }
    if (!id) return;

    if (userHasLiked) {
      const { error } = await supabase.functions.invoke("manage-blog-likes", { body: { action: "remove", post_id: id, email: currentUserEmail } });
      if (!error) { setUserHasLiked(false); setLikeCount((c) => Math.max(0, c - 1)); toast({ description: "Removed from liked posts" }); }
    } else {
      const { data, error } = await supabase.functions.invoke("manage-blog-likes", { body: { action: "add", post_id: id, name: currentUserName, email: currentUserEmail } });
      if (!error && !data?.error) {
        setUserHasLiked(true); setLikeCount((c) => c + 1); toast({ description: "Added to liked posts!" });
        await supabase.functions.invoke("send-contact-email", { body: { type: "blog_like", name: currentUserName, email: currentUserEmail, subject: "New Blog Like", message: `Liked: ${post?.title}`, blogTitle: post?.title, blogUrl: window.location.href } });
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || commentData.honeypot) return;
    const name = commentData.name || currentUserName;
    const email = commentData.email || currentUserEmail;
    if (!name || !email || !commentData.text) { toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" }); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({ post_id: id, name, email, content: commentData.text, is_spam: false, is_approved: false });
      if (error) throw error;
      toast({ title: "Comment submitted!", description: "Your comment is pending approval." });
      await supabase.functions.invoke("send-contact-email", { body: { type: "blog_comment", name, email, subject: `New Comment on: ${post?.title}`, message: commentData.text, blogTitle: post?.title, blogUrl: window.location.href, comment: commentData.text } });
      setCommentData({ name: "", email: "", text: "", honeypot: "" });
      setShowCommentForm(false);
      loadData();
    } catch { toast({ title: "Error", description: "Failed to submit comment.", variant: "destructive" }); }
    finally { setIsSubmitting(false); }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ description: "Link copied to clipboard!" });
    setShowShareMenu(false);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20 text-center container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog - Dharaneedharan SS</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          {/* Hero */}
          <section className="relative">
            <div className="aspect-[21/9] max-h-[420px] overflow-hidden relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 relative -mt-32 z-10">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
                    <ArrowLeft size={16} /> Back to Blog
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-foreground text-background text-xs font-semibold flex items-center gap-1.5">
                      <Tag size={12} /> {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={12} /> {post.readTime}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Eye size={12} /> {viewCount} readers</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">{post.title}</h1>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                        <span className="text-background font-bold text-sm">DS</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">Full Stack Developer & CAD Engineer</p>
                      </div>
                    </div>
                    {/* Social Share */}
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary"
                      >
                        <Share2 size={16} /> Share
                      </button>
                      {showShareMenu && (
                        <div className="absolute right-0 top-full mt-2 bg-card border border-border shadow-lg z-20 min-w-[180px]">
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                          >
                            <Twitter size={16} /> Twitter / X
                          </a>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                          >
                            <Linkedin size={16} /> LinkedIn
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"
                          >
                            <Facebook size={16} /> Facebook
                          </a>
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors w-full text-left"
                          >
                            <Link2 size={16} /> Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto">
                <ScrollReveal delay={100}>
                  <article className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                    prose-li:text-muted-foreground
                    prose-strong:text-foreground
                    prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-ol:text-muted-foreground prose-ul:text-muted-foreground
                  ">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </article>
                </ScrollReveal>

                {/* Like, Comment, View Stats Bar */}
                <ScrollReveal delay={200}>
                  <div className="flex flex-wrap items-center gap-3 mt-12 pt-6 border-t-2 border-border">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-5 py-2.5 font-medium text-sm transition-colors ${userHasLiked ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                    >
                      <Heart size={16} fill={userHasLiked ? "currentColor" : "none"} /> {likeCount} Likes
                    </button>
                    <button
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                    >
                      <MessageCircle size={16} /> {commentCount} Comments
                    </button>
                    <span className="flex items-center gap-2 px-5 py-2.5 bg-secondary/50 text-muted-foreground text-sm">
                      <Eye size={16} /> {viewCount} Readers
                    </span>
                  </div>
                </ScrollReveal>

                {/* Comments List */}
                {postComments.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-display font-bold text-lg">Comments</h4>
                    {postComments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-foreground/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{comment.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                        {comment.reply && (
                          <div className="mt-3 ml-6 p-3 bg-primary/10 border-l-2 border-primary">
                            <div className="flex items-center gap-2 mb-1">
                              <User size={14} className="text-primary" />
                              <span className="text-xs font-medium text-primary">Author Reply</span>
                              {comment.reply_date && <span className="text-xs text-muted-foreground">{new Date(comment.reply_date).toLocaleDateString()}</span>}
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
                  <form onSubmit={handleComment} className="mt-6 p-6 bg-secondary/30 border border-border space-y-4">
                    <h4 className="font-display font-bold">Leave a Comment</h4>
                    <input type="text" name="website" value={commentData.honeypot} onChange={(e) => setCommentData({ ...commentData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input placeholder="Your Name *" value={commentData.name || currentUserName || ""} onChange={(e) => setCommentData({ ...commentData, name: e.target.value })} required disabled={!!currentUserName} />
                      <Input type="email" placeholder="Your Email *" value={commentData.email || currentUserEmail || ""} onChange={(e) => setCommentData({ ...commentData, email: e.target.value })} required disabled={!!currentUserEmail} />
                    </div>
                    <Textarea placeholder="Write your comment... *" value={commentData.text} onChange={(e) => setCommentData({ ...commentData, text: e.target.value })} required rows={4} className="resize-none" />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : <><Send size={14} className="mr-2" /> Submit Comment</>}
                    </Button>
                    <p className="text-xs text-muted-foreground">Your comment will be visible after admin approval.</p>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
      </div>
    </>
  );
};

export default BlogPostPage;
