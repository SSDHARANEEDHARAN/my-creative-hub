import { useEffect, useRef, useState } from "react";

const EdgeGlow = () => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scroll, setScroll] = useState(0);
  const rafRef = useRef<number>(0);
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener("resize", resize);
    resize();

    const lineWidth = 2;

    const draw = (t: number) => {
      rafRef.current = requestAnimationFrame(draw);
      const dt = (t - timeRef.current) * 0.001;
      timeRef.current = t;

      // Smooth mouse
      smoothMouse.current.x += (mouse.x - smoothMouse.current.x) * 0.08;
      smoothMouse.current.y += (mouse.y - smoothMouse.current.y) * 0.08;

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;
      const time = t * 0.001;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Pulse factor based on time + scroll
      const pulse = 0.5 + 0.5 * Math.sin(time * 2.0 + scroll * 10.0);
      const breathe = 0.6 + 0.4 * Math.sin(time * 1.2);

      // Calculate proximity intensity for each edge (0-1)
      const topProx = 1.0 - my; // closer to top = higher
      const bottomProx = my;
      const leftProx = 1.0 - mx;
      const rightProx = mx;

      const drawEdgeLine = (
        x1: number, y1: number, x2: number, y2: number,
        proximity: number, mousePos: number, isHorizontal: boolean
      ) => {
        const intensity = 0.15 + proximity * 0.85;
        const alpha = intensity * breathe * (0.4 + pulse * 0.6);

        // Gradient along the line with bright spot at mouse position
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        const mp = Math.max(0.05, Math.min(0.95, mousePos));

        // Base color: silver, shifts to blue near mouse
        const baseR = 180, baseG = 190, baseB = 210;
        const glowR = 80, glowG = 150, glowB = 255;

        const dimAlpha = alpha * 0.15;
        const brightAlpha = alpha * 0.9;

        grad.addColorStop(0, `rgba(${baseR},${baseG},${baseB},${dimAlpha})`);
        grad.addColorStop(Math.max(0, mp - 0.15), `rgba(${baseR},${baseG},${baseB},${dimAlpha * 1.5})`);
        grad.addColorStop(mp, `rgba(${glowR},${glowG},${glowB},${brightAlpha})`);
        grad.addColorStop(Math.min(1, mp + 0.15), `rgba(${baseR},${baseG},${baseB},${dimAlpha * 1.5})`);
        grad.addColorStop(1, `rgba(${baseR},${baseG},${baseB},${dimAlpha})`);

        // Main line
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = lineWidth + proximity * 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Outer glow (wider, more transparent)
        ctx.beginPath();
        const glowGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        const glowDim = alpha * 0.05;
        const glowBright = alpha * 0.3;
        glowGrad.addColorStop(0, `rgba(${glowR},${glowG},${glowB},${glowDim})`);
        glowGrad.addColorStop(mp, `rgba(${glowR},${glowG},${glowB},${glowBright})`);
        glowGrad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},${glowDim})`);
        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = 8 + proximity * 12;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Traveling spark particle
        const sparkPos = (time * 0.15 + proximity * 0.3) % 1.0;
        const sparkX = isHorizontal ? x1 + (x2 - x1) * sparkPos : x1;
        const sparkY = isHorizontal ? y1 : y1 + (y2 - y1) * sparkPos;
        const sparkAlpha = alpha * 0.8 * (0.5 + 0.5 * Math.sin(time * 8.0 + proximity * 5.0));

        const sparkGrad = ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 15);
        sparkGrad.addColorStop(0, `rgba(${glowR},${glowG},${glowB},${sparkAlpha})`);
        sparkGrad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},0)`);
        ctx.fillStyle = sparkGrad;
        ctx.fillRect(sparkX - 15, sparkY - 15, 30, 30);
      };

      // Top edge
      drawEdgeLine(0, 0, w, 0, topProx, mx, true);
      // Bottom edge
      drawEdgeLine(0, h, w, h, bottomProx, mx, true);
      // Left edge
      drawEdgeLine(0, 0, 0, h, leftProx, my, false);
      // Right edge
      drawEdgeLine(w, 0, w, h, rightProx, my, false);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mouse, scroll]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};

export default EdgeGlow;
