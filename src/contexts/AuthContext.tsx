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

  const checkAdminRole = async (userId: string) => {
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
  };

  const checkUserStatus = async (userId: string): Promise<string> => {
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
  };

  const trackActivity = async (userId: string, action: string) => {
    try {
      await supabase.from("user_activity").insert({
        user_id: userId,
        action,
      });
    } catch (err) {
      console.error("Failed to track activity:", err);
    }
  };

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user) {
          // Set loading false immediately so UI is responsive
          // then do async role checks in background
          const adminStatus = await checkAdminRole(nextSession.user.id);
          setIsAdmin(adminStatus);
          const status = await checkUserStatus(nextSession.user.id);
          setUserStatus(adminStatus ? "approved" : status);

          // Sync role in background (don't block UI)
          syncUserRole(nextSession.user).catch(console.error);
        } else {
          setIsAdmin(false);
          setUserStatus(null);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (!existingSession?.user) {
        // No session — stop loading immediately
        setIsLoading(false);
        return;
      }

      // For logged-in users, check roles then stop loading
      const adminStatus = await checkAdminRole(existingSession.user.id);
      setIsAdmin(adminStatus);
      const status = await checkUserStatus(existingSession.user.id);
      setUserStatus(adminStatus ? "approved" : status);
      setIsLoading(false);

      // Sync role in background
      syncUserRole(existingSession.user).catch(console.error);
    });

    return () => subscription.unsubscribe();
  }, [syncUserRole]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      // Check status before allowing login
      const status = await checkUserStatus(data.user.id);
      const adminCheck = await checkAdminRole(data.user.id);

      if (!adminCheck && status === "pending") {
        await supabase.auth.signOut();
        return { error: new Error("Your account is pending approval. Please wait for admin to approve your access.") };
      }

      if (!adminCheck && status === "restricted") {
        await supabase.auth.signOut();
        return { error: new Error("Your account has been restricted. Please contact the administrator.") };
      }

      // Track login activity
      await trackActivity(data.user.id, "login");
    }

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
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
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
