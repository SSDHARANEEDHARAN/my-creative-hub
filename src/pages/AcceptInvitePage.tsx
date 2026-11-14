import { useState } from "react";
import { CheckCircle, Loader2, Lock, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function AcceptInvitePage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);

  const setAccountPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmation) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({ title: "Could not set password", description: error.message, variant: "destructive" });
      return;
    }
    setComplete(true);
    toast({ title: "Email confirmed", description: "Your password is set. An administrator can now approve your account." });
  };

  return <PageTransition>
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-28">
      <Helmet><title>Accept your invitation | SS. Tharan</title><meta name="description" content="Confirm your invitation and choose your account password." /></Helmet>
      <section className="w-full border border-border bg-card p-6 sm:p-8">
        {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div> : complete ? <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-10 w-10" />
          <h1 className="font-display text-2xl font-semibold">Invitation accepted</h1>
          <p className="mt-3 text-muted-foreground">Your email is confirmed and your password is ready. Your account remains pending until an administrator approves it.</p>
          <Button asChild className="mt-6"><Link to="/new">Continue</Link></Button>
        </div> : user ? <>
          <MailCheck className="mb-4 h-9 w-9" />
          <h1 className="font-display text-2xl font-semibold">Confirm your invitation</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}. Choose a password to finish confirming your account.</p>
          <form onSubmit={setAccountPassword} className="mt-6 space-y-5">
            <div className="space-y-2"><Label htmlFor="invite-password">New password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="invite-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="pl-10" /></div></div>
            <div className="space-y-2"><Label htmlFor="invite-password-confirmation">Confirm password</Label><Input id="invite-password-confirmation" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm email & set password</Button>
          </form>
        </> : <div className="text-center">
          <h1 className="font-display text-2xl font-semibold">Invitation link required</h1>
          <p className="mt-3 text-muted-foreground">Open the confirmation link from your invitation email. If it expired, ask the administrator for a new invitation.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/login">Back to sign in</Link></Button>
        </div>}
      </section>
    </main>
  </PageTransition>;
}
