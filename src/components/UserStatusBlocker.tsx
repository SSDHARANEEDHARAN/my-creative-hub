import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Shield, Ban, Mail } from "lucide-react";

const UserStatusBlocker = () => {
  const { user, userStatus, isLoading, blockedIp, tempLockedIp, lockedAt } = useAuth();

  if (isLoading) return null;

  // IP-based block — persists across logout/login
  if (blockedIp) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-red-600/30 rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Ban className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Your access has been blocked</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your access has been blocked. Contact: tharaneetharanss
          </p>
          <div className="px-4 py-3 bg-red-600/10 border border-red-600/20 rounded-lg text-sm mb-6">
            <p className="text-red-700 dark:text-red-400 font-medium mb-2">Blocked IP</p>
            <p className="text-muted-foreground text-xs break-all">{blockedIp}</p>
          </div>
          <a
            href="mailto:tharaneetharanss@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </motion.div>
      </div>
    );
  }

  // IP-based temp lock — 48 hour restriction
  if (tempLockedIp) {
    const lockedTime = lockedAt ? new Date(lockedAt) : null;
    const remainingMs = lockedTime ? (48 * 60 * 60 * 1000) - (Date.now() - lockedTime.getTime()) : 0;
    const remainingHrs = Math.max(0, Math.ceil(remainingMs / (60 * 60 * 1000)));

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-orange-500/30 rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Under Surveillance</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You are under surveillance. Wait {remainingHrs} hours to continue, or contact support.
          </p>
          <div className="px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm mb-6">
            <p className="text-orange-700 dark:text-orange-400 font-medium mb-2">
              ⏱️ Your access is currently paused
            </p>
            <p className="text-muted-foreground text-xs">
              IP: {tempLockedIp}
            </p>
          </div>
          <a
            href="mailto:tharaneetharanss@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </motion.div>
      </div>
    );
  }

  // Session-based statuses (for logged-in users)
  if (userStatus === "temporary_locked") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-orange-500/30 rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Under Surveillance</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            You are under surveillance. Wait 48 hours to continue, or contact support.
          </p>
          <a
            href="mailto:tharaneetharanss@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </motion.div>
      </div>
    );
  }

  if (userStatus === "blocked") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-red-600/30 rounded-xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Ban className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Account Blocked</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your account has been blocked. Contact administrator for assistance.
          </p>
          <a
            href="mailto:tharaneetharanss@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact TharaneeTharanss@gmail.com
          </a>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default UserStatusBlocker;
