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
import { Heart, MessageCircle, Clock, ArrowLeft, Send, User, Calendar, Tag } from "lucide-react";
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
    content: `## Introduction

The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024.

## AI-Assisted Development

We're seeing a massive shift towards **AI-assisted development**, where tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code.

- Automated code generation
- Intelligent code review suggestions
- Bug detection and fixing
- Documentation generation

## WebAssembly Revolution

**WebAssembly** is enabling near-native performance in browsers, opening doors for complex applications that were previously impossible on the web.

### Key Benefits:
1. Near-native execution speed
2. Language-agnostic compilation
3. Secure sandboxed execution
4. Seamless JavaScript interop

## Server Components

React Server Components and frameworks like **Next.js 14** are blurring the line between server and client rendering, offering:

- Improved initial load times
- Reduced client-side JavaScript
- Better SEO out of the box
- Simplified data fetching

## Conclusion

The future of web development is exciting. By embracing these technologies, developers can build faster, more accessible, and more powerful web applications.`,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    category: "Technology",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "2",
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices.",
    content: `## Why Accessibility Matters

Accessibility isn't just a nice-to-have — it's **essential**. Over 1 billion people worldwide live with some form of disability.

## WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide a framework:

### Four Principles (POUR):
1. **Perceivable** — Information must be presentable to users
2. **Operable** — Interface components must be operable
3. **Understandable** — Information and operation must be understandable
4. **Robust** — Content must be robust enough for assistive technologies

## Practical Tips

- Use semantic HTML elements (\`<nav>\`, \`<main>\`, \`<article>\`)
- Provide alt text for all images
- Ensure sufficient color contrast (4.5:1 ratio minimum)
- Support keyboard navigation throughout
- Use ARIA labels where semantic HTML isn't sufficient

## Testing Tools

- **Lighthouse** — Built into Chrome DevTools
- **axe DevTools** — Browser extension
- **WAVE** — Web Accessibility Evaluation Tool
- **Screen readers** — NVDA, VoiceOver, JAWS

## Conclusion

Building accessible websites benefits everyone. Start with semantic HTML, add proper labels, and test with real assistive technologies.`,
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Design",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for maintainable React codebases.",
    content: `## Architecture Matters

Scaling React applications requires careful planning. Here are the patterns that have worked in production.

## Component Composition

Use **composition over inheritance**:

- Break components into small, focused pieces
- Use render props and hooks for shared logic
- Keep components under 200 lines

## State Management

Choose the right tool for the job:

- **Local state** — \`useState\` for component-specific data
- **Context API** — For theme, auth, and global settings
- **React Query** — For server state and caching
- **Zustand/Jotai** — For complex client state

## Code Splitting

Implement lazy loading for better performance:

- Route-based splitting with \`React.lazy()\`
- Component-level splitting for heavy modules
- Use \`Suspense\` boundaries for loading states

## Folder Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── pages/          # Route-level components
├── hooks/          # Custom hooks
├── contexts/       # React contexts
├── utils/          # Helper functions
└── types/          # TypeScript types
\`\`\`

## Performance Tips

1. Memoize expensive computations with \`useMemo\`
2. Use \`React.memo\` for pure components
3. Virtualize long lists
4. Optimize images with lazy loading

## Conclusion

A well-structured React app scales naturally. Invest in architecture early to save time later.`,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    category: "Development",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "4",
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns for better code quality.",
    content: `## Beyond Basic Types

TypeScript offers powerful features beyond basic type annotations. Let's explore advanced patterns.

## Generics

Generics allow you to write reusable, type-safe code:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Conditional Types

Create types that depend on conditions:

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

## Mapped Types

Transform existing types:

- \`Partial<T>\` — Makes all properties optional
- \`Required<T>\` — Makes all properties required
- \`Pick<T, K>\` — Selects specific properties
- \`Omit<T, K>\` — Removes specific properties

## Utility Patterns

### Discriminated Unions
\`\`\`typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
\`\`\`

### Template Literal Types
\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
\`\`\`

## Best Practices

1. Prefer **interfaces** for object shapes
2. Use **type** for unions and intersections
3. Avoid **any** — use **unknown** instead
4. Enable strict mode in tsconfig

## Conclusion

Advanced TypeScript patterns make your code more expressive and catch bugs at compile time.`,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024",
    readTime: "12 min read",
    category: "Development",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "5",
    title: "Introduction to CAD Engineering with SolidWorks",
    excerpt: "Getting started with SolidWorks for mechanical design and 3D modeling.",
    content: `## What is SolidWorks?

**SolidWorks** is one of the most powerful CAD tools for mechanical engineering, used by millions of engineers worldwide.

## Getting Started

### Core Concepts:
1. **Sketching** — 2D profiles that define 3D features
2. **Features** — Extrude, revolve, sweep, loft
3. **Assemblies** — Combining multiple parts
4. **Drawings** — 2D engineering documentation

## Essential Tools

- **Boss/Extrude** — Add material by extruding a sketch
- **Cut/Extrude** — Remove material
- **Fillet/Chamfer** — Edge treatments
- **Pattern** — Linear and circular patterns
- **Mirror** — Symmetrical features

## Best Practices

- Start with a clear **design intent**
- Use **reference planes** for complex geometry
- Apply **GD&T** standards for manufacturing
- Organize features logically in the feature tree

## Advanced Features

- **Simulation** — FEA stress analysis
- **Flow Simulation** — CFD analysis
- **SolidWorks Composer** — Technical documentation
- **PDM** — Product Data Management

## Conclusion

SolidWorks is an essential tool for any mechanical engineer. Master the fundamentals and build from there.`,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
    date: "Dec 1, 2024",
    readTime: "7 min read",
    category: "Engineering",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
  {
    id: "6",
    title: "IoT Project: Building a Smart Home System",
    excerpt: "Step-by-step guide to creating an IoT-based home automation system.",
    content: `## Project Overview

Learn how to build a complete **smart home system** from scratch using Arduino and Raspberry Pi.

## Hardware Requirements

- **Raspberry Pi 4** — Central hub
- **Arduino Uno** — Sensor nodes
- **DHT22** — Temperature & humidity sensor
- **PIR sensor** — Motion detection
- **Relay modules** — Appliance control
- **ESP8266** — WiFi connectivity

## Architecture

### System Design:
1. Sensor nodes collect data via Arduino
2. ESP8266 sends data to Raspberry Pi over MQTT
3. Raspberry Pi processes and stores data
4. Web dashboard for monitoring and control

## Software Stack

- **MQTT** — Lightweight messaging protocol
- **Node-RED** — Visual programming for IoT
- **InfluxDB** — Time-series database
- **Grafana** — Real-time dashboards
- **React** — Custom web interface

## Key Features

- Real-time temperature and humidity monitoring
- Motion-triggered lighting automation
- Remote appliance control via mobile app
- Historical data analysis and trends
- Alert notifications for anomalies

## Security Considerations

- Use TLS encryption for MQTT
- Implement authentication for all endpoints
- Regular firmware updates
- Network segmentation for IoT devices

## Conclusion

Building a smart home system teaches invaluable skills in embedded systems, networking, and full-stack development.`,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Nov 28, 2024",
    readTime: "15 min read",
    category: "IoT",
    author: { name: "Dharaneedharan SS", avatar: "" },
  },
];

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [postComments, setPostComments] = useState<DBComment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const { user } = useAuth();
  const { guest, isGuest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [likesRes, commentsRes] = await Promise.all([
        supabase.functions.invoke("manage-blog-likes", {
          body: { action: "check", post_ids: [id], email: currentUserEmail || undefined },
        }),
        supabase.from("blog_comments_public").select("*").eq("post_id", id).order("created_at", { ascending: true }),
      ]);

      if (likesRes.data) {
        setLikeCount(likesRes.data.counts?.[id] || 0);
        setUserHasLiked(likesRes.data.userLikedPosts?.includes(id) || false);
      }
      if (commentsRes.data) {
        setPostComments(commentsRes.data);
        setCommentCount(commentsRes.data.length);
      }
    } catch (error) {
      console.error("Failed to load blog data:", error);
    }
  }, [id, currentUserEmail]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLike = async () => {
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }
    if (!id) return;

    if (userHasLiked) {
      const { error } = await supabase.functions.invoke("manage-blog-likes", {
        body: { action: "remove", post_id: id, email: currentUserEmail },
      });
      if (!error) {
        setUserHasLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
        toast({ description: "Removed from liked posts" });
      }
    } else {
      const { data, error } = await supabase.functions.invoke("manage-blog-likes", {
        body: { action: "add", post_id: id, name: currentUserName, email: currentUserEmail },
      });
      if (!error && !data?.error) {
        setUserHasLiked(true);
        setLikeCount((c) => c + 1);
        toast({ description: "Added to liked posts!" });
        await supabase.functions.invoke("send-contact-email", {
          body: { type: "blog_like", name: currentUserName, email: currentUserEmail, subject: "New Blog Like", message: `Liked: ${post?.title}`, blogTitle: post?.title, blogUrl: window.location.href },
        });
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || commentData.honeypot) return;

    const name = commentData.name || currentUserName;
    const email = commentData.email || currentUserEmail;
    if (!name || !email || !commentData.text) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blog_comments").insert({
        post_id: id, name, email, content: commentData.text, is_spam: false, is_approved: false,
      });
      if (error) throw error;

      toast({ title: "Comment submitted!", description: "Your comment is pending approval." });
      await supabase.functions.invoke("send-contact-email", {
        body: { type: "blog_comment", name, email, subject: `New Comment on: ${post?.title}`, message: commentData.text, blogTitle: post?.title, blogUrl: window.location.href, comment: commentData.text },
      });
      setCommentData({ name: "", email: "", text: "", honeypot: "" });
      setShowCommentForm(false);
      loadData();
    } catch {
      toast({ title: "Error", description: "Failed to submit comment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold text-sm">DS</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">Full Stack Developer & CAD Engineer</p>
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
                {/* Markdown Content */}
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

                {/* Like & Comment Actions */}
                <ScrollReveal delay={200}>
                  <div className="flex flex-wrap items-center gap-3 mt-12 pt-6 border-t-2 border-border">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-5 py-2.5 font-medium text-sm transition-colors ${
                        userHasLiked
                          ? "bg-red-500 text-white"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Heart size={16} fill={userHasLiked ? "currentColor" : "none"} />
                      {likeCount} Likes
                    </button>
                    <button
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                    >
                      <MessageCircle size={16} /> {commentCount} Comments
                    </button>
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
                              {comment.reply_date && (
                                <span className="text-xs text-muted-foreground">{new Date(comment.reply_date).toLocaleDateString()}</span>
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
