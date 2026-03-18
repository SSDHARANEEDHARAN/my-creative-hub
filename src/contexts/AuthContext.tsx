import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signInWithApple: (returnPath?: string) => Promise<void>;
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user) {
          await syncUserRole(nextSession.user);
          const adminStatus = await checkAdminRole(nextSession.user.id);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        await syncUserRole(existingSession.user);
        const adminStatus = await checkAdminRole(existingSession.user.id);
        setIsAdmin(adminStatus);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [syncUserRole]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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

  const signInWithGoogle = async (returnPath: string = "/services") => {
    localStorage.setItem("authReturnTo", returnPath);
    const oauthRedirectUri = `${window.location.origin}/auth/callback`;
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: oauthRedirectUri,
      });
      if (result?.error) throw result.error;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const signInWithApple = async (returnPath: string = "/services") => {
    localStorage.setItem("authReturnTo", returnPath);
    const oauthRedirectUri = `${window.location.origin}/auth/callback`;
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: oauthRedirectUri,
      });
      if (result?.error) throw result.error;
    } catch (error) {
      console.error("Apple login failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
