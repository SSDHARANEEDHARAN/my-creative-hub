import { useState, useEffect, useCallback, useRef } from "react";
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

export const useBlogData = (postId: string, userEmail: string | null, userName: string | null) => {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const viewTracked = useRef(false);

  // Load public counts (no auth needed)
  const loadPublicCounts = useCallback(async () => {
    if (!postId) return;
    try {
      const [likesRes, commentsRes, viewsRes] = await Promise.all([
        supabase.functions.invoke("manage-blog-likes", {
          body: { action: "count", post_ids: [postId] },
        }),
        supabase
          .from("blog_comments_public")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true }),
        supabase
          .from("blog_view_counts")
          .select("*")
          .eq("post_id", postId)
          .maybeSingle(),
      ]);

      if (likesRes.data?.counts) {
        setLikeCount(likesRes.data.counts[postId] || 0);
      }
      if (commentsRes.data) {
        setComments(commentsRes.data as BlogComment[]);
      }
      if (viewsRes.data) {
        setViewCount(viewsRes.data.view_count || 0);
      }
    } catch (error) {
      console.error("Failed to load public counts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Check user-specific like state (needs email)
  const checkUserLikeState = useCallback(async () => {
    if (!postId || !userEmail) {
      setHasLiked(false);
      return;
    }
    try {
      const { data } = await supabase.functions.invoke("manage-blog-likes", {
        body: { action: "check", post_ids: [postId], email: userEmail },
      });
      if (data?.userLikedPosts) {
        setHasLiked(data.userLikedPosts.includes(postId));
      }
    } catch (error) {
      console.error("Failed to check user like state:", error);
    }
  }, [postId, userEmail]);

  // Track view once per user (unique views only)
  useEffect(() => {
    if (!postId || viewTracked.current) return;
    
    const trackView = async () => {
      // For logged-in users, check if they already viewed
      if (userEmail) {
        const { data: existingView } = await supabase
          .from("blog_views")
          .select("id")
          .eq("post_id", postId)
          .eq("viewer_email", userEmail)
          .maybeSingle();
        
        if (existingView) {
          viewTracked.current = true;
          return; // Already viewed by this user
        }
      } else {
        // For anonymous users, use sessionStorage
        const viewKey = `blog_viewed_${postId}`;
        if (sessionStorage.getItem(viewKey)) {
          viewTracked.current = true;
          return;
        }
        sessionStorage.setItem(viewKey, "1");
      }
      
      try {
        await supabase.from("blog_views").insert({
          post_id: postId,
          viewer_email: userEmail || null,
          viewer_name: userName || null,
        });
        viewTracked.current = true;
        setViewCount((c) => c + 1);
      } catch (e) {
        console.error("Failed to track view:", e);
      }
    };
    trackView();
  }, [postId, userEmail, userName]);

  // Load public counts on mount
  useEffect(() => {
    loadPublicCounts();
  }, [loadPublicCounts]);

  // Re-check user like state when email becomes available
  useEffect(() => {
    checkUserLikeState();
  }, [checkUserLikeState]);

  const addLike = async (name: string, email: string) => {
    if (!postId) return;

    if (hasLiked) {
      const { error } = await supabase.functions.invoke("manage-blog-likes", {
        body: { action: "remove", post_id: postId, email },
      });
      if (!error) {
        setHasLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
        toast({ description: "Removed from liked posts" });
      }
      return;
    }

    const { data, error } = await supabase.functions.invoke("manage-blog-likes", {
      body: { action: "add", post_id: postId, name, email },
    });

    if (error || data?.error) {
      toast({
        title: "Error",
        description: data?.error || "Failed to like post",
        variant: "destructive",
      });
      return;
    }

    setHasLiked(true);
    setLikeCount((c) => c + 1);
    toast({ description: "Added to liked posts!" });
  };

  const addComment = async (name: string, email: string, content: string, honeypot?: string) => {
    if (!postId) return false;
    const isSpam = !!honeypot;

    const { error } = await supabase
      .from("blog_comments")
      .insert({
        post_id: postId,
        name,
        email,
        content,
        is_spam: isSpam,
        is_approved: false,
      });

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

    // Refresh comments
    loadPublicCounts();
    return true;
  };

  return {
    likeCount,
    comments,
    commentCount: comments.length,
    viewCount,
    hasLiked,
    isLoading,
    addLike,
    addComment,
    refresh: loadPublicCounts,
  };
};

// Hook for batch loading counts across multiple posts (for list pages)
export const useBlogListCounts = (postIds: string[], userEmail: string | null) => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  const loadCounts = useCallback(async () => {
    if (!postIds.length) return;
    try {
      const [likesRes, commentsRes, viewsRes] = await Promise.all([
        supabase.functions.invoke("manage-blog-likes", {
          body: { action: "count", post_ids: postIds },
        }),
        supabase.from("blog_comments_public").select("post_id").in("post_id", postIds),
        supabase.from("blog_view_counts").select("*").in("post_id", postIds),
      ]);

      if (likesRes.data?.counts) {
        setLikeCounts(likesRes.data.counts);
      }

      if (commentsRes.data) {
        const cc: Record<string, number> = {};
        commentsRes.data.forEach((c: { post_id: string }) => {
          cc[c.post_id] = (cc[c.post_id] || 0) + 1;
        });
        setCommentCounts(cc);
      }

      if (viewsRes.data) {
        const vc: Record<string, number> = {};
        viewsRes.data.forEach((v: { post_id: string; view_count: number }) => {
          vc[v.post_id] = v.view_count;
        });
        setViewCounts(vc);
      }
    } catch (error) {
      console.error("Failed to load counts:", error);
    }
  }, [postIds.join(",")]);

  // Check user-specific likes separately
  const checkUserLikes = useCallback(async () => {
    if (!postIds.length || !userEmail) {
      setUserLikes(new Set());
      return;
    }
    try {
      const { data } = await supabase.functions.invoke("manage-blog-likes", {
        body: { action: "check", post_ids: postIds, email: userEmail },
      });
      if (data?.userLikedPosts) {
        setUserLikes(new Set(data.userLikedPosts));
      }
    } catch (error) {
      console.error("Failed to check user likes:", error);
    }
  }, [postIds.join(","), userEmail]);

  useEffect(() => { loadCounts(); }, [loadCounts]);
  useEffect(() => { checkUserLikes(); }, [checkUserLikes]);

  return { likeCounts, commentCounts, viewCounts, userLikes, setUserLikes, setLikeCounts, refresh: loadCounts };
};
