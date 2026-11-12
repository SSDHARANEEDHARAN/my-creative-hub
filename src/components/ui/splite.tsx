import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Bot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const timeout = window.setTimeout(() => setTimedOut(true), 20000);
    return () => window.clearTimeout(timeout);
  }, [scene]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      {!loaded && (
        <div
          role="status"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[hsl(var(--sky-dark))] px-6 text-center text-[hsl(var(--soft-white))]"
        >
          {timedOut ? (
            <>
              <Bot className="h-10 w-10" aria-hidden />
              <span className="text-sm text-[hsl(var(--soft-white)/0.72)]">
                The interactive robot could not load. Please check your connection and reload.
              </span>
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
      <Spline
        scene={scene}
        className="h-full w-full"
        onLoad={() => {
          setLoaded(true);
          setTimedOut(false);
        }}
        htmlContentMode="none"
      />
    </div>
  );
}
