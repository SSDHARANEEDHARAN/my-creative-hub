import { useEffect, useState } from "react";
import { MessageCircle, Reply, Trash2, Send, Loader2, ArrowLeft, Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogComment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  reply: string | null;
  reply_date: string | null;
  created_at: string;
}

interface BlogLike {
  id: string;
  post_id: string;
  name: string;
  email: string;
  created_at: string;
}

const BlogCommentsPage = () => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [likes, setLikes] = useState<BlogLike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyModal, setReplyModal] = useState<{ open: boolean; comment: BlogComment | null }>({ open: false, comment: null });
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; commentId: string | null }>({ open: false, commentId: null });
  const [activeTab, setActiveTab] = useState<"comments" | "likes">("comments");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [commentsRes, likesRes] = await Promise.all([
        supabase.from("blog_comments").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_likes").select("*").order("created_at", { ascending: false }),
      ]);

      if (commentsRes.error) throw commentsRes.error;
      if (likesRes.error) throw likesRes.error;

      setComments(commentsRes.data || []);
      setLikes(likesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReply = async () => {
    if (!replyModal.comment || !replyText.trim()) return;

    setIsSubmitting(true);
    try {
      // Update comment with reply
      const { error: updateError } = await supabase
        .from("blog_comments")
        .update({
          reply: replyText.trim(),
          reply_date: new Date().toISOString(),
        })
        .eq("id", replyModal.comment.id);

      if (updateError) throw updateError;

      // Send email notification to commenter
      await supabase.functions.invoke("send-contact-email", {
        body: {
          name: replyModal.comment.name,
          email: replyModal.comment.email,
          subject: "Reply to your comment",
          message: replyText.trim(),
          type: "comment_reply",
          blogTitle: `Post #${replyModal.comment.post_id}`,
          originalComment: replyModal.comment.content,
          replyContent: replyText.trim(),
        },
      });

      toast({ description: "Reply sent successfully!" });
      setReplyModal({ open: false, comment: null });
      setReplyText("");
      fetchData();
    } catch (error) {
      console.error("Reply error:", error);
      toast({ description: "Failed to send reply", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.commentId) return;

    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", deleteDialog.commentId);

      if (error) throw error;

      toast({ description: "Comment deleted" });
      setDeleteDialog({ open: false, commentId: null });
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast({ description: "Failed to delete comment", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Blog Management</h1>
                <p className="text-muted-foreground">Manage comments and view likes</p>
              </div>
            </div>
            <Button onClick={fetchData} variant="outline" className="gap-2">
              <RefreshCw size={16} /> Refresh
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "comments" ? "default" : "outline"}
              onClick={() => setActiveTab("comments")}
              className="gap-2"
            >
              <MessageCircle size={16} />
              Comments ({comments.length})
            </Button>
            <Button
              variant={activeTab === "likes" ? "default" : "outline"}
              onClick={() => setActiveTab("likes")}
              className="gap-2"
            >
              <Heart size={16} />
              Likes ({likes.length})
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeTab === "comments" ? (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{comment.name}</p>
                            <p className="text-sm text-muted-foreground">{comment.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Post ID: {comment.post_id} • {formatDate(comment.created_at)}
                        </p>
                        <p className="text-foreground mt-3">{comment.content}</p>

                        {/* Existing Reply */}
                        {comment.reply && (
                          <div className="mt-4 ml-6 pl-4 border-l-2 border-primary bg-primary/5 rounded-r-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-primary">Your Reply</span>
                              {comment.reply_date && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.reply_date)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{comment.reply}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyModal({ open: true, comment });
                            setReplyText(comment.reply || "");
                          }}
                          className="gap-1"
                        >
                          <Reply size={14} />
                          {comment.reply ? "Edit Reply" : "Reply"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, commentId: comment.id })}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {likes.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No likes yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {likes.map((like) => (
                    <div key={like.id} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                          <Heart size={18} className="text-red-500" fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-medium">{like.name}</p>
                          <p className="text-xs text-muted-foreground">{like.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Post ID: {like.post_id} • {formatDate(like.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Reply Modal */}
      <Dialog open={replyModal.open} onOpenChange={(open) => setReplyModal({ open, comment: open ? replyModal.comment : null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to {replyModal.comment?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Original comment:</p>
              <p className="text-foreground">{replyModal.comment?.content}</p>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyModal({ open: false, comment: null })} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleReply} disabled={isSubmitting || !replyText.trim()} className="gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, commentId: open ? deleteDialog.commentId : null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default BlogCommentsPage;
