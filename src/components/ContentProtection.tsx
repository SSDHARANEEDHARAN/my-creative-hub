import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Mail, X } from "lucide-react";

const ContentProtection = () => {
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  const showWarning = useCallback(() => {
    setShowPermissionDialog(true);
  }, []);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning();
    };

    // Disable common keyboard shortcuts for inspect/save/screenshot
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === "F12") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+Shift+I / Cmd+Option+I - Inspect
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+Shift+J / Cmd+Option+J - Console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+U / Cmd+U - View Source
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+S / Cmd+S - Save page
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        showWarning();
        return;
      }
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+P / Cmd+P - Print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        showWarning();
        return;
      }
      // Ctrl+Shift+C - Inspect element
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        showWarning();
        return;
      }
    };

    // Disable drag on images and videos
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "VIDEO") {
        e.preventDefault();
        showWarning();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Disable image/video selection
    const style = document.createElement("style");
    style.id = "content-protection-styles";
    style.textContent = `
      img, video {
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        pointer-events: auto !important;
      }
      img {
        -webkit-user-drag: none !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      const el = document.getElementById("content-protection-styles");
      if (el) el.remove();
    };
  }, [showWarning]);

  return (
    <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
      <DialogContent className="sm:max-w-md border-destructive/30 bg-background">
        <DialogHeader className="text-center items-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Content Protected
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-2 leading-relaxed">
            This content is protected. Downloading, copying, or taking screenshots is not permitted without prior authorization.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mt-2 text-center">
          <p className="text-sm font-medium text-foreground mb-1">
            To request permission, please contact:
          </p>
          <a
            href="mailto:tharaneetharanss@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
          >
            <Mail className="w-4 h-4" />
            tharaneetharanss@gmail.com
          </a>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setShowPermissionDialog(false)}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentProtection;
