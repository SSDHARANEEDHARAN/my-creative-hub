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

    const draw = (t: number) => {
      rafRef.current = requestAnimationFrame(draw);
      timeRef.current = t;

      smoothMouse.current.x += (mouse.x - smoothMouse.current.x) * 0.08;
      smoothMouse.current.y += (mouse.y - smoothMouse.current.y) * 0.08;

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;
      const time = t * 0.001;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const pulse = 0.5 + 0.5 * Math.sin(time * 2.0 + scroll * 10.0);
      const breathe = 0.7 + 0.3 * Math.sin(time * 1.2);

      const topProx = 1.0 - my;
      const bottomProx = my;
      const leftProx = 1.0 - mx;
      const rightProx = mx;

      const glowR = 40, glowG = 100, glowB = 255;
      const baseR = 100, baseG = 140, baseB = 255;

      const drawEdgeLine = (
        x1: number, y1: number, x2: number, y2: number,
        proximity: number, mousePos: number, isHorizontal: boolean
      ) => {
        const intensity = 0.3 + proximity * 0.7;
        const alpha = intensity * breathe * (0.5 + pulse * 0.5);
        const mp = Math.max(0.05, Math.min(0.95, mousePos));

        // Wide outer glow
        ctx.beginPath();
        const outerGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        const outerDim = alpha * 0.08;
        const outerBright = alpha * 0.45;
        outerGrad.addColorStop(0, `rgba(${glowR},${glowG},${glowB},${outerDim})`);
        outerGrad.addColorStop(Math.max(0, mp - 0.2), `rgba(${glowR},${glowG},${glowB},${outerDim * 2})`);
        outerGrad.addColorStop(mp, `rgba(${glowR},${glowG},${glowB},${outerBright})`);
        outerGrad.addColorStop(Math.min(1, mp + 0.2), `rgba(${glowR},${glowG},${glowB},${outerDim * 2})`);
        outerGrad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},${outerDim})`);
        ctx.strokeStyle = outerGrad;
        ctx.lineWidth = 20 + proximity * 25;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Mid glow
        ctx.beginPath();
        const midGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        const midDim = alpha * 0.15;
        const midBright = alpha * 0.7;
        midGrad.addColorStop(0, `rgba(${baseR},${baseG},${baseB},${midDim})`);
        midGrad.addColorStop(Math.max(0, mp - 0.12), `rgba(${baseR},${baseG},${baseB},${midDim * 2})`);
        midGrad.addColorStop(mp, `rgba(${glowR},${glowG},${glowB},${midBright})`);
        midGrad.addColorStop(Math.min(1, mp + 0.12), `rgba(${baseR},${baseG},${baseB},${midDim * 2})`);
        midGrad.addColorStop(1, `rgba(${baseR},${baseG},${baseB},${midDim})`);
        ctx.strokeStyle = midGrad;
        ctx.lineWidth = 6 + proximity * 8;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Core bright line
        ctx.beginPath();
        const coreGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        const coreDim = alpha * 0.25;
        const coreBright = alpha * 1.0;
        coreGrad.addColorStop(0, `rgba(${baseR},${baseG},${baseB},${coreDim})`);
        coreGrad.addColorStop(Math.max(0, mp - 0.1), `rgba(255,255,255,${coreDim * 1.5})`);
        coreGrad.addColorStop(mp, `rgba(255,255,255,${coreBright})`);
        coreGrad.addColorStop(Math.min(1, mp + 0.1), `rgba(255,255,255,${coreDim * 1.5})`);
        coreGrad.addColorStop(1, `rgba(${baseR},${baseG},${baseB},${coreDim})`);
        ctx.strokeStyle = coreGrad;
        ctx.lineWidth = 3 + proximity * 3;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Traveling spark
        const sparkPos = (time * 0.12 + proximity * 0.25) % 1.0;
        const sparkX = isHorizontal ? x1 + (x2 - x1) * sparkPos : x1;
        const sparkY = isHorizontal ? y1 : y1 + (y2 - y1) * sparkPos;
        const sparkAlpha = alpha * (0.5 + 0.5 * Math.sin(time * 8.0 + proximity * 5.0));

        const sparkGrad = ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 25);
        sparkGrad.addColorStop(0, `rgba(180,210,255,${sparkAlpha})`);
        sparkGrad.addColorStop(0.4, `rgba(${glowR},${glowG},${glowB},${sparkAlpha * 0.5})`);
        sparkGrad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},0)`);
        ctx.fillStyle = sparkGrad;
        ctx.fillRect(sparkX - 25, sparkY - 25, 50, 50);

        // Second spark going opposite direction
        const spark2Pos = (1.0 - (time * 0.08 + proximity * 0.4) % 1.0);
        const spark2X = isHorizontal ? x1 + (x2 - x1) * spark2Pos : x1;
        const spark2Y = isHorizontal ? y1 : y1 + (y2 - y1) * spark2Pos;
        const spark2Alpha = alpha * 0.4 * (0.5 + 0.5 * Math.cos(time * 6.0));

        const spark2Grad = ctx.createRadialGradient(spark2X, spark2Y, 0, spark2X, spark2Y, 18);
        spark2Grad.addColorStop(0, `rgba(200,220,255,${spark2Alpha})`);
        spark2Grad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},0)`);
        ctx.fillStyle = spark2Grad;
        ctx.fillRect(spark2X - 18, spark2Y - 18, 36, 36);
      };

      // Draw all 4 edges
      drawEdgeLine(0, 1, w, 1, topProx, mx, true);
      drawEdgeLine(0, h - 1, w, h - 1, bottomProx, mx, true);
      drawEdgeLine(1, 0, 1, h, leftProx, my, false);
      drawEdgeLine(w - 1, 0, w - 1, h, rightProx, my, false);

      // Corner glow accents
      const corners = [
        { x: 0, y: 0, prox: (topProx + leftProx) / 2 },
        { x: w, y: 0, prox: (topProx + rightProx) / 2 },
        { x: 0, y: h, prox: (bottomProx + leftProx) / 2 },
        { x: w, y: h, prox: (bottomProx + rightProx) / 2 },
      ];
      for (const c of corners) {
        const cAlpha = c.prox * breathe * 0.6 * (0.5 + pulse * 0.5);
        const cGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 40);
        cGrad.addColorStop(0, `rgba(${glowR},${glowG},${glowB},${cAlpha})`);
        cGrad.addColorStop(0.5, `rgba(${glowR},${glowG},${glowB},${cAlpha * 0.3})`);
        cGrad.addColorStop(1, `rgba(${glowR},${glowG},${glowB},0)`);
        ctx.fillStyle = cGrad;
        ctx.fillRect(c.x - 40, c.y - 40, 80, 80);
      }
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
