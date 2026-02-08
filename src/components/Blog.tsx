import { useState, useEffect } from "react";
import { Heart, MessageCircle, Clock, ArrowRight, BookOpen, TrendingUp, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DbComment {
  id: string;
  post_id: string;
  name: string;
  content: string;
  reply: string | null;
  reply_date: string | null;
  created_at: string;
}

interface DbLike {
  id: string;
  post_id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
  reply?: string;
  replyDate?: string;
}

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

const initialPosts: Omit<BlogPost, 'likes' | 'comments'>[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring the latest trends and technologies shaping the web development landscape, from AI integration to WebAssembly.",
    content: "The web development landscape is constantly evolving. From AI-powered tools to new frameworks, here's what's changing the game in 2024...",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    date: "Dec 20, 2024",
    readTime: "5 min read",
    category: "Technology",
    author: { name: "Tharaneetharan SS", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Complete Guide",
    excerpt: "Why accessibility matters and how to implement inclusive design practices that benefit all users.",
    content: "Accessibility isn't just a nice-to-have—it's essential. Learn how to make your websites inclusive for everyone...",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Design",
    author: { name: "Tharaneetharan SS", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 3,
    title: "Building Scalable React Applications",
    excerpt: "Best practices and architectural patterns for creating maintainable React codebases that grow with your team.",
    content: "Scaling React applications requires careful planning. Here are the patterns that have worked for me in production...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  {
    id: 4,
    title: "Mastering TypeScript: Advanced Patterns",
    excerpt: "Deep dive into advanced TypeScript patterns that will level up your development skills and code quality.",
    content: "TypeScript offers powerful features beyond basic types. Let's explore advanced patterns that make your code more robust...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    date: "Dec 5, 2024",
    readTime: "12 min read",
    category: "Development",
    author: { name: "Tharaneetharan SS", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingLikePostId, setPendingLikePostId] = useState<number | null>(null);
  const [likeForm, setLikeForm] = useState({ name: "", email: "" });
  const [commentForm, setCommentForm] = useState({ name: "", email: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load comments and likes from database
  useEffect(() => {
    const loadData = async () => {
      try {
      const postIds = initialPosts.map((p) => String(p.id));
        const [commentsRes, likesRes] = await Promise.all([
          supabase.from("blog_comments_public").select("*").order("created_at", { ascending: true }),
          supabase.functions.invoke('manage-blog-likes', {
            body: { action: "count", post_ids: postIds }
          }),
        ]);

        const dbComments: DbComment[] = commentsRes.data || [];
        const likesByPost: Record<string, number> = likesRes.data?.counts || {};

        // Group comments by post_id
        const commentsByPost: Record<string, Comment[]> = {};
        dbComments.forEach((c) => {
          if (!commentsByPost[c.post_id]) commentsByPost[c.post_id] = [];
          commentsByPost[c.post_id].push({
            id: c.id,
            name: c.name,
            
            content: c.content,
            date: new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            reply: c.reply || undefined,
            replyDate: c.reply_date ? new Date(c.reply_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : undefined,
          });
        });

        // Build posts with database data
        const enrichedPosts: BlogPost[] = initialPosts.map((p) => ({
          ...p,
          likes: likesByPost[String(p.id)] || 0,
          comments: commentsByPost[String(p.id)] || [],
        }));

        setPosts(enrichedPosts);
      } catch (error) {
        console.error("Error loading blog data:", error);
        // Fallback to initial posts without DB data
        setPosts(initialPosts.map(p => ({ ...p, likes: 0, comments: [] })));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLikeClick = (postId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (likedPosts.has(postId)) {
      // Unlike - no email needed
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
      // Like - show modal for email
      setPendingLikePostId(postId);
      setShowLikeModal(true);
    }
  };

  const handleLikeSubmit = async () => {
    if (!pendingLikePostId || !likeForm.name || !likeForm.email) {
      toast({ description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const post = posts.find(p => p.id === pendingLikePostId);
    
    try {
      // Save like via edge function (secure, no direct table access)
      const { data: likeResult, error: dbError } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "add", post_id: String(pendingLikePostId), name: likeForm.name, email: likeForm.email }
      });

      if (dbError || likeResult?.error) throw new Error(likeResult?.error || "Failed to like");

      // Send notification to backend (non-blocking)
      supabase.functions.invoke("send-contact-email", {
        body: {
          name: likeForm.name,
          email: likeForm.email,
          subject: `Blog Like: ${post?.title}`,
          message: `Liked article: ${post?.title}`,
          type: "blog_like",
          blogTitle: post?.title,
          blogUrl: `${window.location.origin}/#blog`,
        },
      });

      // Update UI
      setLikedPosts((prev) => new Set([...prev, pendingLikePostId]));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === pendingLikePostId ? { ...p, likes: p.likes + 1 } : p
        )
      );
      
      toast({ description: "Thanks for liking! ❤️" });
      setShowLikeModal(false);
      setLikeForm({ name: "", email: "" });
      setPendingLikePostId(null);
    } catch (error) {
      console.error("Like error:", error);
      toast({ description: "Failed to submit like", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedPost || !commentForm.name || !commentForm.email || !commentForm.comment) {
      toast({ description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save comment to database
      const { data: insertedComment, error: dbError } = await supabase
        .from("blog_comments")
        .insert({
          post_id: String(selectedPost.id),
          name: commentForm.name,
          email: commentForm.email,
          content: commentForm.comment,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Send notification to backend (non-blocking)
      supabase.functions.invoke("send-contact-email", {
        body: {
          name: commentForm.name,
          email: commentForm.email,
          subject: `Blog Comment: ${selectedPost.title}`,
          message: commentForm.comment,
          type: "blog_comment",
          blogTitle: selectedPost.title,
          blogUrl: `${window.location.origin}/#blog`,
          comment: commentForm.comment,
        },
      });

      // Add comment to local state
      const newComment: Comment = {
        id: insertedComment.id,
        name: commentForm.name,
            
        content: commentForm.comment,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };

      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id 
            ? { ...p, comments: [...p.comments, newComment] } 
            : p
        )
      );
      
      // Update selectedPost to show the new comment
      setSelectedPost((prev) => 
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );
      
      toast({ description: "Comment submitted! 💬" });
      setShowCommentModal(false);
      setCommentForm({ name: "", email: "", comment: "" });
    } catch (error) {
      console.error("Comment error:", error);
      toast({ description: "Failed to submit comment", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section id="blog" className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-tr-[200px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full mb-6 border border-border">
            <BookOpen className="text-primary" size={16} />
            <span className="text-foreground font-medium text-sm">Latest Articles</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Insights & <span className="text-gradient">Tutorials</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on web development, design patterns, and lessons learned 
            from building products used by thousands.
          </p>
        </div>

        {/* Featured Post */}
        <div 
          className="bg-card rounded-3xl overflow-hidden border-glow hover-lift mb-12 cursor-pointer group"
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
                    onClick={(e) => handleLikeClick(featuredPost.id, e)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${likedPosts.has(featuredPost.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                  >
                    <Heart size={18} fill={likedPosts.has(featuredPost.id) ? "currentColor" : "none"} />
                    {featuredPost.likes}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MessageCircle size={18} /> {featuredPost.comments.length}
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

        {/* Other Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {otherPosts.map((post) => (
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
                      onClick={(e) => handleLikeClick(post.id, e)}
                      className={`flex items-center gap-1 text-sm transition-colors ${likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                    >
                      <Heart size={16} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle size={16} /> {post.comments.length}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
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
                  onClick={() => handleLikeClick(selectedPost.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-colors font-medium ${likedPosts.has(selectedPost.id) ? "bg-red-500/10 text-red-500" : "bg-secondary text-muted-foreground hover:text-red-500"}`}
                >
                  <Heart size={18} fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"} />
                  {posts.find((p) => p.id === selectedPost.id)?.likes} Likes
                </button>
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary rounded-xl text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  <MessageCircle size={18} /> Add Comment
                </button>
              </div>

              {/* Comments Section */}
              {selectedPost.comments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-semibold text-lg mb-4">Comments ({selectedPost.comments.length})</h3>
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="bg-secondary/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{comment.name}</p>
                            <p className="text-xs text-muted-foreground">{comment.date}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm pl-10">{comment.content}</p>
                        
                        {/* Reply from owner */}
                        {comment.reply && (
                          <div className="ml-10 mt-3 pl-4 border-l-2 border-primary">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-primary">Tharaneetharan SS</span>
                              <span className="text-xs text-muted-foreground">{comment.replyDate}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Like Modal */}
      <Dialog open={showLikeModal} onOpenChange={setShowLikeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="text-red-500" size={20} />
              Like this article
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter your details to like this article. You'll receive updates!
            </p>
            <Input
              placeholder="Your name"
              value={likeForm.name}
              onChange={(e) => setLikeForm({ ...likeForm, name: e.target.value })}
              disabled={isSubmitting}
            />
            <Input
              type="email"
              placeholder="your@email.com"
              value={likeForm.email}
              onChange={(e) => setLikeForm({ ...likeForm, email: e.target.value })}
              disabled={isSubmitting}
            />
            <Button 
              onClick={handleLikeSubmit} 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Heart className="w-4 h-4 mr-2" />
              )}
              Like Article
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Modal */}
      <Dialog open={showCommentModal} onOpenChange={setShowCommentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="text-primary" size={20} />
              Add a comment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Share your thoughts on this article.
            </p>
            <Input
              placeholder="Your name"
              value={commentForm.name}
              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
              disabled={isSubmitting}
            />
            <Input
              type="email"
              placeholder="your@email.com"
              value={commentForm.email}
              onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
              disabled={isSubmitting}
            />
            <Textarea
              placeholder="Write your comment..."
              value={commentForm.comment}
              onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
              disabled={isSubmitting}
              rows={4}
            />
            <Button 
              onClick={handleCommentSubmit} 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Submit Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Blog;
