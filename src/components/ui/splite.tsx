import { Component, useEffect, useState, type ReactNode } from "react";
import Spline from "@splinetool/react-spline";
import { Bot, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

class SplineErrorBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    setFailed(false);
    const timeout = window.setTimeout(() => setTimedOut(true), 45000);
    return () => window.clearTimeout(timeout);
  }, [scene, attempt]);

  const retry = () => setAttempt((value) => value + 1);
  const unavailable = failed || timedOut;

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!loaded && (
        <div
          role="status"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[hsl(var(--sky-dark))] px-6 text-center text-[hsl(var(--soft-white))]"
        >
          {unavailable ? (
            <>
              <Bot className="h-10 w-10" aria-hidden />
              <span className="text-sm text-[hsl(var(--soft-white)/0.72)]">
                The interactive robot could not load. Please check your connection and try again.
              </span>
              <button
                type="button"
                onClick={retry}
                className="mt-2 inline-flex items-center gap-2 border border-[hsl(var(--soft-white)/0.3)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--soft-white))] transition-colors hover:bg-[hsl(var(--soft-white)/0.1)]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Retry robot
              </button>
            </>
          ) : (
            <>
              <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[hsl(var(--soft-white)/0.72)]">
                Loading robot
              </span>
            </>
          )}
        </div>
      )}
      <SplineErrorBoundary key={attempt} onFailure={() => setFailed(true)}>
        <Spline
          scene={scene}
          className="h-full w-full"
          onLoad={() => {
            setLoaded(true);
            setTimedOut(false);
            setFailed(false);
          }}
          renderOnDemand={false}
          wasmPath="/spline-runtime"
          htmlContentMode="none"
        />
      </SplineErrorBoundary>
    </div>
  );
}
