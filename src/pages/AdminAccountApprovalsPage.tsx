import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, Loader2, Mail, MailCheck, UserPlus, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";
import AdminBackButton from "@/components/admin/AdminBackButton";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Account = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  status: string;
  created_at: string;
  emailConfirmedAt: string | null;
  invitedAt: string | null;
};

export default function AdminAccountApprovalsPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("manage-users", { body: { action: "list" } });
    if (error || data?.error) {
      toast({ title: "Could not load accounts", description: data?.error || error?.message, variant: "destructive" });
    } else {
      setAccounts(data.users || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("invite");
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "invite", email: email.trim(), displayName: displayName.trim() },
    });
    setBusy("");
    if (error || data?.error) {
      toast({ title: "Invitation not sent", description: data?.error || error?.message || "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Invitation sent", description: `${data.email} can confirm their email and set a password.` });
    setEmail("");
    setDisplayName("");
    await load();
  };

  const approve = async (account: Account) => {
    setBusy(account.user_id);
    const { data, error } = await supabase.functions.invoke("manage-users", {
      body: { action: "update-status", targetUserId: account.user_id, status: "approved" },
    });
    setBusy("");
    if (error || data?.error) {
      toast({ title: "Approval failed", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account approved", description: account.email || "The user can now sign in." });
    setAccounts((current) => current.map((item) => item.user_id === account.user_id ? { ...item, status: "approved" } : item));
  };

  const visible = useMemo(() => accounts
    .filter((account) => `${account.email || ""} ${account.display_name || ""}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(a.status === "approved") - Number(b.status === "approved")), [accounts, search]);
  const pending = accounts.filter((account) => account.status === "pending").length;
  const confirmed = accounts.filter((account) => account.emailConfirmedAt).length;

  return <PageTransition>
    <main className="container mx-auto min-h-screen max-w-7xl px-4 pb-16 pt-24 sm:px-6">
      <Helmet><title>User approvals | Admin</title><meta name="description" content="Invite users, confirm their email status and approve account access." /></Helmet>
      <div className="mb-6 flex justify-end"><AdminBackButton /></div>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 font-display text-3xl font-semibold"><Users className="h-7 w-7" /> User approvals</h1>
        <p className="mt-2 text-muted-foreground">Create an account invitation, track email confirmation and approve access from one place.</p>
      </div>

      <section aria-labelledby="invite-heading" className="mb-8 border border-border bg-card p-5 sm:p-6">
        <h2 id="invite-heading" className="flex items-center gap-2 font-display text-xl font-semibold"><UserPlus className="h-5 w-5" /> Invite a new user</h2>
        <p className="mt-1 text-sm text-muted-foreground">They receive an email confirmation link and choose their own password.</p>
        <form onSubmit={invite} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2"><Label htmlFor="invite-name">Name (optional)</Label><Input id="invite-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={100} placeholder="User name" /></div>
          <div className="space-y-2"><Label htmlFor="invite-email">Email</Label><Input id="invite-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" /></div>
          <Button type="submit" disabled={busy === "invite"}>{busy === "invite" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />} Send invitation</Button>
        </form>
      </section>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="border border-border p-4"><p className="text-sm text-muted-foreground">Total accounts</p><p className="mt-1 font-display text-2xl font-semibold">{accounts.length}</p></div>
        <div className="border border-border p-4"><p className="text-sm text-muted-foreground">Awaiting approval</p><p className="mt-1 font-display text-2xl font-semibold">{pending}</p></div>
        <div className="border border-border p-4"><p className="text-sm text-muted-foreground">Email confirmed</p><p className="mt-1 font-display text-2xl font-semibold">{confirmed}</p></div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Accounts</h2>
        <Input aria-label="Search accounts" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email…" className="w-full sm:max-w-xs" />
      </div>
      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Email confirmation</TableHead><TableHead>Account status</TableHead><TableHead>Invited / joined</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></TableCell></TableRow> : visible.length === 0 ? <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No accounts found.</TableCell></TableRow> : visible.map((account) => <TableRow key={account.user_id}>
              <TableCell><div className="font-medium">{account.display_name || "—"}</div><div className="text-sm text-muted-foreground">{account.email}</div></TableCell>
              <TableCell>{account.emailConfirmedAt ? <Badge className="bg-primary/10 text-primary border-primary/20"><MailCheck className="mr-1 h-3 w-3" /> Confirmed</Badge> : <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>}</TableCell>
              <TableCell><Badge variant={account.status === "approved" ? "default" : "secondary"}>{account.status}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(account.invitedAt || account.created_at).toLocaleString()}</TableCell>
              <TableCell className="text-right">{account.status === "approved" ? <span className="inline-flex items-center text-sm text-muted-foreground"><CheckCircle className="mr-1 h-4 w-4" /> Approved</span> : <Button size="sm" onClick={() => void approve(account)} disabled={busy === account.user_id}>{busy === account.user_id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />} Approve</Button>}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </main>
  </PageTransition>;
}
