import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface FolderItem {
  id: string;
  title: string;
  image?: string;
  badge?: string;
}

interface AnimatedFolderProps {
  title: string;
  description?: string;
  items: FolderItem[];
  className?: string;
  onOpen?: () => void;
}

/**
 * 3D animated folder (adapted to the site's monochrome, zero-radius theme).
 * Hovering tilts the folder open and fans out up to 3 item cards;
 * clicking anywhere on the folder opens it via `onOpen`.
 */
export function AnimatedFolder({ title, description, items, className, onOpen }: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previewItems = items.slice(0, 3);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${title} folder`}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center",
        "border border-border bg-card p-8 text-left",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:border-foreground hover:shadow-[8px_8px_0_0_hsl(var(--foreground))]",
        "group w-full",
        className,
      )}
      style={{ minWidth: "260px", minHeight: "320px", perspective: "1000px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative mb-4 flex items-center justify-center" style={{ height: "160px", width: "200px" }}>
        {/* Folder back layer */}
        <div
          className="absolute h-24 w-32 border border-foreground/40 bg-muted shadow-md"
          style={{
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(-15deg)" : "rotateX(0deg)",
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 10,
          }}
        />

        {/* Folder tab */}
        <div
          className="absolute h-4 w-12 border border-b-0 border-foreground/40 bg-muted"
          style={{
            top: "calc(50% - 48px - 12px)",
            left: "calc(50% - 64px + 16px)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(-25deg) translateY(-2px)" : "rotateX(0deg)",
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 10,
          }}
        />

        {/* Item cards fanning out of the folder */}
        <div
          className="absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}
        >
          {previewItems.map((item, index) => (
            <FolderItemCard
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              item={item}
              delay={index * 80}
              isVisible={isHovered}
              index={index}
            />
          ))}
        </div>

        {/* Folder front layer */}
        <div
          className="absolute h-24 w-32 border border-foreground bg-secondary shadow-lg"
          style={{
            top: "calc(50% - 48px + 4px)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 30,
          }}
        />

        {/* Folder shine */}
        <div
          className="pointer-events-none absolute h-24 w-32 overflow-hidden"
          style={{
            top: "calc(50% - 48px + 4px)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
            transformOrigin: "bottom center",
            transform: isHovered ? "rotateX(25deg) translateY(8px)" : "rotateX(0deg)",
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            zIndex: 31,
          }}
        />
      </div>

      <h3
        className="mt-4 text-lg font-semibold text-foreground transition-all duration-300"
        style={{ transform: isHovered ? "translateY(4px)" : "translateY(0)" }}
      >
        {title}
      </h3>

      {description ? (
        <p className="mt-1 line-clamp-2 text-center text-sm text-muted-foreground">{description}</p>
      ) : null}

      <p
        className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-300"
        style={{ opacity: isHovered ? 0.7 : 1 }}
      >
        {items.length} {items.length === 1 ? "file" : "files"}
      </p>

      <span
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground transition-all duration-300"
        style={{
          opacity: isHovered ? 0 : 0.6,
          transform: isHovered ? "translateY(10px)" : "translateY(0)",
        }}
      >
        Hover to explore
      </span>
    </button>
  );
}

import { forwardRef } from "react";

interface FolderItemCardProps {
  item: FolderItem;
  delay: number;
  isVisible: boolean;
  index: number;
}

const FolderItemCard = forwardRef<HTMLDivElement, FolderItemCardProps>(
  ({ item, delay, isVisible, index }, ref) => {
    const rotations = [-12, 0, 12];
    const translations = [-55, 0, 55];

    return (
      <div
        ref={ref}
        className={cn(
          "absolute h-28 w-20 overflow-hidden border border-border bg-card shadow-xl",
        )}
        style={{
          transform: isVisible
            ? `translateY(-90px) translateX(${translations[index]}px) rotate(${rotations[index]}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.5)",
          opacity: isVisible ? 1 : 0,
          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
          zIndex: 10 - index,
          left: "-40px",
          top: "-56px",
        }}
      >
        {item.image ? (
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-secondary px-1">
            <span className="border border-foreground/40 px-1.5 py-0.5 text-[10px] font-bold text-foreground">
              {item.badge ?? "FILE"}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <p className="absolute bottom-1.5 left-1.5 right-1.5 truncate text-[10px] font-medium text-primary-foreground">
          {item.title}
        </p>
      </div>
    );
  },
);

FolderItemCard.displayName = "FolderItemCard";
