import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type View = "login" | "forgot-email" | "forgot-otp" | "forgot-reset";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const stateReturnPath = (location.state as { returnPath?: string } | null)?.returnPath;
  const queryReturnPath = new URLSearchParams(location.search).get("returnTo");
  const returnPath = stateReturnPath || queryReturnPath || "/services";

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate(returnPath, { replace: true });
    }
  }, [isAuthLoading, user, navigate, returnPath]);


  // Forgot passkey state
  const [view, setView] = useState<View>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({ title: "Validation Error", description: validation.error.errors[0].message, variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You have successfully logged in." });
        navigate(returnPath);
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(returnPath);
    } catch (error) {
      toast({ 
        title: "Login Failed", 
        description: error instanceof Error ? error.message : "Failed to sign in with Google", 
        variant: "destructive" 
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple(returnPath);
    } catch (error) {
      toast({ 
        title: "Login Failed", 
        description: error instanceof Error ? error.message : "Failed to sign in with Apple", 
        variant: "destructive" 
      });
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!z.string().email().safeParse(forgotEmail).success) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsSendingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { email: forgotEmail.trim() },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "OTP Sent!", description: "Check your email for the 6-digit code." });
        setView("forgot-otp");
      }
    } catch {
      toast({ title: "Error", description: "Failed to send OTP. Please try again.", variant: "destructive" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the full 6-digit code.", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp-reset", {
        body: { email: forgotEmail.trim(), otp, action: "verify" },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Invalid OTP", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "OTP Verified!", description: "Now set your new password." });
        setView("forgot-reset");
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify OTP.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp-reset", {
        body: { email: forgotEmail.trim(), otp, newPassword, action: "reset" },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      } else {
        toast({ title: "Password Reset!", description: "You can now sign in with your new password." });
        setView("login");
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      toast({ title: "Error", description: "Failed to reset password.", variant: "destructive" });
    } finally {
      setIsResetting(false);
    }
  };

  const goBack = () => {
    if (view === "forgot-otp") setView("forgot-email");
    else if (view === "forgot-reset") setView("forgot-otp");
    else { setView("login"); setForgotEmail(""); setOtp(""); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
            <AnimatePresence mode="wait">
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card border border-border rounded-xl p-8"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
                    <p className="text-muted-foreground mt-2">Access your account</p>
                  </div>


                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" disabled={isLoading} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Passkey</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" disabled={isLoading} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : "Sign In with Email"}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <button onClick={() => setView("forgot-email")} className="text-sm text-primary hover:underline">
                      Forgot Passkey?
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Enter Email */}
              {view === "forgot-email" && (
                <motion.div
                  key="forgot-email"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="bg-card border border-border rounded-xl p-8"
                >
                  <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </button>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Forgot Passkey</h2>
                    <p className="text-muted-foreground mt-2">Enter your email to receive an OTP</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pl-10" disabled={isSendingOtp} />
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleSendOtp} disabled={isSendingOtp}>
                      {isSendingOtp ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending OTP...</> : "Send OTP"}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Verify OTP */}
              {view === "forgot-otp" && (
                <motion.div
                  key="forgot-otp"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="bg-card border border-border rounded-xl p-8"
                >
                  <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Enter OTP</h2>
                    <p className="text-muted-foreground mt-2">
                      We sent a 6-digit code to <span className="font-medium text-foreground">{forgotEmail}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-6">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button className="w-full" onClick={handleVerifyOtp} disabled={isVerifying || otp.length !== 6}>
                      {isVerifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify OTP"}
                    </Button>
                    <button onClick={() => { setOtp(""); handleSendOtp(); }} className="text-sm text-primary hover:underline" disabled={isSendingOtp}>
                      Resend OTP
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {view === "forgot-reset" && (
                <motion.div
                  key="forgot-reset"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="bg-card border border-border rounded-xl p-8"
                >
                  <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Set New Passkey</h2>
                    <p className="text-muted-foreground mt-2">Choose a strong new password</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Passkey</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="new-password" type={showNewPassword ? "text" : "password"} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Passkey</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleResetPassword} disabled={isResetting}>
                      {isResetting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Resetting...</> : "Reset Passkey"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LoginPage;
