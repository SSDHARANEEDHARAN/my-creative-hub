import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ArrowRight, BookOpen, TrendingUp, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";
import { useBlogListCounts } from "@/hooks/useBlogData";

import { blogPosts as staticPosts, BlogPost } from "@/data/blogPostsData";


const BlogPage = () => {
  const navigate = useNavigate();
  const [posts] = useState<BlogPost[]>(staticPosts);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { user } = useAuth();
  const { guest } = useGuest();

  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  const postIds = posts.map((p) => p.id);
  const { likeCounts, commentCounts, viewCounts, userLikes, setUserLikes, setLikeCounts } = useBlogListCounts(postIds, currentUserEmail);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }

    const hasLiked = userLikes.has(postId);

    if (hasLiked) {
      const { error } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "remove", post_id: postId, email: currentUserEmail }
      });
      if (!error) {
        setUserLikes((prev) => { const s = new Set(prev); s.delete(postId); return s; });
        setLikeCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
        toast({ description: "Removed from liked posts" });
      }
    } else {
      const { data, error } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "add", post_id: postId, name: currentUserName, email: currentUserEmail }
      });
      if (!error && !data?.error) {
        setUserLikes((prev) => new Set([...prev, postId]));
        setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        toast({ description: "Added to liked posts!" });
        const post = posts.find((p) => p.id === postId);
        await supabase.functions.invoke("send-contact-email", {
          body: { type: "blog_like", name: currentUserName, email: currentUserEmail, subject: "New Blog Like", message: `Liked: ${post?.title}`, blogTitle: post?.title, blogUrl: window.location.href },
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog | Dharaneedharan SS - Insights & Tutorials</title>
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
                    Thoughts on web development, design patterns, and lessons learned from building products used by thousands.
                  </p>
                </div>
              </ScrollReveal>

              {/* Category Filters */}
              <ScrollReveal delay={50}>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                        activeCategory === cat
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {/* Featured Post */}
              {featuredPost && (
                <ScrollReveal delay={100}>
                  <div
                    className="bg-card overflow-hidden hover:shadow-lg transition-all duration-300 mb-8 sm:mb-12 cursor-pointer group"
                    onClick={() => navigate(`/blog/${featuredPost.id}`)}
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
                        <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-2">
                          <span className="px-2 sm:px-3 py-1 bg-foreground text-background text-xs font-semibold flex items-center gap-1">
                            <TrendingUp size={10} /> Trending
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium">{featuredPost.category}</span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-foreground flex items-center justify-center">
                            <span className="text-background font-bold text-xs sm:text-sm">DS</span>
                          </div>
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{featuredPost.author.name}</p>
                            <p className="text-muted-foreground text-xs">{featuredPost.date}</p>
                          </div>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-muted-foreground transition-colors">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{featuredPost.excerpt}</p>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <button
                              onClick={(e) => handleLike(featuredPost.id, e)}
                              className={`flex items-center gap-1.5 text-xs sm:text-sm transition-colors ${userLikes.has(featuredPost.id) ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              <Heart size={16} fill={userLikes.has(featuredPost.id) ? "currentColor" : "none"} />
                              {likeCounts[featuredPost.id] || 0}
                            </button>
                            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                              <MessageCircle size={16} /> {commentCounts[featuredPost.id] || 0}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                              <Eye size={16} /> {viewCounts[featuredPost.id] || 0}
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
              )}

              {/* Other Posts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {otherPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 50} className="h-full">
                    <article
                      className="bg-card overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <div className="relative overflow-hidden aspect-[16/10]">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          <span className="px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-3 sm:mb-4">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3 group-hover:text-muted-foreground transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 sm:pt-4 mt-auto border-t border-border">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button
                              onClick={(e) => handleLike(post.id, e)}
                              className={`flex items-center gap-1 text-xs sm:text-sm transition-colors ${userLikes.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              <Heart size={14} fill={userLikes.has(post.id) ? "currentColor" : "none"} />
                              {likeCounts[post.id] || 0}
                            </button>
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <MessageCircle size={14} /> {commentCounts[post.id] || 0}
                            </span>
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                              <Eye size={14} /> {viewCounts[post.id] || 0}
                            </span>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No posts found in this category.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />

        <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
      </div>
    </>
  );
};

export default BlogPage;
