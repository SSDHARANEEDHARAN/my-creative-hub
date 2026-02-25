import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  ArrowLeft,
  Copy,
  Check,
  Search,
  Send,
  AlertCircle,
  BookOpen,
  FolderOpen,
  User,
  Mail,
  Briefcase,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";


const sitePages = [
  { path: "/", label: "Home", icon: Home, description: "Main landing page" },
  { path: "/about", label: "About", icon: User, description: "Learn about me" },
  { path: "/projects", label: "Projects", icon: FolderOpen, description: "View my work" },
  { path: "/blog", label: "Blog", icon: BookOpen, description: "Read articles" },
  { path: "/gallery", label: "Gallery", icon: Image, description: "Photo gallery" },
  { path: "/services", label: "Services", icon: Briefcase, description: "What I offer" },
  { path: "/contact", label: "Contact", icon: Mail, description: "Get in touch" },
];

const NotFound = () => {
  const location = useLocation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [errorId] = useState(() => {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `route::${randomPart}-${timestamp}`;
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
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

  const filteredPages = sitePages.filter(
    (page) =>
      page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage.trim()) return;
    toast({
      title: "Broken link reported",
      description: "Thanks for letting us know! We'll look into it.",
    });
    setFeedbackSent(true);
    setFeedbackMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Lego-themed header bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="font-semibold text-foreground text-sm sm:text-base">
              404 — Page Not Found
            </span>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-4 h-4 mr-1.5" />
            Home
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        {/* Hero section with error video */}
        <section className="text-center space-y-4">
          <div className="mx-auto max-w-md rounded-lg overflow-hidden border-2 border-border shadow-lg">
            <video
              src="/videos/error-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-56 object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            <span className="text-warning">Oops!</span> We can't find that page
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            The link you followed may be broken or the page may have been
            removed. Use the search below or pick a page to get back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={handleGoBack} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="default"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </section>

        {/* Inline site search */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Find your way
          </h2>
          <Input
            placeholder="Search pages… e.g. blog, projects, contact"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-muted/50"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
              >
                <page.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {page.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {page.description}
                  </span>
                </div>
              </Link>
            ))}
            {filteredPages.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                No pages match your search.
              </p>
            )}
          </div>
        </section>

        {/* Report broken link */}
        <section className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Report this broken link
          </h2>
          {feedbackSent ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Thanks! We've logged this broken link for review.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Found a broken link? Let us know so we can fix it. The current
                path (<code className="text-foreground">{location.pathname}</code>)
                will be included automatically.
              </p>
              <Textarea
                placeholder="(Optional) Tell us where you expected this link to go…"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={2}
                className="bg-muted/50"
              />
              <Button onClick={handleFeedbackSubmit} size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Report
              </Button>
            </>
          )}
        </section>

        {/* Collapsible error details */}
        <details className="bg-card border border-border rounded-lg overflow-hidden">
          <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/50">
            Technical Details
          </summary>
          <div className="p-5 space-y-3">
            <ErrorDetailRow
              label="Code"
              value="NOT_FOUND"
              field="code"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <ErrorDetailRow
              label="Path"
              value={location.pathname}
              field="path"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
            <ErrorDetailRow
              label="ID"
              value={errorId}
              field="id"
              copiedField={copiedField}
              onCopy={copyToClipboard}
            />
          </div>
        </details>

        <p className="text-center text-sm text-muted-foreground pb-8">
          Still stuck?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact support
          </a>{" "}
          and share the error ID above.
        </p>
      </main>
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
      <span className="text-xs font-medium text-muted-foreground">
        {label}:{" "}
      </span>
      <code className="text-sm text-foreground break-all">{value}</code>
    </div>
    <button
      onClick={() => onCopy(value, field)}
      className="shrink-0 p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      title={`Copy ${label}`}
    >
      {copiedField === field ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  </div>
);

export default NotFound;
