import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ArrowRight, BookOpen, TrendingUp, X, Send } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  likes: number;
  comments: Comment[];
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface Comment {
  id: number;
  name: string;
  email: string;
  text: string;
  date: string;
}

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape, from AI integration to WebAssembly.",
    content: "The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024. We're seeing a massive shift towards AI-assisted development, where tools like GitHub Copilot and ChatGPT are revolutionizing how developers write code. WebAssembly is enabling near-native performance in browsers, opening doors for complex applications that were previously impossible on the web.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    likes: 142,
    comments: [],
    category: "Technology",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices that benefit all users.",
    content: "Accessibility isn't just a nice-to-have—it's essential. Learn how to make your websites inclusive for everyone. This comprehensive guide covers WCAG guidelines, semantic HTML, ARIA labels, keyboard navigation, and color contrast requirements. Making your website accessible improves SEO, reaches more users, and is often required by law.",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    likes: 98,
    comments: [],
    category: "Design",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for creating maintainable React codebases that grow with your team.",
    content: "Scaling React applications requires careful planning. Here are the patterns that have worked for me in production. We'll cover component composition, state management strategies, code splitting, and folder structure best practices.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    likes: 256,
    comments: [],
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 4,
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns that will level up your development skills and code quality.",
    content: "TypeScript offers powerful features beyond basic types. Let's explore advanced patterns that make your code more robust including generics, conditional types, mapped types, and template literal types.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024",
    readTime: "12 min read",
    likes: 189,
    comments: [],
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 5,
    title: "Introduction to CAD Engineering with SolidWorks",
    excerpt: "Getting started with SolidWorks for mechanical design and 3D modeling in engineering projects.",
    content: "SolidWorks is one of the most powerful CAD tools for mechanical engineering. This beginner's guide covers the fundamentals of 3D modeling, assemblies, and engineering drawings.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
    date: "Dec 1, 2024",
    readTime: "7 min read",
    likes: 134,
    comments: [],
    category: "Engineering",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 6,
    title: "IoT Project: Building a Smart Home System",
    excerpt: "Step-by-step guide to creating an IoT-based home automation system using Arduino and Raspberry Pi.",
    content: "Learn how to build a complete smart home system from scratch. We'll cover sensor integration, microcontroller programming, and creating a mobile app for control.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    date: "Nov 28, 2024",
    readTime: "15 min read",
    likes: 221,
    comments: [],
    category: "IoT",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 7,
    title: "Python for Data Analysis: Pandas Essentials",
    excerpt: "Master data manipulation and analysis with Python's Pandas library for real-world applications.",
    content: "Pandas is the cornerstone of data analysis in Python. Learn essential operations for cleaning, transforming, and analyzing datasets effectively.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop",
    date: "Nov 25, 2024",
    readTime: "9 min read",
    likes: 167,
    comments: [],
    category: "Data Science",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 8,
    title: "FlexSim Simulation: Warehouse Optimization",
    excerpt: "Using FlexSim to model and optimize warehouse operations for improved efficiency.",
    content: "Simulation is a powerful tool for optimizing complex systems. Learn how to use FlexSim to model warehouse operations and identify bottlenecks.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop",
    date: "Nov 20, 2024",
    readTime: "11 min read",
    likes: 89,
    comments: [],
    category: "Simulation",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 9,
    title: "Modern CSS Techniques: Grid and Flexbox",
    excerpt: "Master modern CSS layout techniques for creating responsive and beautiful web designs.",
    content: "CSS Grid and Flexbox have revolutionized web layout. Learn when to use each and how to combine them for powerful, responsive designs.",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=500&fit=crop",
    date: "Nov 15, 2024",
    readTime: "6 min read",
    likes: 178,
    comments: [],
    category: "Design",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 10,
    title: "API Design Best Practices with Node.js",
    excerpt: "Create robust and scalable REST APIs using Node.js and Express with industry best practices.",
    content: "Building APIs that are secure, performant, and maintainable requires following established patterns. This guide covers authentication, validation, error handling, and documentation.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop",
    date: "Nov 10, 2024",
    readTime: "13 min read",
    likes: 203,
    comments: [],
    category: "Backend",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 11,
    title: "Understanding PLM with PTC Windchill",
    excerpt: "Product Lifecycle Management fundamentals and how Windchill streamlines engineering workflows.",
    content: "PLM is essential for managing product data throughout its lifecycle. Learn how PTC Windchill helps organizations manage CAD data, BOMs, and engineering changes.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
    date: "Nov 5, 2024",
    readTime: "8 min read",
    likes: 76,
    comments: [],
    category: "Engineering",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 12,
    title: "React Native: Building Cross-Platform Apps",
    excerpt: "Develop mobile applications for iOS and Android using a single React Native codebase.",
    content: "React Native allows you to build truly native mobile apps while leveraging your React knowledge. Learn the key differences from web development and mobile-specific considerations.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop",
    date: "Nov 1, 2024",
    readTime: "10 min read",
    likes: 234,
    comments: [],
    category: "Mobile",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 13,
    title: "GD&T Fundamentals for Mechanical Engineers",
    excerpt: "Understanding Geometric Dimensioning and Tolerancing for precision engineering.",
    content: "GD&T is the language of engineering drawings. Master the symbols, datums, and tolerance zones that ensure parts fit together correctly.",
    image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&h=500&fit=crop",
    date: "Oct 28, 2024",
    readTime: "12 min read",
    likes: 112,
    comments: [],
    category: "Engineering",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 14,
    title: "Database Design: SQL vs NoSQL",
    excerpt: "Choosing the right database for your project and understanding when to use each type.",
    content: "The choice between SQL and NoSQL databases depends on your data structure, scalability needs, and query patterns. Learn the pros and cons of each approach.",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    date: "Oct 25, 2024",
    readTime: "9 min read",
    likes: 156,
    comments: [],
    category: "Backend",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 15,
    title: "Arduino Projects for Beginners",
    excerpt: "Start your embedded systems journey with these fun and educational Arduino projects.",
    content: "Arduino is the perfect platform to learn embedded programming. From blinking LEDs to sensor-based projects, these beginner-friendly tutorials will get you started.",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&h=500&fit=crop",
    date: "Oct 20, 2024",
    readTime: "7 min read",
    likes: 198,
    comments: [],
    category: "IoT",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 16,
    title: "Tailwind CSS: Utility-First Approach",
    excerpt: "Why utility-first CSS is gaining popularity and how to use Tailwind effectively.",
    content: "Tailwind CSS has changed how we write styles. Learn the philosophy behind utility-first CSS and tips for maintaining clean, readable code.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=500&fit=crop",
    date: "Oct 15, 2024",
    readTime: "6 min read",
    likes: 245,
    comments: [],
    category: "Design",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 17,
    title: "Siemens NX: Advanced Modeling Techniques",
    excerpt: "Take your NX skills to the next level with advanced surfacing and assembly design.",
    content: "Siemens NX offers powerful capabilities for complex 3D modeling. Learn advanced techniques for surface modeling, parametric design, and assembly constraints.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=500&fit=crop",
    date: "Oct 10, 2024",
    readTime: "14 min read",
    likes: 87,
    comments: [],
    category: "Engineering",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
  {
    id: 18,
    title: "Git Workflow Best Practices",
    excerpt: "Master version control with Git branching strategies and collaborative workflows.",
    content: "Effective Git usage is essential for team collaboration. Learn about branching strategies, commit conventions, and pull request best practices.",
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=500&fit=crop",
    date: "Oct 5, 2024",
    readTime: "8 min read",
    likes: 312,
    comments: [],
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "" },
  },
];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async (postId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (likedPosts.has(postId)) {
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: p.likes - 1 } : p
        )
      );
      toast({ description: "Removed from liked posts" });
    } else {
      setLikedPosts((prev) => new Set([...prev, postId]));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + 1 } : p
        )
      );
      toast({ description: "Added to liked posts!" });

      // Send like notification to backend
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            type: "blog_like",
            name: "Blog Visitor",
            email: "visitor@portfolio.com",
            subject: "Blog Like",
            message: `Liked: ${post.title}`,
            blogTitle: post.title,
            blogUrl: window.location.href,
          },
        });
      } catch (error) {
        console.error("Failed to send like notification:", error);
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentData.name || !commentData.email || !commentData.text) return;

    setIsSubmitting(true);

    try {
      // Send comment notification to backend
      await supabase.functions.invoke('send-contact-email', {
        body: {
          type: "blog_comment",
          name: commentData.name,
          email: commentData.email,
          subject: `Comment on: ${selectedPost.title}`,
          message: commentData.text,
          blogTitle: selectedPost.title,
          blogUrl: window.location.href,
          comment: commentData.text,
        },
      });

      // Add comment locally
      const newComment: Comment = {
        id: Date.now(),
        name: commentData.name,
        email: commentData.email,
        text: commentData.text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );

      setSelectedPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );

      toast({ title: "Comment submitted!", description: "Thank you for your feedback." });
      setCommentData({ name: "", email: "", text: "" });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast({ title: "Error", description: "Failed to submit comment. Please try again.", variant: "destructive" });
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
        <meta name="description" content="Read articles about web development, design patterns, and lessons learned from building products." />
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
                    <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Latest Articles</span>
                  </div>
                  
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                    Insights & <span className="text-gradient">Tutorials</span>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                    Thoughts on web development, design patterns, and lessons learned 
                    from building products used by thousands.
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
                            className={`flex items-center gap-1.5 text-xs sm:text-sm transition-colors ${likedPosts.has(featuredPost.id) ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            <Heart size={16} fill={likedPosts.has(featuredPost.id) ? "currentColor" : "none"} />
                            {posts.find(p => p.id === featuredPost.id)?.likes}
                          </button>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                            <MessageCircle size={16} /> {posts.find(p => p.id === featuredPost.id)?.comments.length}
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
                              className={`flex items-center gap-1 text-xs sm:text-sm transition-colors ${likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              <Heart size={14} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                              {posts.find(p => p.id === post.id)?.likes}
                            </button>
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <MessageCircle size={14} /> {posts.find(p => p.id === post.id)?.comments.length}
                            </span>
                          </div>
                          <ArrowRight size={14} className="text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
            onClick={() => { setSelectedPost(null); setShowCommentForm(false); }}
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
                  onClick={() => { setSelectedPost(null); setShowCommentForm(false); }}
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
                  <p className="leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{selectedPost.content}</p>
                  <p className="leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>

                {/* Like & Comment Section */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-muted">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 transition-colors font-medium text-sm ${likedPosts.has(selectedPost.id) ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    <Heart size={16} fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"} />
                    {posts.find((p) => p.id === selectedPost.id)?.likes} Likes
                  </button>
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-secondary text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  >
                    <MessageCircle size={16} /> {posts.find((p) => p.id === selectedPost.id)?.comments.length} Comments
                  </button>
                </div>

                {/* Comments List */}
                {posts.find((p) => p.id === selectedPost.id)?.comments && posts.find((p) => p.id === selectedPost.id)!.comments.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-sm">Comments</h4>
                    {posts.find((p) => p.id === selectedPost.id)!.comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-secondary/50 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-foreground/20 rounded-full flex items-center justify-center text-xs font-bold">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{comment.name}</p>
                            <p className="text-xs text-muted-foreground">{comment.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Form */}
                {showCommentForm && (
                  <form onSubmit={handleComment} className="mt-6 p-4 bg-secondary/30 space-y-4">
                    <h4 className="font-semibold text-sm">Leave a Comment</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name *"
                        value={commentData.name}
                        onChange={(e) => setCommentData({ ...commentData, name: e.target.value })}
                        required
                        className="h-10 text-sm"
                      />
                      <Input
                        type="email"
                        placeholder="Your Email *"
                        value={commentData.email}
                        onChange={(e) => setCommentData({ ...commentData, email: e.target.value })}
                        required
                        className="h-10 text-sm"
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
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;
