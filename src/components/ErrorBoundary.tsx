import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, Home, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import legoImage from "@/assets/lego-error.png";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copiedField: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: "",
    copiedField: null,
  };

  private generateErrorId(): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `err::${randomPart}-${timestamp}`;
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.generateErrorId();
    this.setState({ errorInfo, errorId });
    console.error("Global Error Boundary caught an error:", {
      error: error.message,
      errorId,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copiedField: field });
      setTimeout(() => this.setState({ copiedField: null }), 2000);
    });
  };

  public render() {
    if (this.state.hasError) {
      const errorCode = this.state.error?.name || "UNKNOWN_ERROR";
      const errorMessage = this.state.error?.message || "An unexpected error occurred";
      const { copiedField } = this.state;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl text-center">
            {/* Lego Illustration */}
            <div className="mb-6">
              <img
                src={legoImage}
                alt="Something went wrong - Lego characters with disconnected plug"
                className="mx-auto max-w-full h-auto max-h-64 object-contain rounded-xl"
              />
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-2">
              <span className="text-destructive">Oops!</span> Something Broke
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
              Don't worry, our Lego crew is on it. Try refreshing or head home.
            </p>

            {/* Quick actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button onClick={this.handleReload} variant="default" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" size="lg">
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
                <CopyRow label="Code" value={errorCode} field="code" copiedField={copiedField} onCopy={this.copyToClipboard} />
                <CopyRow label="Message" value={errorMessage} field="message" copiedField={copiedField} onCopy={this.copyToClipboard} />
                <CopyRow label="ID" value={this.state.errorId} field="id" copiedField={copiedField} onCopy={this.copyToClipboard} />

                {this.state.errorInfo?.componentStack && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">Stack Trace</span>
                      <button
                        onClick={() => this.copyToClipboard(this.state.errorInfo!.componentStack!, "stack")}
                        className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                        title="Copy stack trace"
                      >
                        {copiedField === "stack" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs text-muted-foreground bg-muted rounded p-3 overflow-x-auto max-h-32 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            <p className="text-sm text-muted-foreground mt-6">
              If this persists, please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact support
              </a>{" "}
              with the error ID.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const CopyRow = ({
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

export default ErrorBoundary;
