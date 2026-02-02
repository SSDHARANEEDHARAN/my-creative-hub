import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Check, X, Trash2, AlertTriangle, MessageSquare, Users, RefreshCw } from "lucide-react";

interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
  is_spam: boolean;
  reply: string | null;
}

interface GuestVisitor {
  id: string;
  name: string;
  email: string;
  visited_at: string;
}

const AdminModerationPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [guests, setGuests] = useState<GuestVisitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [commentsRes, guestsRes] = await Promise.all([
        supabase
          .from("blog_comments")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("guest_visitors")
          .select("*")
          .order("visited_at", { ascending: false }),
      ]);

      if (commentsRes.data) setComments(commentsRes.data);
      if (guestsRes.data) setGuests(guestsRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approveComment = async (id: string) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to approve comment", variant: "destructive" });
      return;
    }

    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, is_approved: true } : c))
    );
    toast({ title: "Comment approved" });
  };

  const markAsSpam = async (id: string) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_spam: true, is_approved: false })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to mark as spam", variant: "destructive" });
      return;
    }

    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, is_spam: true, is_approved: false } : c))
    );
    toast({ title: "Marked as spam" });
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("blog_comments").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete comment", variant: "destructive" });
      return;
    }

    setComments(prev => prev.filter(c => c.id !== id));
    toast({ title: "Comment deleted" });
  };

  const pendingComments = comments.filter(c => !c.is_approved && !c.is_spam);
  const approvedComments = comments.filter(c => c.is_approved);
  const spamComments = comments.filter(c => c.is_spam);

  return (
    <PageTransition>
      <Helmet>
        <title>Admin Moderation | Tharaneetharan SS</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Moderation</h1>
                <p className="text-muted-foreground mt-1">
                  Manage comments and guest visitors
                </p>
              </div>
              <Button onClick={loadData} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingComments.length > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      {pendingComments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedComments.length})</TabsTrigger>
                <TabsTrigger value="spam">Spam ({spamComments.length})</TabsTrigger>
                <TabsTrigger value="guests">Guests ({guests.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingComments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      No pending comments
                    </CardContent>
                  </Card>
                ) : (
                  pendingComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onApprove={() => approveComment(comment.id)}
                      onSpam={() => markAsSpam(comment.id)}
                      onDelete={() => deleteComment(comment.id)}
                      showActions
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedComments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No approved comments
                    </CardContent>
                  </Card>
                ) : (
                  approvedComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onDelete={() => deleteComment(comment.id)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="spam" className="space-y-4">
                {spamComments.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      No spam comments
                    </CardContent>
                  </Card>
                ) : (
                  spamComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onApprove={() => approveComment(comment.id)}
                      onDelete={() => deleteComment(comment.id)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="guests" className="space-y-4">
                {guests.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      No guest visitors yet
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {guests.map((guest) => (
                      <Card key={guest.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{guest.name}</p>
                              <p className="text-sm text-muted-foreground">{guest.email}</p>
                            </div>
                            <Badge variant="secondary">
                              {new Date(guest.visited_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

interface CommentCardProps {
  comment: Comment;
  onApprove?: () => void;
  onSpam?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const CommentCard = ({ comment, onApprove, onSpam, onDelete, showActions }: CommentCardProps) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{comment.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{comment.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Post: {comment.post_id}</Badge>
          <Badge variant={comment.is_spam ? "destructive" : comment.is_approved ? "default" : "secondary"}>
            {comment.is_spam ? "Spam" : comment.is_approved ? "Approved" : "Pending"}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-foreground">{comment.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(comment.created_at).toLocaleString()}
        </span>
        <div className="flex gap-2">
          {showActions && onApprove && (
            <Button size="sm" onClick={onApprove}>
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}
          {showActions && onSpam && (
            <Button size="sm" variant="outline" onClick={onSpam}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              Spam
            </Button>
          )}
          {!showActions && onApprove && (
            <Button size="sm" variant="outline" onClick={onApprove}>
              <Check className="w-4 h-4 mr-1" />
              Restore
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminModerationPage;
