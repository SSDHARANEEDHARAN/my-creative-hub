import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  userStatus: string | null;
  blockedIp: string | null;
  tempLockedIp: string | null;
  lockedAt: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const OWNER_ADMIN_EMAIL = "tharaneetharanss@gmail.com";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [blockedIp, setBlockedIp] = useState<string | null>(null);
  const [tempLockedIp, setTempLockedIp] = useState<string | null>(null);
  const [lockedAt, setLockedAt] = useState<string | null>(null);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  }, []);

  const checkUserStatus = useCallback(async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("status")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) return "pending";
      return data.status || "pending";
    } catch {
      return "pending";
    }
  }, []);

  const trackActivity = useCallback(async (userId: string, action: string) => {
    try {
      await supabase.from("user_activity").insert({
        user_id: userId,
        action,
      });
    } catch (err) {
      console.error("Failed to track activity:", err);
    }
  }, []);

  const syncUserRole = useCallback(async (currentUser: User) => {
    try {
      await supabase.functions.invoke("sync-user-role", {
        body: {
          email: currentUser.email?.toLowerCase() ?? "",
          adminEmail: OWNER_ADMIN_EMAIL,
        },
      });
    } catch (error) {
      console.error("Error syncing user role:", error);
    }
  }, []);

  const checkIpBlockStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "check-ip" },
      });

      if (!error && data) {
        if (data.blocked) {
          setBlockedIp(data.ip || "unknown");
        } else {
          setBlockedIp(null);
        }
        if (data.temp_locked) {
          setTempLockedIp(data.ip || "unknown");
          setLockedAt(data.locked_at || null);
        } else {
          setTempLockedIp(null);
          setLockedAt(null);
        }
      }
    } catch (error) {
      console.error("Error checking blocked IP status:", error);
    }
  }, []);

  const trackUserIp = useCallback(async (currentUser: User) => {
    try {
      await supabase.functions.invoke("manage-users", {
        body: { action: "track-ip" },
      });
    } catch (error) {
      console.error("Error tracking user IP:", error);
    }
  }, []);

  const loadUserAccess = useCallback(async (currentUser: User) => {
    const isOwnerAdmin = currentUser.email?.toLowerCase() === OWNER_ADMIN_EMAIL;

    if (isOwnerAdmin) {
      setIsAdmin(true);
      setUserStatus("approved");
    }

    await syncUserRole(currentUser).catch(console.error);

    const [adminStatus, status] = await Promise.all([
      checkAdminRole(currentUser.id),
      checkUserStatus(currentUser.id),
    ]);

    setIsAdmin(adminStatus || isOwnerAdmin);
    setUserStatus(adminStatus || isOwnerAdmin ? "approved" : status);
  }, [checkAdminRole, checkUserStatus, syncUserRole]);

  useEffect(() => {
    let isActive = true;

    const handleSession = (nextSession: Session | null) => {
      if (!isActive) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setUserStatus(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      void Promise.all([
        trackUserIp(nextSession.user).catch(console.error),
        loadUserAccess(nextSession.user).catch((error) => {
          console.error("Error loading user access:", error);

          if (!isActive) return;

          const isOwnerAdmin = nextSession.user.email?.toLowerCase() === OWNER_ADMIN_EMAIL;
          setIsAdmin(isOwnerAdmin);
          setUserStatus(isOwnerAdmin ? "approved" : "pending");
        }),
      ])
        .finally(() => {
          if (isActive) {
            setIsLoading(false);
          }
        });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        handleSession(nextSession);
      }
    );

    void supabase.auth.getSession()
      .then(({ data: { session: existingSession } }) => {
        handleSession(existingSession);
      })
      .catch((error) => {
        console.error("Error restoring session:", error);
        if (!isActive) return;
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setUserStatus(null);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [loadUserAccess, trackUserIp]);

  useEffect(() => {
    void checkIpBlockStatus();
  }, [checkIpBlockStatus]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      await trackActivity(data.user.id, "login");
      return { error: null };
    }

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (!error && data.user?.id) {
      try {
        await supabase.from("profiles").insert({
          user_id: data.user.id,
          email: data.user.email,
          status: "pending",
        });
      } catch (profileError) {
        console.error("Failed to create profile record for new signup:", profileError);
      }
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    const currentUser = user;

    setSession(null);
    setUser(null);
    setIsAdmin(false);
    setUserStatus(null);
    setIsLoading(false);

    try {
      if (currentUser) {
        await trackActivity(currentUser.id, "logout");
      }
    } catch (error) {
      console.error("Failed to track logout activity:", error);
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase sign out failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        userStatus,
        blockedIp,
        tempLockedIp,
        lockedAt,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
