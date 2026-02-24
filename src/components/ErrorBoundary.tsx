import React, { Component, ErrorInfo, ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: "",
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

  public render() {
    if (this.state.hasError) {
      const errorCode = this.state.error?.name || "UNKNOWN_ERROR";
      const errorMessage = this.state.error?.message || "An unexpected error occurred";

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* Lego Image */}
            <div className="flex justify-center mb-8">
              <img
                src="/error-lego.png"
                alt="Something went wrong - Lego characters with unplugged cable"
                className="w-full max-w-md h-auto rounded-lg"
              />
            </div>

            {/* Error Card */}
            <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-muted/50 px-6 py-4 border-b border-border">
                <h1 className="text-xl font-semibold text-foreground">
                  <span className="text-destructive">⚠ Error</span>: {errorCode}
                </h1>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message:</label>
                  <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                    {errorMessage}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code:</label>
                  <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                    <code>{errorCode}</code>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID:</label>
                  <p className="mt-1 text-foreground font-mono text-sm bg-muted rounded px-3 py-2">
                    <code>{this.state.errorId}</code>
                  </p>
                </div>

                {this.state.errorInfo?.componentStack && (
                  <details className="mt-4">
                    <summary className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                      Component Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground bg-muted rounded p-3 overflow-x-auto max-h-32 overflow-y-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleReload} variant="default" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              If this error persists, please{" "}
              <a href="/contact" className="text-primary hover:underline">contact support</a>{" "}
              with the error ID above.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
