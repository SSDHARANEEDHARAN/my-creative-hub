import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, ShieldCheck, Lock } from "lucide-react";

interface Certificate {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  image?: string;
}

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateModal = ({ certificate, isOpen, onClose }: CertificateModalProps) => {
  const [isProtected, setIsProtected] = useState(true);

  // Disable right-click, screenshot shortcuts, and developer tools
  useEffect(() => {
    if (!isOpen) return;

    const preventActions = (e: KeyboardEvent) => {
      // Prevent Print Screen, Ctrl+P, Ctrl+S, Ctrl+Shift+S, F12
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.shiftKey && e.key === "s") ||
        (e.ctrlKey && e.shiftKey && e.key === "i") ||
        e.key === "F12"
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect visibility change (potential screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsProtected(true);
      }
    };

    document.addEventListener("keydown", preventActions);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isOpen]);

  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
        onClick={onClose}
        style={{ userSelect: "none" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-card border-2 border-border sharp-card overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: "none" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">{certificate.name}</h3>
                <p className="text-sm text-muted-foreground">{certificate.issuer} • {certificate.year}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Display Area - Protected */}
          <div 
            className="relative p-8 min-h-[400px] flex items-center justify-center"
            style={{ 
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              pointerEvents: "auto"
            }}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            draggable={false}
          >
            {/* Watermark overlay */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 opacity-5"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 100px,
                  hsl(var(--foreground)) 100px,
                  hsl(var(--foreground)) 101px
                )`,
              }}
            />

            {/* Certificate Content */}
            {certificate.image ? (
              /* Display actual certificate image */
              <div 
                className="w-full max-w-2xl relative"
                style={{ 
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                }}
              >
                <img 
                  src={certificate.image}
                  alt={certificate.name}
                  className="w-full h-auto border-4 border-primary/20"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ 
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </div>
            ) : (
              /* Placeholder template when no image provided */
              <div 
                className="w-full max-w-2xl bg-gradient-to-br from-secondary via-card to-secondary border-4 border-primary/20 p-8 relative"
                style={{ 
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                }}
              >
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary/50" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary/50" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary/50" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary/50" />

                {/* Certificate Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold">Certificate of Achievement</span>
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Main Content */}
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">This is to certify that</p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Tharaneetharan SS
                  </h2>
                  <p className="text-muted-foreground">has successfully completed</p>
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-primary">
                    {certificate.name}
                  </h3>
                  <div className="pt-4 border-t border-border mt-6">
                    <p className="text-sm text-muted-foreground">Issued by</p>
                    <p className="font-semibold text-foreground">{certificate.issuer}</p>
                    <p className="text-sm text-muted-foreground mt-2">Year: {certificate.year}</p>
                    {certificate.credentialId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Credential ID: {certificate.credentialId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Seal */}
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}

            {/* Protection Notice */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border border-border">
              <Lock className="w-3 h-3" />
              <span>Protected • View Only</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CertificateModal;
