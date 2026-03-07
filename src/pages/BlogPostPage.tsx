import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import StyledArticleRenderer from "@/components/StyledArticleRenderer";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Clock, ArrowLeft, Send, User, Calendar, Tag, Eye, Share2, Twitter, Linkedin, Link2, Facebook, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "@/components/GuestAccessModal";
import { useBlogData } from "@/hooks/useBlogData";
import { blogPosts } from "@/data/blogPostsData";
import BlogDownloadButton from "@/components/blog/BlogDownloadButton";
import { useDownloadCount } from "@/hooks/useDownloadCount";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentData, setCommentData] = useState({ name: "", email: "", text: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  const {
    likeCount,
    comments: postComments,
    commentCount,
    viewCount,
    hasLiked: userHasLiked,
    addLike,
    addComment,
    refresh: refreshData,
  } = useBlogData(id || "", currentUserEmail, currentUserName);

  const { count: blogDownloadCount, refresh: refreshBlogDownloads } = useDownloadCount("blog", id || "");
  const handleLike = async () => {
    if (!currentUserEmail || !currentUserName) { setShowAccessModal(true); return; }
    await addLike(currentUserName, currentUserEmail);
    if (!userHasLiked) {
      await supabase.functions.invoke("send-contact-email", { body: { type: "blog_like", name: currentUserName, email: currentUserEmail, subject: "New Blog Like", message: `Liked: ${post?.title}`, blogTitle: post?.title, blogUrl: window.location.href } });
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
      const success = await addComment(name, email, commentData.text, commentData.honeypot);
      if (success) {
        await supabase.functions.invoke("send-contact-email", { body: { type: "blog_comment", name, email, subject: `New Comment on: ${post?.title}`, message: commentData.text, blogTitle: post?.title, blogUrl: window.location.href, comment: commentData.text } });
        setCommentData({ name: "", email: "", text: "", honeypot: "" });
        setShowCommentForm(false);
      }
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
        <ReadingProgressBar />
        <Navigation />
        <main className="pt-20">
          {/* Hero */}
          <section className="relative">
            <div className="aspect-[21/9] max-h-[420px] overflow-hidden relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
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
                          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"><Twitter size={16} /> Twitter / X</a>
                          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"><Linkedin size={16} /> LinkedIn</a>
                          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors"><Facebook size={16} /> Facebook</a>
                          <button onClick={handleCopyLink} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors w-full text-left"><Link2 size={16} /> Copy Link</button>
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
                  <StyledArticleRenderer content={post.content} />
                </ScrollReveal>

                {/* Engagement Bar */}
                <ScrollReveal delay={200}>
                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 ${userHasLiked ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                          <Heart size={18} fill={userHasLiked ? "currentColor" : "none"} />
                          <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                        <button onClick={() => { if (!currentUserEmail) { setShowAccessModal(true); return; } setShowCommentForm(!showCommentForm); }} className="flex items-center gap-2 px-4 py-2 bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle size={18} />
                          <span className="text-sm font-medium">{commentCount}</span>
                        </button>
                        <BlogDownloadButton
                          postId={post.id}
                          title={post.title}
                          content={post.content}
                          author={post.author.name}
                          date={post.date}
                          category={post.category}
                          downloadCount={blogDownloadCount}
                          onDownloaded={refreshBlogDownloads}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye size={14} /> {viewCount} readers
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Comment Form */}
                {showCommentForm && (
                  <ScrollReveal delay={100}>
                    <form onSubmit={handleComment} className="mt-8 p-6 bg-secondary/30 border border-border space-y-4">
                      <h3 className="font-display font-bold text-lg">Leave a Comment</h3>
                      <input type="text" className="hidden" value={commentData.honeypot} onChange={(e) => setCommentData({ ...commentData, honeypot: e.target.value })} tabIndex={-1} autoComplete="off" />
                      {!currentUserEmail && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input placeholder="Your name" value={commentData.name} onChange={(e) => setCommentData({ ...commentData, name: e.target.value })} />
                          <Input type="email" placeholder="Your email" value={commentData.email} onChange={(e) => setCommentData({ ...commentData, email: e.target.value })} />
                        </div>
                      )}
                      <Textarea placeholder="Write your comment..." value={commentData.text} onChange={(e) => setCommentData({ ...commentData, text: e.target.value })} rows={4} />
                      <Button type="submit" disabled={isSubmitting} className="gap-2">
                        <Send size={14} /> {isSubmitting ? "Submitting..." : "Submit Comment"}
                      </Button>
                    </form>
                  </ScrollReveal>
                )}

                {/* Comments List */}
                {postComments.length > 0 && (
                  <ScrollReveal delay={200}>
                    <div className="mt-10">
                      <h3 className="font-display font-bold text-xl mb-6">Comments ({commentCount})</h3>
                      <div className="space-y-6">
                        {postComments.map((comment) => (
                          <div key={comment.id} className="p-5 bg-card border border-border">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-foreground/10 flex items-center justify-center">
                                <User size={14} className="text-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{comment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                            {comment.reply && (
                              <div className="mt-4 ml-6 p-4 bg-secondary/50 border-l-2 border-foreground">
                                <p className="text-xs font-medium mb-1">Author Reply</p>
                                <p className="text-muted-foreground text-sm">{comment.reply}</p>
                                {comment.reply_date && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(comment.reply_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
      <ImageLightbox images={[{ src: post.image, alt: post.title }]} initialIndex={0} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
};

export default BlogPostPage;
