import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

type NewNoticeContentProps = {
  title: string;
  message: string;
  headingAs?: "h1" | "p";
  compact?: boolean;
};

export function NewNoticeContent({ title, message, headingAs = "h1", compact = false }: NewNoticeContentProps) {
  const Heading = headingAs;
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-12",
        compact ? "min-h-[260px]" : "min-h-[340px] lg:min-h-full",
      )}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-2.5 w-2.5 shrink-0 animate-pulse bg-destructive" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[hsl(var(--soft-white)/0.68)]">
          Live notice
        </p>
      </div>
      <Heading
        className={cn(
          "max-w-xl font-display font-bold leading-tight text-[hsl(var(--soft-white))]",
          compact ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl",
        )}
      >
        {title}
      </Heading>
      <p className="mt-5 max-w-xl whitespace-pre-line text-sm leading-relaxed text-[hsl(var(--soft-white)/0.72)] sm:text-base">
        {message}
      </p>
    </div>
  );
}

const NewPageHero = ({ title, message }: { title: string; message: string }) => {
  return (
    <Card
      role="status"
      className="relative w-full overflow-hidden border-2 border-foreground bg-[hsl(var(--sky-dark))] text-[hsl(var(--soft-white))] shadow-none"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={480} />
      <div className="grid lg:h-[500px] lg:grid-cols-2">
        <NewNoticeContent title={title} message={message} />
        <div className="relative h-[320px] border-t border-[hsl(var(--soft-white)/0.18)] lg:h-full lg:border-l lg:border-t-0">
          <div className="pointer-events-none absolute left-4 top-4 z-20 border border-[hsl(var(--soft-white)/0.24)] bg-[hsl(var(--sky-dark)/0.76)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--soft-white)/0.72)] backdrop-blur-sm">
            Interactive robot · drag to explore
          </div>
          <SplineScene scene={ROBOT_SCENE} className="h-full w-full" />
        </div>
      </div>
    </Card>
  );
};

export default NewPageHero;
