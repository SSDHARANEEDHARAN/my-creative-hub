import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExplorationInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exploration: {
    id: string;
    title: string;
  };
}

const ExplorationInquiryModal = ({ isOpen, onClose, exploration }: ExplorationInquiryModalProps) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          type: "exploration_inquiry",
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: `Exploration inquiry: ${exploration.title}`,
          message: formData.message.trim(),
          explorationId: exploration.id,
          explorationTitle: exploration.title,
        },
      });

      if (error) throw error;

      toast({
        title: "Inquiry Sent",
        description: "Thanks for reaching out — you'll get a reply soon.",
      });

      setFormData({ name: "", email: "", message: "" });
      onClose();
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast({
        title: "Error Sending Inquiry",
        description: "Please try again or contact directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border-2 border-border w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b-2 border-border p-4 sm:p-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Exploration Inquiry
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-1">{exploration.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send a message and it goes straight to the owner's inbox.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close inquiry form"
            className="w-10 h-10 flex items-center justify-center border-2 border-border hover:bg-secondary hover:border-foreground transition-all shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inquiry-name" className="text-sm font-medium mb-2 block">
                Your Name <span className="text-foreground">*</span>
              </label>
              <Input
                id="inquiry-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                maxLength={100}
                className="input-sharp h-11"
              />
            </div>
            <div>
              <label htmlFor="inquiry-email" className="text-sm font-medium mb-2 block">
                Your Email <span className="text-foreground">*</span>
              </label>
              <Input
                id="inquiry-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                maxLength={255}
                className="input-sharp h-11"
              />
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-message" className="text-sm font-medium mb-2 block">
              Message <span className="text-foreground">*</span>
            </label>
            <Textarea
              id="inquiry-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={`Ask about ${exploration.title} — collaboration, details, availability...`}
              rows={5}
              required
              maxLength={5000}
              className="input-sharp resize-none"
            />
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                Send Inquiry <Send size={16} />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExplorationInquiryModal;
