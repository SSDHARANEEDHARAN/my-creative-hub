import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the popup or subscribed
    const hasSeenPopup = localStorage.getItem("newsletter_popup_seen");
    const hasSubscribed = localStorage.getItem("newsletter_subscribed");

    if (!hasSeenPopup && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("newsletter_popup_seen", "true");
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, source: "popup" });

      if (dbError && dbError.code !== "23505") {
        throw dbError;
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: { type: "newsletter", email },
      });

      if (emailError) throw emailError;

      localStorage.setItem("newsletter_subscribed", "true");
      toast({
        title: "Welcome aboard! 🎉",
        description: "You've successfully subscribed to our newsletter.",
      });
      setIsOpen(false);
    } catch (error: any) {
      if (error?.code === "23505") {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list!",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Subscription failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="relative bg-gradient-to-br from-background via-background to-primary/5 border border-primary/20 rounded-2xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Stay Updated!
                </h3>
                <p className="text-muted-foreground">
                  Get the latest insights on engineering, technology, and industry trends delivered to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/50 border-primary/20 focus:border-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
