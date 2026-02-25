import { useState } from "react";
import { Send, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Enter a valid email"),
});

const NewsletterSubscription = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const validation = subscriptionSchema.safeParse({ name: normalizedName, email: normalizedEmail });
    if (!validation.success) {
      toast({
        title: "Invalid Input",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: normalizedEmail, name: normalizedName, source: "footer" });

      if (dbError?.code === "23505") {
        localStorage.setItem("newsletter_subscribed", "true");
        setIsSubscribed(true);
        setName("");
        setEmail("");

        toast({
          title: "Already Subscribed",
          description: "You are already subscribed",
        });
        return;
      }

      if (dbError) throw dbError;

      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: normalizedName,
          email: normalizedEmail,
          subject: "Newsletter Subscription",
          message: "New newsletter subscription",
          type: "newsletter",
        },
      });

      if (emailError) {
        console.warn("Newsletter email warning:", emailError);
      }

      localStorage.setItem("newsletter_subscribed", "true");

      setIsSubscribed(true);
      setName("");
      setEmail("");

      toast({
        title: "Successfully Subscribed! 🎉",
        description: "You are subscribed successfully.",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong, try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-foreground">
        <Check className="w-5 h-5" />
        <span className="text-sm font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-background/50 border-border h-9 text-sm"
        disabled={isLoading}
        required
      />
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50 border-border h-9 text-sm flex-1"
          disabled={isLoading}
          required
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isLoading}
          className="h-9 px-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterSubscription;
