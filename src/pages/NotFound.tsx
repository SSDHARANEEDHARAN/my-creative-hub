import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [errorId] = useState(() => {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `route::${randomPart}-${timestamp}`;
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-warning" />
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-muted/50 px-6 py-4 border-b border-border">
            <h1 className="text-xl font-semibold text-foreground">
              <span className="text-warning">404</span>: NOT_FOUND
            </h1>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Code:
              </label>
              <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                <code>NOT_FOUND</code>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Path:
              </label>
              <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                <code>{location.pathname}</code>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                ID:
              </label>
              <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                <code>{errorId}</code>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => window.location.href = "/"}
              variant="default"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          The page you're looking for doesn't exist.{" "}
          <a
            href="/contact"
            className="text-primary hover:underline"
          >
            Contact support
          </a>{" "}
          if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
