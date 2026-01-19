import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MailX, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

type UnsubscribeStatus = "loading" | "confirm" | "success" | "error" | "invalid";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<UnsubscribeStatus>("loading");
  const [email, setEmail] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        // Use edge function to verify token securely (avoids exposing subscriber data via RLS)
        const { data, error } = await supabase.functions.invoke('verify-token', {
          body: { token }
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          return;
        }

        if (!data?.valid) {
          setStatus("invalid");
          return;
        }

        if (!data.isActive) {
          setStatus("success");
          setEmail(data.email);
          return;
        }

        setEmail(data.email);
        setStatus("confirm");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('unsubscribe', {
        body: { token }
      });

      if (error) throw error;
      
      // Check if the function returned an error in the response
      if (data?.error) {
        throw new Error(data.error);
      }

      setStatus("success");
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your request...</p>
          </div>
        );

      case "confirm":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailX className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Unsubscribe from Newsletter
            </h1>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unsubscribe <strong>{email}</strong> from our newsletter?
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You will no longer receive updates about new projects, blog posts, and exclusive content.
            </p>
            <Button
              onClick={handleUnsubscribe}
              disabled={isProcessing}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, Unsubscribe Me"
              )}
            </Button>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Successfully Unsubscribed
            </h1>
            <p className="text-muted-foreground mb-6">
              <strong>{email}</strong> has been removed from our newsletter.
            </p>
            <p className="text-sm text-muted-foreground">
              We're sorry to see you go! If you change your mind, you can always subscribe again from our website.
            </p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Something Went Wrong
            </h1>
            <p className="text-muted-foreground">
              We couldn't process your unsubscribe request. Please try again later or contact us for assistance.
            </p>
          </div>
        );

      case "invalid":
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Invalid Unsubscribe Link
            </h1>
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has expired. Please use the link from your most recent email.
            </p>
          </div>
        );
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-8"
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default UnsubscribePage;
