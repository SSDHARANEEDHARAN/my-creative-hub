import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Heart, MessageCircle, Clock, ArrowRight, BookOpen, TrendingUp } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape, from AI integration to WebAssembly.",
    content: "The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024...",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    likes: 142,
    comments: 28,
    category: "Technology",
    author: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices that benefit all users.",
    content: "Accessibility isn't just a nice-to-have—it's essential. Learn how to make your websites inclusive for everyone...",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    likes: 98,
    comments: 15,
    category: "Design",
    author: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for creating maintainable React codebases that grow with your team.",
    content: "Scaling React applications requires careful planning. Here are the patterns that have worked for me in production...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    likes: 256,
    comments: 42,
    category: "Development",
    author: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 4,
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns that will level up your development skills and code quality.",
    content: "TypeScript offers powerful features beyond basic types. Let's explore advanced patterns that make your code more robust...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024",
    readTime: "12 min read",
    likes: 189,
    comments: 31,
    category: "Development",
    author: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleLike = (postId: number) => {
    if (likedPosts.has(postId)) {
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
      toast({ description: "Removed from liked posts" });
    } else {
      setLikedPosts((prev) => new Set([...prev, postId]));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      toast({ description: "Added to liked posts!" });
    }
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | Alex Chen - Insights & Tutorials</title>
        <meta name="description" content="Read articles about web development, design patterns, and lessons learned from building products." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-tr-[200px] -z-10" />
            
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full mb-6 border border-border">
                    <BookOpen className="text-primary" size={16} />
                    <span className="text-foreground font-medium text-sm">Latest Articles</span>
                  </div>
                  
                  <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                    Insights & <span className="text-gradient">Tutorials</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Thoughts on web development, design patterns, and lessons learned 
                    from building products used by thousands.
                  </p>
                </div>
              </ScrollReveal>

              {/* Featured Post */}
              <ScrollReveal delay={100}>
                <div 
                  className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 mb-12 cursor-pointer group"
                  onClick={() => setSelectedPost(featuredPost)}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                          <TrendingUp size={12} /> Trending
                        </span>
                        <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                          {featuredPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">{featuredPost.author.name}</p>
                          <p className="text-muted-foreground text-xs">{featuredPost.date}</p>
                        </div>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(featuredPost.id); }}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.has(featuredPost.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                          >
                            <Heart size={18} fill={likedPosts.has(featuredPost.id) ? "currentColor" : "none"} />
                            {featuredPost.likes}
                          </button>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MessageCircle size={18} /> {featuredPost.comments}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock size={18} /> {featuredPost.readTime}
                          </span>
                        </div>
                        <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                          Read Article <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Other Posts Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {otherPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 100}>
                    <article
                      className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                              className={`flex items-center gap-1 text-sm transition-colors ${likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                            >
                              <Heart size={16} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                              {post.likes}
                            </button>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MessageCircle size={16} /> {post.comments}
                            </span>
                          </div>
                          <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-card max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-border animate-scale-in shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-card transition-colors border border-border"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    {selectedPost.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{selectedPost.author.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{selectedPost.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {selectedPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <h2 className="font-display text-3xl font-bold mb-6">
                  {selectedPost.title}
                </h2>
                <div className="prose prose-lg text-muted-foreground">
                  <p className="leading-relaxed mb-6">{selectedPost.content}</p>
                  <p className="leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-colors font-medium ${likedPosts.has(selectedPost.id) ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground hover:text-red-500"}`}
                  >
                    <Heart size={18} fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"} />
                    {posts.find((p) => p.id === selectedPost.id)?.likes} Likes
                  </button>
                  <span className="flex items-center gap-2 px-5 py-2.5 bg-secondary rounded-xl text-muted-foreground font-medium">
                    <MessageCircle size={18} /> {selectedPost.comments} Comments
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPage;
