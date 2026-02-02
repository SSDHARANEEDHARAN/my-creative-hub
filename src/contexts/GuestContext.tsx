import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GuestInfo {
  name: string;
  email: string;
}

interface GuestContextType {
  guest: GuestInfo | null;
  isGuest: boolean;
  registerGuest: (name: string, email: string) => Promise<void>;
  clearGuest: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
};

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [guest, setGuest] = useState<GuestInfo | null>(null);

  useEffect(() => {
    // Load guest info from sessionStorage on mount
    const storedGuest = sessionStorage.getItem("guestInfo");
    if (storedGuest) {
      try {
        setGuest(JSON.parse(storedGuest));
      } catch {
        sessionStorage.removeItem("guestInfo");
      }
    }
  }, []);

  const registerGuest = async (name: string, email: string) => {
    const guestInfo = { name, email };
    
    // Save to database
    await supabase.from("guest_visitors").insert({
      name,
      email,
    });

    // Send welcome email to guest
    await supabase.functions.invoke("send-contact-email", {
      body: {
        type: "guest_welcome",
        name,
        email,
        subject: "Welcome to Tharaneetharan's Portfolio",
        message: `New guest visitor: ${name} (${email})`,
      },
    });

    // Store in session
    sessionStorage.setItem("guestInfo", JSON.stringify(guestInfo));
    setGuest(guestInfo);
  };

  const clearGuest = () => {
    sessionStorage.removeItem("guestInfo");
    setGuest(null);
  };

  return (
    <GuestContext.Provider
      value={{
        guest,
        isGuest: !!guest,
        registerGuest,
        clearGuest,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};
