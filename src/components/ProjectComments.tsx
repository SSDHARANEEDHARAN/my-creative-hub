import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Heart, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import GuestAccessModal from "./GuestAccessModal";

const SUGGESTION_COMMENTS = ["Nice 👍", "Congratulations 🎉", "Great work! 🔥", "Impressive 💯"];

// Basic 18+ content filter
const BLOCKED_WORDS = [
  "fuck", "shit", "ass", "bitch", "damn", "dick", "pussy", "cock", "bastard",
  "whore", "slut", "cunt", "porn", "xxx", "nude", "naked", "sex",
];

const containsBlockedContent = (text: string): boolean => {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((w) => lower.includes(w));
};

interface Comment {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

interface ProjectCommentsProps {
  projectId: string;
  compact?: boolean;
}

const ProjectComments = ({ projectId, compact = false }: ProjectCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [customComment, setCustomComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);

  const { user } = useAuth();
  const { guest } = useGuest();
  const currentUserEmail = user?.email || guest?.email || null;
  const currentUserName = user?.email?.split("@")[0] || guest?.name || null;

  const loadComments = useCallback(async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from("project_comments_public")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (data) {
      setComments(data as Comment[]);
      setCommentCount(data.length);
    }
  }, [projectId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const submitComment = async (content: string) => {
    if (!currentUserEmail || !currentUserName) {
      setShowAccessModal(true);
      return;
    }
    if (containsBlockedContent(content)) {
      toast({ title: "Comment blocked", description: "Inappropriate content is not allowed.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from("project_comments").insert({
      project_id: projectId,
      name: currentUserName,
      email: currentUserEmail,
      content,
      is_approved: true, // Auto-approve suggestion comments
    });
    if (!error) {
      toast({ description: "Comment posted!" });
      setCustomComment("");
      loadComments();
    } else {
      toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageSquare size={12} /> {commentCount}
        </button>
        {showComments && (
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-card border border-border rounded-lg shadow-xl p-3 space-y-2">
            <CommentList comments={comments} />
            <SuggestionButtons onSelect={submitComment} disabled={isSubmitting} />
            <CustomInput
              value={customComment}
              onChange={setCustomComment}
              onSubmit={() => submitComment(customComment)}
              disabled={isSubmitting}
            />
          </div>
        )}
        <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
      </>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare size={16} />
        {commentCount} Comments
      </button>

      {showComments && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Leave a comment</h4>
          <SuggestionButtons onSelect={submitComment} disabled={isSubmitting} />
          <CustomInput
            value={customComment}
            onChange={setCustomComment}
            onSubmit={() => submitComment(customComment)}
            disabled={isSubmitting}
          />
          <CommentList comments={comments} />
        </div>
      )}
      <GuestAccessModal isOpen={showAccessModal} onClose={() => setShowAccessModal(false)} />
    </div>
  );
};

const SuggestionButtons = ({ onSelect, disabled }: { onSelect: (c: string) => void; disabled: boolean }) => (
  <div className="flex flex-wrap gap-1.5">
    {SUGGESTION_COMMENTS.map((s) => (
      <button
        key={s}
        onClick={() => onSelect(s)}
        disabled={disabled}
        className="px-2.5 py-1 text-xs bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors rounded-full disabled:opacity-50"
      >
        {s}
      </button>
    ))}
  </div>
);

const CustomInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) => (
  <div className="flex gap-2">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write a comment..."
      maxLength={200}
      className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      onKeyDown={(e) => {
        if (e.key === "Enter" && value.trim()) onSubmit();
      }}
    />
    <Button
      size="sm"
      variant="default"
      onClick={onSubmit}
      disabled={disabled || !value.trim()}
      className="h-7 px-2"
    >
      <Send size={12} />
    </Button>
  </div>
);

const CommentList = ({ comments }: { comments: Comment[] }) => {
  if (comments.length === 0) {
    return <p className="text-xs text-muted-foreground py-2">No comments yet. Be the first!</p>;
  }
  return (
    <div className="max-h-40 overflow-y-auto space-y-2">
      {comments.slice(0, 20).map((c) => (
        <div key={c.id} className="flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{c.name[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-medium text-foreground">{c.name}</span>
            <p className="text-xs text-muted-foreground">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectComments;
