import { useState, memo } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Set for above-the-fold images (LCP) — loads eagerly with high priority */
  priority?: boolean;
  /** Extra classes for the wrapper element */
  wrapperClassName?: string;
}

/**
 * Image with native lazy-loading, async decoding and a smooth
 * shimmer placeholder that cross-fades into the loaded image.
 */
const LazyImage = memo(
  ({ src, alt, priority = false, className = "", wrapperClassName = "", ...rest }: LazyImageProps) => {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
      <div className={`relative overflow-hidden bg-muted ${wrapperClassName}`}>
        {!loaded && !failed && (
          <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_1.6s_infinite]" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          // @ts-expect-error fetchpriority is valid HTML but not typed in React 18
          fetchpriority={priority ? "high" : "low"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`transition-opacity duration-500 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";

export default LazyImage;
