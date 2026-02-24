import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, Home, Copy, Check, AlertTriangle } from "lucide-react";
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

  private copyFullReport = () => {
    const { error, errorId, errorInfo } = this.state;
    const report = [
      `Error ID: ${errorId}`,
      `Code: ${error?.name || "UNKNOWN_ERROR"}`,
      `Message: ${error?.message || "An unexpected error occurred"}`,
      errorInfo?.componentStack
        ? `Stack:\n${errorInfo.componentStack}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(report).then(() => {
      this.setState({ copiedField: "full" });
      setTimeout(() => this.setState({ copiedField: null }), 2000);
    });
  };

  public render() {
    if (this.state.hasError) {
      const errorCode = this.state.error?.name || "UNKNOWN_ERROR";
      const errorMessage =
        this.state.error?.message || "An unexpected error occurred";
      const { copiedField } = this.state;

      return (
        <div className="min-h-screen bg-background">
          {/* Persistent header */}
          <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-foreground text-sm sm:text-base">
                  Application Error
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={this.handleGoHome}
              >
                <Home className="w-4 h-4 mr-1.5" />
                Home
              </Button>
            </div>
          </header>

          <main className="max-w-2xl mx-auto px-4 py-10 text-center space-y-8">
            {/* Lego illustration */}
            <img
              src={legoImage}
              alt="Something went wrong - Lego characters"
              className="mx-auto max-w-full h-auto max-h-56 object-contain"
            />

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                <span className="text-destructive">Oops!</span> Something Broke
              </h1>
              <p className="text-muted-foreground text-base max-w-md mx-auto">
                An unexpected error occurred. Try refreshing or head back home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} variant="default" size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>

            {/* Error details panel */}
            <div className="text-left bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Error Details
                </span>
                <button
                  onClick={this.copyFullReport}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedField === "full" ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy All
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 space-y-3">
                <CopyRow
                  label="Code"
                  value={errorCode}
                  field="code"
                  copiedField={copiedField}
                  onCopy={this.copyToClipboard}
                />
                <CopyRow
                  label="Message"
                  value={errorMessage}
                  field="message"
                  copiedField={copiedField}
                  onCopy={this.copyToClipboard}
                />
                <CopyRow
                  label="ID"
                  value={this.state.errorId}
                  field="id"
                  copiedField={copiedField}
                  onCopy={this.copyToClipboard}
                />

                {this.state.errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center justify-between">
                      <span>Stack Trace</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          this.copyToClipboard(
                            this.state.errorInfo!.componentStack!,
                            "stack"
                          );
                        }}
                        className="p-1 rounded hover:bg-accent transition-colors"
                      >
                        {copiedField === "stack" ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground bg-muted rounded p-3 overflow-x-auto max-h-32 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground pb-8">
              If this persists, please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact support
              </a>{" "}
              with the error ID.
            </p>
          </main>
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

export default ErrorBoundary;
