import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BlogComment {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  reply: string | null;
  reply_date: string | null;
  is_approved: boolean;
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
      const [likesRes, commentsRes] = await Promise.all([
        supabase
          .from("blog_likes")
          .select("*")
          .eq("post_id", postId),
        supabase
          .from("blog_comments")
          .select("*")
          .eq("post_id", postId)
          .eq("is_approved", true)
          .eq("is_spam", false)
          .order("created_at", { ascending: true }),
      ]);

      if (likesRes.data) {
        setLikes(likesRes.data);
        // Check if current guest has liked from sessionStorage
        const guestInfo = sessionStorage.getItem("guestInfo");
        if (guestInfo) {
          const { email } = JSON.parse(guestInfo);
          setHasLiked(checkUserLike(likesRes.data, email));
        }
      }

      if (commentsRes.data) {
        setComments(commentsRes.data);
      }
    } catch (error) {
      console.error("Failed to load blog data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, checkUserLike]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addLike = async (name: string, email: string) => {
    // Check if already liked
    const existingLike = likes.find(l => l.email === email);
    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from("blog_likes")
        .delete()
        .eq("id", existingLike.id);

      if (!error) {
        setLikes(prev => prev.filter(l => l.id !== existingLike.id));
        setHasLiked(false);
        toast({ description: "Removed from liked posts" });
      }
      return;
    }

    // Add new like
    const { data, error } = await supabase
      .from("blog_likes")
      .insert({
        post_id: postId,
        name,
        email,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setLikes(prev => [...prev, data]);
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
    }
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
