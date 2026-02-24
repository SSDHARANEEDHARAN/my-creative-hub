import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import legoImage from "@/assets/lego-error.png";

const NotFound = () => {
  const location = useLocation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Lego Illustration */}
        <div className="mb-6">
          <img
            src={legoImage}
            alt="Page not found - Lego characters with disconnected plug"
            className="mx-auto max-w-full h-auto max-h-72 object-contain rounded-xl"
          />
        </div>

        {/* Friendly heading */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          <span className="text-warning">Oops!</span> Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6 text-lg">
          Looks like this page got disconnected. Let's get you back on track!
        </p>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button onClick={handleGoBack} variant="outline" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="default" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Collapsible error details */}
        <details className="text-left bg-card border border-border rounded-lg overflow-hidden">
          <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/50">
            Error Details
          </summary>
          <div className="p-5 space-y-3">
            <ErrorDetailRow label="Code" value="NOT_FOUND" field="code" copiedField={copiedField} onCopy={copyToClipboard} />
            <ErrorDetailRow label="Path" value={location.pathname} field="path" copiedField={copiedField} onCopy={copyToClipboard} />
            <ErrorDetailRow label="ID" value={errorId} field="id" copiedField={copiedField} onCopy={copyToClipboard} />
          </div>
        </details>

        <p className="text-sm text-muted-foreground mt-6">
          Think this is an error?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

const ErrorDetailRow = ({
  label,
  value,
  field,
  copiedField,
  onCopy,
}: {
  label: string;
  value: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) => (
  <div className="flex items-center justify-between gap-2 bg-muted rounded px-3 py-2">
    <div className="min-w-0">
      <span className="text-xs font-medium text-muted-foreground">{label}: </span>
      <code className="text-sm text-foreground break-all">{value}</code>
    </div>
    <button
      onClick={() => onCopy(value, field)}
      className="shrink-0 p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      title={`Copy ${label}`}
    >
      {copiedField === field ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  </div>
);

export default NotFound;
