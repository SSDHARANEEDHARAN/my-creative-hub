import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Modern geometric loader */}
        <div className="relative w-24 h-24">
          {/* Outer square */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-primary"
          />
          
          {/* Middle square */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 border-2 border-muted-foreground"
          />
          
          {/* Inner square */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 border-2 border-primary"
          />
          
          {/* Center dot */}
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-foreground" />
          </motion.div>
        </div>
        
        {/* Loading text with typewriter effect */}
        <div className="flex items-center gap-1">
          <motion.span
            className="text-foreground font-display font-semibold tracking-widest uppercase text-sm"
          >
            Loading
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-foreground"
          >
            ...
          </motion.span>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-0.5 bg-muted overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full bg-foreground"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;