import { useEffect, useRef, useCallback } from "react";

const SpotlightOverlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const smoothPos = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number>(0);
  const isActive = useRef(false);

  const animate = useCallback(() => {
    rafId.current = requestAnimationFrame(animate);

    // Lerp for smooth easing
    smoothPos.current.x += (mousePos.current.x - smoothPos.current.x) * 0.12;
    smoothPos.current.y += (mousePos.current.y - smoothPos.current.y) * 0.12;

    if (overlayRef.current) {
      const x = smoothPos.current.x;
      const y = smoothPos.current.y;
      const radius = isActive.current ? 220 : 180;
      overlayRef.current.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)`;
    }
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const parent = overlay.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      isActive.current = true;
    };

    const handleMouseLeave = () => {
      isActive.current = false;
      mousePos.current.x = -1000;
      mousePos.current.y = -1000;
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animate]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-[5] pointer-events-none transition-none"
      style={{
        background: "rgba(0,0,0,0.85)",
      }}
    />
  );
};

export default SpotlightOverlay;
