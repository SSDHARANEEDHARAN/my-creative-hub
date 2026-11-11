import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FunctionsHttpError } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ExplorationSection from "@/components/ExplorationSection";
import GalleryHobbyConnectors from "@/components/GalleryHobbyConnectors";
import { AquariumPrompt } from "@/components/ui/aquarium-prompt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { checkMessage } from "@/lib/messageFilter";
import { useNewPageNotice } from "@/hooks/useNewPageNotice";

const NewPage = () => {
  const { user } = useAuth();
  const notice = useNewPageNotice();
  const [name, setName] = useState((user?.user_metadata?.display_name as string) || "");
  const [email, setEmail] = useState(user?.email || "");
  const [draft, setDraft] = useState("");
  const [promptKey, setPromptKey] = useState(0);

  const send = async (text: string) => {
    const problem = checkMessage(text);
    if (problem) { toast({ variant: "destructive", description: problem }); setDraft(text); setPromptKey((k) => k + 1); return; }
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast({ variant: "destructive", description: "Please enter your name and a valid email first." }); return;
    }
    const { error } = await supabase.functions.invoke("send-contact-email", {
      body: { type: "mind_message", name: name.trim(), email: email.trim(), subject: "What's on your mind", message: text.trim() },
    });
    if (error) {
      let msg = "Couldn't send your message. Please try again.";
      if (error instanceof FunctionsHttpError) { try { msg = (await error.context.json()).error || msg; } catch { /* keep */ } }
      toast({ variant: "destructive", description: msg }); return;
    }
    toast({ description: "Thanks! Your thoughts were sent." });
  };

  return (
    <>
      <Helmet>
        <title>New | SS. Tharan - Live Explorations</title>
        <meta name="description" content="Ongoing live explorations, products being tested and new hobby builds." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <section className="container mx-auto px-4 sm:px-6 pt-10">
            <div role="status" className="flex gap-3 items-start border-2 border-foreground bg-secondary/40 p-4 sm:p-5">
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-destructive animate-pulse" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Notice</p>
                <h1 className="font-bold text-lg sm:text-xl text-foreground">{notice.title}</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1 whitespace-pre-line">{notice.message}</p>
              </div>
            </div>
          </section>

          <ExplorationSection />
          <GalleryHobbyConnectors />

          <section className="container mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-6">
            {user ? (
              <>
                <div className="grid w-full max-w-[880px] gap-3 sm:grid-cols-2">
                  <Input placeholder="Your name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} aria-label="Your name" />
                  <Input type="email" placeholder="Your email" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} aria-label="Your email" />
                </div>
                <AquariumPrompt key={promptKey} title="What's on your mind?" placeholder={draft ? draft.slice(0, 60) : "Drop your thoughts…"} onSubmit={send} />
                <p className="text-xs text-muted-foreground">Links and unwanted or suspicious messages are blocked.</p>
              </>
            ) : (
              <div className="w-full max-w-[880px] border-2 border-foreground p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">What's on your mind?</h2>
                <p className="text-muted-foreground mt-2">Please log in to drop your thoughts.</p>
                <Button asChild className="mt-4"><Link to="/login">Log in</Link></Button>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NewPage;
