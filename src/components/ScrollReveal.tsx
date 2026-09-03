import { ReactNode, forwardRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(({ 
  children, 
  className, 
  delay = 0,
  direction = "up" 
}, forwardedRef) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getTransform = () => {
    switch (direction) {
      case "up": return "translateY(20px)";
      case "down": return "translateY(-20px)";
      case "left": return "translateX(20px)";
      case "right": return "translateX(-20px)";
      case "fade": return "translateY(0)";
      default: return "translateY(20px)";
    }
  };

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }}
      className={cn("transition-all duration-500 ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) translateX(0)" : getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
});

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;