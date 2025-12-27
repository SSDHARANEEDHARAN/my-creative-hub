import { useState } from "react";
import { Heart, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

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
}

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape.",
    content: "The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024...",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    likes: 42,
    comments: 12,
    category: "Technology",
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement it in your projects effectively.",
    content: "Accessibility isn't just a nice-to-have—it's essential. Learn how to make your websites inclusive for everyone...",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    likes: 38,
    comments: 8,
    category: "Design",
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and patterns for creating maintainable React codebases.",
    content: "Scaling React applications requires careful planning. Here are the patterns that have worked for me in production...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    likes: 56,
    comments: 15,
    category: "Development",
  },
];

const Blog = () => {
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

  return (
    <section id="blog" className="py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase mb-4">
            Blog
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-gradient">Articles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, design, 
            and the tech industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-card rounded-2xl overflow-hidden border-glow hover-lift group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedPosts.has(post.id)
                          ? "text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                      />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle size={18} />
                      {post.comments}
                    </span>
                  </div>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="heroOutline" size="lg">
            View All Articles
          </Button>
        </div>
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-card max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border animate-fade-up"
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
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {selectedPost.category}
              </span>
              <h2 className="font-display text-3xl font-bold mt-4 mb-4">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>{selectedPost.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {selectedPost.readTime}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {selectedPost.content}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    likedPosts.has(selectedPost.id)
                      ? "bg-red-500/10 text-red-500"
                      : "bg-secondary text-muted-foreground hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"}
                  />
                  {posts.find((p) => p.id === selectedPost.id)?.likes} Likes
                </button>
                <span className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-muted-foreground">
                  <MessageCircle size={18} />
                  {selectedPost.comments} Comments
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;
