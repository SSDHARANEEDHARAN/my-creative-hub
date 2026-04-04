import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Ban, Unlock, Loader2, Shield, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  status: string;
  created_at: string;
  roles: string[];
  lastLogin: string | null;
  lastLogout: string | null;
  activityCount: number;
}

const AdminDashboardPage = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "list" },
      });
      if (error) throw error;
      setUsers(data?.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (targetUserId: string, status: string) => {
    setActionLoading(targetUserId);
    try {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "update-status", targetUserId, status },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: "Success", description: `User status updated to ${status}.` });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update user.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case "restricted":
        return <Badge variant="destructive">Restricted</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingUsers = users.filter((u) => u.status === "pending");
  const approvedUsers = users.filter((u) => u.status === "approved");
  const restrictedUsers = users.filter((u) => u.status === "restricted");

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleString();
  };

  const renderUserTable = (userList: UserProfile[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Last Logout</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            userList.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-sm">{u.email || "—"}</TableCell>
                <TableCell>{u.display_name || "—"}</TableCell>
                <TableCell>{getStatusBadge(u.status)}</TableCell>
                <TableCell>
                  {u.roles.includes("admin") ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs">{formatDate(u.lastLogin)}</TableCell>
                <TableCell className="text-xs">{formatDate(u.lastLogout)}</TableCell>
                <TableCell className="text-xs">{formatDate(u.created_at)}</TableCell>
                <TableCell className="text-right">
                  {u.user_id === user?.id ? (
                    <span className="text-xs text-muted-foreground">You</span>
                  ) : (
                    <div className="flex gap-1 justify-end">
                      {u.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 hover:text-green-600 h-7 text-xs"
                            onClick={() => updateUserStatus(u.user_id, "approved")}
                            disabled={actionLoading === u.user_id}
                          >
                            {actionLoading === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive h-7 text-xs"
                            onClick={() => updateUserStatus(u.user_id, "restricted")}
                            disabled={actionLoading === u.user_id}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {u.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive h-7 text-xs"
                          onClick={() => updateUserStatus(u.user_id, "restricted")}
                          disabled={actionLoading === u.user_id}
                        >
                          {actionLoading === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3 mr-1" />}
                          Restrict
                        </Button>
                      )}
                      {u.status === "restricted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500 hover:text-green-600 h-7 text-xs"
                          onClick={() => updateUserStatus(u.user_id, "approved")}
                          disabled={actionLoading === u.user_id}
                        >
                          {actionLoading === u.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3 mr-1" />}
                          Unrestrict
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">Manage users, approvals, and activity tracking</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
                { label: "Pending", value: pendingUsers.length, icon: Clock, color: "text-yellow-500" },
                { label: "Approved", value: approvedUsers.length, icon: CheckCircle, color: "text-green-500" },
                { label: "Restricted", value: restrictedUsers.length, icon: Ban, color: "text-destructive" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{isLoading ? "—" : stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* User Tabs */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All ({users.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingUsers.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approvedUsers.length})</TabsTrigger>
                    <TabsTrigger value="restricted">Restricted ({restrictedUsers.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">{renderUserTable(users)}</TabsContent>
                  <TabsContent value="pending">{renderUserTable(pendingUsers)}</TabsContent>
                  <TabsContent value="approved">{renderUserTable(approvedUsers)}</TabsContent>
                  <TabsContent value="restricted">{renderUserTable(restrictedUsers)}</TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default AdminDashboardPage;
