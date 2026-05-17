import { Heart } from "lucide-react";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";

export interface FloatingHeartHandle {
  spawn: (x: number, y: number) => void;
}

interface HeartItem {
  id: number;
  x: number;
  y: number;
}

const FloatingHeart = forwardRef<FloatingHeartHandle>((_, ref) => {
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const counter = useRef(0);

  useImperativeHandle(ref, () => ({
    spawn: (x, y) => {
      const id = ++counter.current;
      setHearts((h) => [...h, { id, x, y }]);
      window.setTimeout(() => {
        setHearts((h) => h.filter((p) => p.id !== id));
      }, 1000);
    },
  }));

  return (
    <>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "fixed",
            left: h.x,
            top: h.y,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="floating-heart-anim"
        >
          <Heart
            size={96}
            className="text-red-500 drop-shadow-[0_6px_16px_rgba(239,68,68,0.55)]"
            fill="currentColor"
            strokeWidth={1.5}
          />
        </div>
      ))}
    </>
  );
});

FloatingHeart.displayName = "FloatingHeart";

export default FloatingHeart;
