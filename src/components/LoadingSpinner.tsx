import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-mesh">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Animated logo/spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-muted border-t-primary"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-4 border-muted border-b-secondary"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </motion.div>
        </div>
        
        {/* Loading text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted-foreground font-medium"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;