import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BlogComment {
  id: string;
  name: string;
  content: string;
  created_at: string;
  reply: string | null;
  reply_date: string | null;
  is_approved: boolean | null;
}

interface BlogLike {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export const useBlogData = (postId: string) => {
  const [likes, setLikes] = useState<BlogLike[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  // Check if current user/guest has liked
  const checkUserLike = useCallback((likesData: BlogLike[], userEmail: string | null) => {
    if (!userEmail) return false;
    return likesData.some(like => like.email === userEmail);
  }, []);

  // Load likes and comments from database
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get guest email for like check
      const guestInfo = sessionStorage.getItem("guestInfo");
      const guestEmail = guestInfo ? JSON.parse(guestInfo).email : undefined;

      const [likesRes, commentsRes] = await Promise.all([
        supabase.functions.invoke('manage-blog-likes', {
          body: { action: "check", post_ids: [postId], email: guestEmail }
        }),
        supabase
          .from("blog_comments_public")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true }),
      ]);

      if (likesRes.data) {
        const count = likesRes.data.counts?.[postId] || 0;
        // Build minimal likes array for count
        setLikes(Array.from({ length: count }, (_, i) => ({ id: String(i), name: "", email: "", created_at: "" })));
        setHasLiked(likesRes.data.userLikedPosts?.includes(postId) || false);
      }

      if (commentsRes.data) {
        setComments(commentsRes.data);
      }
    } catch (error) {
      console.error("Failed to load blog data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addLike = async (name: string, email: string) => {
    if (hasLiked) {
      // Remove like via edge function
      const { error } = await supabase.functions.invoke('manage-blog-likes', {
        body: { action: "remove", post_id: postId, email }
      });

      if (!error) {
        setLikes(prev => prev.slice(0, -1));
        setHasLiked(false);
        toast({ description: "Removed from liked posts" });
      }
      return;
    }

    // Add new like via edge function
    const { data, error } = await supabase.functions.invoke('manage-blog-likes', {
      body: { action: "add", post_id: postId, name, email }
    });

    if (error || data?.error) {
      toast({
        title: "Error",
        description: data?.error || "Failed to like post",
        variant: "destructive",
      });
      return;
    }

    setLikes(prev => [...prev, { id: "new", name, email: "", created_at: "" }]);
    setHasLiked(true);
    toast({ description: "Added to liked posts!" });

    // Send notification to admin
    await supabase.functions.invoke("send-contact-email", {
      body: {
        type: "blog_like",
        name,
        email,
        subject: "New Blog Like",
        message: `Post ID: ${postId}`,
      },
    });
  };

  const addComment = async (name: string, email: string, content: string, honeypot?: string) => {
    // If honeypot has value, mark as spam
    const isSpam = !!honeypot;

    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        post_id: postId,
        name,
        email,
        content,
        is_spam: isSpam,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Comment submitted!",
      description: "Your comment is pending approval.",
    });

    // Send notification to admin
    if (!isSpam) {
      await supabase.functions.invoke("send-contact-email", {
        body: {
          type: "blog_comment",
          name,
          email,
          subject: `New Comment on Post ${postId}`,
          message: content,
          comment: content,
        },
      });
    }

    return true;
  };

  return {
    likes,
    comments,
    likeCount: likes.length,
    commentCount: comments.length,
    hasLiked,
    isLoading,
    addLike,
    addComment,
    refresh: loadData,
  };
};
