import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";

const FloatingContactButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.8, width: 60 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-3 p-2 pl-5 bg-card border-2 border-primary/30 rounded-full shadow-glow"
              >
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  Let's work together!
                </span>
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 button-glow"
                  >
                    Contact Me
                  </Button>
                </Link>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-glow animate-pulse-glow"
              >
                <MessageCircle size={28} className="text-primary-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;