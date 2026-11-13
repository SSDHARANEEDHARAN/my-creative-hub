import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NotchedProjectCoverProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onOpen?: () => void;
  badge?: string;
  label: string;
  /** Renders the arrow as a non-navigating control (used by admin previews). */
  disabled?: boolean;
}

const notchSize = 80;
const filletSize = 24;

const NotchedProjectCover = ({
  children,
  href,
  external = false,
  onOpen,
  badge,
  label,
  disabled = false,
}: NotchedProjectCoverProps) => {
  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onOpen?.();
  };

  const arrowClasses =
    "project-arrow-shape absolute bottom-2 right-2 z-30 flex h-[60px] w-[60px] items-center justify-center border border-border bg-secondary text-secondary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const arrowIcon = (
    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/project-card:-translate-y-0.5 group-hover/project-card:translate-x-0.5" />
  );

  const arrow = href ? (
    disabled ? (
      <button type="button" aria-label={label} aria-disabled tabIndex={-1} onClick={handleOpen} className={`${arrowClasses} cursor-default`}>
        {arrowIcon}
      </button>
    ) : external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpen}
        aria-label={label}
        className={arrowClasses}
      >
        {arrowIcon}
      </a>
    ) : (
      <Link to={href} onClick={handleOpen} aria-label={label} className={arrowClasses}>
        {arrowIcon}
      </Link>
    )
  ) : null;

  return (
    <div className="project-cover-shape relative aspect-[4/3] bg-muted">
      <div className="project-cover-shape absolute inset-0 overflow-hidden">{children}</div>

      {badge && (
        <div className="pointer-events-none absolute left-4 top-4 z-20">
          <span className="project-badge-shape border border-background/30 bg-foreground/85 px-3 py-1 text-xs font-semibold text-background backdrop-blur-sm">
            {badge}
          </span>
        </div>
      )}

      {href && (
        <>
          <div
            aria-hidden="true"
            className="project-notch-shape pointer-events-none absolute bottom-0 right-0 z-20 bg-background"
            style={{ width: notchSize, height: notchSize }}
          />
          {[
            { bottom: notchSize, right: 0 },
            { bottom: 0, right: notchSize },
          ].map((position, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute z-20"
              style={{
                ...position,
                width: filletSize,
                height: filletSize,
                background: `radial-gradient(circle at top left, transparent ${filletSize - 0.5}px, hsl(var(--background)) ${filletSize}px)`,
              }}
            />
          ))}
          {arrow}
        </>
      )}
    </div>
  );
};

export default NotchedProjectCover;
