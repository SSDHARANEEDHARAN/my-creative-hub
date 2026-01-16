import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Users, Mail, Calendar, Search, RefreshCw, LogOut, Bell, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string | null;
}

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyDescription, setNotifyDescription] = useState("");
  const [notifyType, setNotifyType] = useState<"post" | "project">("post");
  const [notifyUrl, setNotifyUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (error) {
      toast({
        title: "Error fetching subscribers",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const filtered = subscribers.filter((sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers]);

  const exportToCSV = () => {
    const headers = ["Email", "Subscribed At", "Source", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredSubscribers.map((sub) =>
        [
          sub.email,
          new Date(sub.subscribed_at).toLocaleDateString(),
          sub.source || "unknown",
          sub.is_active ? "Active" : "Inactive",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `${filteredSubscribers.length} subscribers exported to CSV.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const sendNotification = async () => {
    if (!notifyTitle.trim() || !notifyDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("notify-subscribers", {
        body: {
          title: notifyTitle,
          description: notifyDescription,
          type: notifyType,
          url: notifyUrl || undefined,
        },
      });

      if (error) throw error;

      toast({
        title: "Notifications Sent!",
        description: `Successfully notified ${data.sent} of ${data.total} subscribers.`,
      });

      setNotifyOpen(false);
      setNotifyTitle("");
      setNotifyDescription("");
      setNotifyUrl("");
    } catch (error) {
      console.error("Notification error:", error);
      toast({
        title: "Failed to send notifications",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const activeSubscribers = subscribers.filter((s) => s.is_active);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Newsletter Subscribers
                </h1>
                <p className="text-muted-foreground">
                  Manage and export your newsletter subscriber list.
                </p>
                {user && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Logged in as: {user.email}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Subscribers</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscribers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeSubscribers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unsubscribed</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscribers.filter((s) => !s.is_active).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">
                      {
                        subscribers.filter((s) => {
                          const subDate = new Date(s.subscribed_at);
                          const now = new Date();
                          return (
                            subDate.getMonth() === now.getMonth() &&
                            subDate.getFullYear() === now.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={fetchSubscribers}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={exportToCSV} disabled={filteredSubscribers.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" disabled={activeSubscribers.length === 0}>
                      <Bell className="w-4 h-4 mr-2" />
                      Notify All
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogDescription>
                        Send an email notification to all {activeSubscribers.length} active subscribers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="notifyType">Type</Label>
                        <Select value={notifyType} onValueChange={(v) => setNotifyType(v as "post" | "project")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="post">New Blog Post</SelectItem>
                            <SelectItem value="project">New Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notifyTitle">Title</Label>
                        <Input
                          id="notifyTitle"
                          placeholder="Enter title..."
                          value={notifyTitle}
                          onChange={(e) => setNotifyTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notifyDescription">Description</Label>
                        <Textarea
                          id="notifyDescription"
                          placeholder="Enter a short description..."
                          value={notifyDescription}
                          onChange={(e) => setNotifyDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notifyUrl">Link URL (optional)</Label>
                        <Input
                          id="notifyUrl"
                          type="url"
                          placeholder="https://..."
                          value={notifyUrl}
                          onChange={(e) => setNotifyUrl(e.target.value)}
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={sendNotification}
                        disabled={isSending || !notifyTitle.trim() || !notifyDescription.trim()}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send to {activeSubscribers.length} Subscribers
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Subscribers Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {isLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading subscribers...</p>
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    No subscribers found
                  </p>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try a different search term."
                      : "Subscribers will appear here once they sign up."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">
                          {subscriber.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(subscriber.subscribed_at)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {subscriber.source || "unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={subscriber.is_active ? "default" : "secondary"}
                            className={
                              subscriber.is_active
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                : "bg-red-500/10 text-red-500"
                            }
                          >
                            {subscriber.is_active ? "Active" : "Unsubscribed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </motion.div>

            {/* Results count */}
            {!isLoading && filteredSubscribers.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default SubscribersPage;
