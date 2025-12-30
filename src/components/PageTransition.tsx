import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        },
      }}
      exit={{ 
        opacity: 0, 
        y: -20, 
        scale: 0.98,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 1, 1] as [number, number, number, number],
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;