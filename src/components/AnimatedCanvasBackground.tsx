import { useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const AnimatedCanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const isMobile = useIsMobile();

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const t = performance.now() * 0.001;
    const step = isMobile ? 0.35 : 0.2;
    const cols = Math.ceil(w / 30);
    const rows = Math.ceil(h / 30);

    // Wave grid
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const x = (i / cols) * w;
        const y = (j / rows) * h;
        const dx = x - w * 0.5;
        const dy = y - h * 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave = Math.sin(dist * 0.008 - t * 0.8 + i * step + j * step) * 0.5 + 0.5;
        const alpha = wave * 0.06;
        const size = 1 + wave * 1.5;
        ctx.fillStyle = `rgba(120,140,170,${alpha})`;
        ctx.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      }
    }

    // Flowing connection lines
    const lineCount = isMobile ? 4 : 8;
    for (let l = 0; l < lineCount; l++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(90,120,180,${0.03 + Math.sin(t + l) * 0.01})`;
      ctx.lineWidth = 0.5;
      const baseY = (h / (lineCount + 1)) * (l + 1);
      for (let x = 0; x < w; x += 4) {
        const y = baseY + Math.sin(x * 0.005 + t * 0.4 + l * 1.2) * 25
                        + Math.cos(x * 0.008 - t * 0.3) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isMobile]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default AnimatedCanvasBackground;
