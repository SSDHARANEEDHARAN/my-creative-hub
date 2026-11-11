"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, type AnimationPlaybackControls, type MotionValue } from "framer-motion";

// ---- aquarium-prompt.tsx ----
/* eslint-disable react-hooks/refs -- these rules assume code runs while rendering; here refs, timers and setState are used in handlers, effects and animation frames, and the animation state lives in refs on purpose */


// Icons: Framework7 Icons (MIT) via Iconify, SF Symbols style. Inlined so the file has no icon dependency.
const ICON = {
  arrow_up: "<path fill=\"currentColor\" d=\"M27.988 50.137c1.22 0 2.11-.844 2.11-2.063V17.207l-.188-4.992l7.008 7.687l5.344 5.25c.375.375.937.563 1.476.563c1.172 0 2.04-.89 2.04-2.04c0-.562-.212-1.054-.657-1.523L29.56 6.566c-.446-.468-.985-.703-1.57-.703c-.563 0-1.102.235-1.548.703L10.88 22.152c-.445.47-.656.961-.656 1.524c0 1.148.867 2.039 2.015 2.039c.563 0 1.125-.188 1.5-.563l5.32-5.25l7.032-7.71l-.188 5.015v30.867c0 1.219.867 2.063 2.086 2.063\"/>",
} as const;

export type AquariumPromptProps = {
  title?: string;
  placeholder?: string;
  /** called with the text when it's sent */
  onSubmit?: (text: string) => void;
  /** how many fish swim in the tank */
  fish?: number;
  /** Demo itself until someone touches it. Off by default. */
  autoplay?: boolean;
  className?: string;
};

// ─── The tank ──────────────────────────────────────────────────────────────────
// Everything is drawn at a quarter of the resolution and scaled up without smoothing, so the water, the light and
// the fish are crisp pixel art. The water is a dithered gradient with moving caustics; the fish are boids that
// school with their own kind, steer clear of the walls, flee the pointer, gather round the caret while you type,
// and all swim into the box when you send.

const PX = 4; // CSS pixels per tank pixel
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

type RGB = [number, number, number];
type Species = { body: RGB; belly: RGB; fin: RGB; stripe?: RGB; len: number; tall: number; school: number; speed: number };
const SPECIES: Species[] = [
  { body: [255, 128, 34], belly: [255, 170, 80], fin: [214, 82, 16], stripe: [255, 255, 255], len: 13, tall: 0.5, school: 3, speed: 1 }, // clownfish
  { body: [36, 92, 220], belly: [70, 140, 240], fin: [255, 214, 40], len: 14, tall: 0.55, school: 4, speed: 1.05 }, // blue tang
  { body: [255, 214, 32], belly: [255, 236, 110], fin: [240, 180, 0], len: 10, tall: 0.62, school: 4, speed: 1.1 }, // yellow tang
  { body: [170, 206, 228], belly: [222, 240, 250], fin: [120, 160, 190], len: 7, tall: 0.38, school: 10, speed: 1.35 }, // sardines
];

type Fish = { x: number; y: number; vx: number; vy: number; s: number; size: number; phase: number; dart: number; gone: number };
type Bubble = { x: number; y: number; r: number; v: number; wob: number };
type Ripple = { x: number; y: number; t0: number };

function spawnFish(n: number, W: number, H: number): Fish[] {
  const out: Fish[] = [];
  let s = 0;
  while (out.length < n) {
    const sp = SPECIES[s % SPECIES.length];
    const cx = 40 + Math.random() * (W - 80);
    const cy = 40 + Math.random() * (H - 90);
    const dir = Math.random() < 0.5 ? -1 : 1;
    for (let k = 0; k < sp.school && out.length < n; k++)
      out.push({ x: cx + (Math.random() - 0.5) * 60, y: cy + (Math.random() - 0.5) * 40, vx: dir * (0.6 + Math.random() * 0.5), vy: (Math.random() - 0.5) * 0.3, s: s % SPECIES.length, size: 0.85 + Math.random() * 0.3, phase: Math.random() * 6.28, dart: 0, gone: 0 });
    s++;
  }
  return out;
}

/** paint one fish into the pixel buffer, sampled per pixel so a turning fish stays crisp */
function paintFish(buf: Uint8ClampedArray, w: number, h: number, f: Fish, t: number) {
  const sp = SPECIES[f.s];
  const L = sp.len * f.size; // tank pixels
  const T = L * sp.tall;
  const cx = f.x / PX;
  const cy = f.y / PX;
  const facing = f.vx >= 0 ? 1 : -1;
  const tilt = clamp(Math.atan2(f.vy, Math.abs(f.vx) + 0.001), -0.6, 0.6) * facing;
  const ca = Math.cos(-tilt);
  const sa = Math.sin(-tilt);
  const wag = Math.sin(f.phase) * 0.35;
  const R = Math.ceil(L * 0.75);
  const alpha = 1 - f.gone;
  if (alpha <= 0.02) return;
  for (let py = Math.floor(cy - R); py <= cy + R; py++) {
    if (py < 0 || py >= h) continue;
    for (let px = Math.floor(cx - R); px <= cx + R; px++) {
      if (px < 0 || px >= w) continue;
      // into the fish's own frame: u along the body (head at +L/2), v across it
      const dx = (px + 0.5 - cx) * facing;
      const dy = py + 0.5 - cy;
      const u = dx * ca - dy * sa * facing;
      const v = dx * sa * facing + dy * ca;
      let col: RGB | null = null;
      const bu = u / (L * 0.5);
      const bv = v / (T * 0.5);
      if (bu * bu + bv * bv <= 1) {
        // body: lighter belly, a darker back, stripes for the clownfish, an eye near the head
        col = v > T * 0.12 ? sp.belly : v < -T * 0.22 ? sp.fin : sp.body;
        if (sp.stripe && (Math.abs(u - L * 0.12) < 0.9 || Math.abs(u + L * 0.18) < 0.8)) col = sp.stripe;
        if (Math.abs(u - L * 0.3) < 0.75 && Math.abs(v + T * 0.08) < 0.75) col = [18, 22, 30];
      } else {
        // the tail: a fan behind the body that wags
        const tu = -u - L * 0.42;
        const tv = v - wag * tu;
        if (tu > 0 && tu < L * 0.32 && Math.abs(tv) < tu * 0.95 + 0.4) col = sp.fin;
        // a dorsal fin
        else if (u > -L * 0.15 && u < L * 0.15 && v < -T * 0.45 && v > -T * 0.45 - (L * 0.15 - Math.abs(u)) * 0.9) col = sp.fin;
      }
      if (!col) continue;
      const i = (py * w + px) * 4;
      buf[i] = buf[i] + (col[0] - buf[i]) * alpha;
      buf[i + 1] = buf[i + 1] + (col[1] - buf[i + 1]) * alpha;
      buf[i + 2] = buf[i + 2] + (col[2] - buf[i + 2]) * alpha;
    }
  }
  void t;
}

const STOP = Symbol("stop");

/**
 * Aquarium Prompt: an AI prompt box floating in a pixel-art aquarium.
 * A shoal of pixel fish swims behind the frosted glass, each kind schooling with its own: clownfish, blue and
 * yellow tangs, and a fast flicker of sardines. Move the pointer through the water and they scatter; click the
 * water and a ripple sends them darting. Type, and they crowd round the caret to watch, a bubble rising with each
 * key. Press send and they all swim into the box with your message, which floats up as a bubble and pops.
 * Keyboard: it's a normal text field; Enter sends.
 */
export function AquariumPrompt({ title = "What's on your mind?", placeholder = "Ask anything", onSubmit, fish: fishCount = 26, autoplay = false, className = "" }: AquariumPromptProps) {
  const reduced = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState<{ id: number; text: string } | null>(null);
  const inView = useInView(rootRef, { amount: 0.15 });
  const inViewRef = useRef(inView);
  inViewRef.current = inView;
  const labelId = useId();

  const world = useRef({
    fish: [] as Fish[],
    bubbles: [] as Bubble[],
    ripples: [] as Ripple[],
    ptr: { x: -999, y: -999, on: false, t: 0 },
    caret: { x: 0, y: 0, t: -99 },
    gulp: { x: 0, y: 0, t: -99 },
    W: 0,
    H: 0,
  });

  // ─── caret position, for the fish to gather round ───
  const caretAt = useCallback(() => {
    const inp = inputRef.current;
    const root = rootRef.current;
    if (!inp || !root) return null;
    const ctx = document.createElement("canvas").getContext("2d")!;
    const cs = getComputedStyle(inp);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const before = inp.value.slice(0, inp.selectionStart ?? inp.value.length);
    const r = inp.getBoundingClientRect();
    const b = root.getBoundingClientRect();
    const x = r.left - b.left + parseFloat(cs.paddingLeft) + Math.min(ctx.measureText(before).width - inp.scrollLeft, r.width - 20);
    return { x, y: r.top - b.top + r.height / 2 };
  }, []);

  const typed = useCallback(() => {
    const c = caretAt();
    if (!c) return;
    const w = world.current;
    w.caret = { x: c.x, y: c.y, t: performance.now() };
    w.bubbles.push({ x: c.x + (Math.random() - 0.5) * 6, y: c.y - 10, r: 1 + Math.round(Math.random()), v: 0.5 + Math.random() * 0.4, wob: Math.random() * 6 });
  }, [caretAt]);

  // ─── the loop ───
  useEffect(() => {
    const cv = canvasRef.current;
    const root = rootRef.current;
    if (!cv || !root) return;
    const ctx = cv.getContext("2d")!;
    const low = document.createElement("canvas");
    const lctx = low.getContext("2d", { willReadFrequently: true })!;
    let img: ImageData | null = null;
    const w = world.current;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w.W = root.clientWidth;
      w.H = root.clientHeight;
      cv.width = Math.round(w.W * dpr);
      cv.height = Math.round(w.H * dpr);
      low.width = Math.ceil(w.W / PX);
      low.height = Math.ceil(w.H / PX);
      img = lctx.createImageData(low.width, low.height);
      if (!w.fish.length) w.fish = spawnFish(fishCount, w.W, w.H);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(root);
    let raf = 0;
    let last = performance.now();
    const t0 = last;

    const step = (dt: number, now: number) => {
      const { fish, ptr, caret, gulp, W, H } = w;
      const typing = now - caret.t < 1600;
      const gulping = now - gulp.t < 1400;
      const k = dt * 60;
      for (let i = 0; i < fish.length; i++) {
        const f = fish[i];
        const sp = SPECIES[f.s];
        let ax = 0;
        let ay = 0;
        // school with your own kind
        let cx = 0;
        let cy = 0;
        let avx = 0;
        let avy = 0;
        let n = 0;
        for (let j = 0; j < fish.length; j++) {
          if (i === j) continue;
          const o = fish[j];
          const dx = o.x - f.x;
          const dy = o.y - f.y;
          const d2 = dx * dx + dy * dy;
          const minD = (sp.len + SPECIES[o.s].len) * PX * 0.56;
          if (d2 < minD * minD && d2 > 0.01) {
            const d = Math.sqrt(d2);
            ax -= (dx / d) * (minD - d) * 0.012;
            ay -= (dy / d) * (minD - d) * 0.012;
          }
          if (o.s === f.s && d2 < 70 * 70) {
            cx += o.x;
            cy += o.y;
            avx += o.vx;
            avy += o.vy;
            n++;
          }
        }
        if (n) {
          ax += (cx / n - f.x) * 0.0005 + (avx / n - f.vx) * 0.022;
          ay += (cy / n - f.y) * 0.0005 + (avy / n - f.vy) * 0.022;
        }
        // each kind roams its own slow path round the tank, so the schools spread out
        const ts = now / 1000;
        const hx = W * (0.5 + 0.38 * Math.sin(ts * 0.07 + f.s * 1.9));
        const hy = H * (0.46 + 0.28 * Math.cos(ts * 0.09 + f.s * 2.7));
        ax += (hx - f.x) * 0.00035;
        ay += (hy - f.y) * 0.00035;
        // wander
        f.phase += (0.18 + Math.hypot(f.vx, f.vy) * 0.12) * k;
        ax += Math.sin(now * 0.0007 + i * 1.7) * 0.012;
        ay += Math.cos(now * 0.0009 + i * 2.3) * 0.008;
        // walls, the surface and the sand
        const m = 36;
        if (f.x < m) ax += (m - f.x) * 0.006;
        if (f.x > W - m) ax -= (f.x - (W - m)) * 0.006;
        if (f.y < m) ay += (m - f.y) * 0.006;
        if (f.y > H - m - 30) ay -= (f.y - (H - m - 30)) * 0.008;
        // the pointer frightens them
        if (ptr.on && !gulping) {
          const dx = f.x - ptr.x;
          const dy = f.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < 110 && d > 0.1) {
            const p = (110 - d) / 110;
            ax += (dx / d) * p * 0.6;
            ay += (dy / d) * p * 0.6;
            f.dart = Math.max(f.dart, p);
          }
        }
        // ripples too
        for (const r of w.ripples) {
          const age = (now - r.t0) / 1000;
          if (age > 0.6) continue;
          const dx = f.x - r.x;
          const dy = f.y - r.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 160) {
            ax += (dx / d) * 0.5 * (1 - d / 160);
            ay += (dy / d) * 0.5 * (1 - d / 160);
            f.dart = 1;
          }
        }
        // typing: come and look, but keep a polite distance
        if (typing && !gulping) {
          const dx = caret.x - f.x;
          const dy = caret.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          const want = 46 + (i % 5) * 9;
          const pull = (d - want) * 0.0016 * (1 - (now - caret.t) / 1600);
          ax += (dx / d) * pull;
          ay += (dy / d) * pull;
        }
        // send: everyone swims into the box
        if (gulping) {
          const dx = gulp.x - f.x;
          const dy = gulp.y - f.y;
          const d = Math.hypot(dx, dy) || 1;
          ax += (dx / d) * 0.32;
          ay += (dy / d) * 0.32;
          if (d < 26) f.gone = Math.min(1, f.gone + 0.12 * k);
        } else if (f.gone > 0) {
          f.gone = Math.max(0, f.gone - 0.03 * k);
          if (f.gone > 0.9) {
            // come back in from the side
            f.x = Math.random() < 0.5 ? -20 : W + 20;
            f.y = 40 + Math.random() * (H - 120);
            f.vx = f.x < 0 ? 1 : -1;
          }
        }
        f.dart = Math.max(0, f.dart - 0.02 * k);
        const maxV = (reduced ? 0.6 : 1.25) * sp.speed * (1 + f.dart * 2.2 + (gulping ? 1.6 : 0));
        f.vx += ax * k;
        f.vy += ay * k;
        const v = Math.hypot(f.vx, f.vy);
        const minV = 0.35 * sp.speed;
        if (v > maxV) {
          f.vx *= maxV / v;
          f.vy *= maxV / v;
        } else if (v < minV) {
          f.vx *= minV / Math.max(v, 0.01);
          f.vy *= minV / Math.max(v, 0.01);
        }
        f.vy *= 0.985;
        f.x += f.vx * k;
        f.y += f.vy * k;
      }
      // bubbles rise and wobble
      if (Math.random() < 0.04 * k) w.bubbles.push({ x: W * (0.08 + Math.random() * 0.84), y: H - 20, r: 1 + Math.round(Math.random()), v: 0.35 + Math.random() * 0.4, wob: Math.random() * 6 });
      w.bubbles = w.bubbles.filter((b) => {
        b.y -= b.v * k;
        b.wob += 0.08 * k;
        return b.y > -10;
      });
      w.ripples = w.ripples.filter((r) => now - r.t0 < 1200);
    };

    const draw = (now: number) => {
      if (!img) return;
      const lw = low.width;
      const lh = low.height;
      const d = img.data;
      const t = (now - t0) / 1000;
      // water: a dithered gradient, a soft light from the top and moving caustics
      for (let y = 0; y < lh; y++) {
        const gy = y / lh;
        for (let x = 0; x < lw; x++) {
          const i = (y * lw + x) * 4;
          const c1 = Math.sin(x * 0.21 + t * 0.9 + Math.sin(y * 0.17 + t * 0.6) * 1.6) + Math.sin(y * 0.19 - t * 0.7 + Math.sin(x * 0.13 - t * 0.5) * 1.4);
          const caustic = c1 > 1.25 ? (reduced ? 0.6 : 1) * (1 - gy * 0.7) : 0;
          const rays = Math.max(0, Math.sin((x - y * 0.55) * 0.09 + t * 0.15)) ** 6 * (1 - gy) * 0.5;
          const dither = BAYER[(y & 3) * 4 + (x & 3)] * 0.09;
          const g = clamp(gy + dither);
          const level = Math.round(g * 6) / 6; // posterised into bands
          let r = 168 - 120 * level;
          let gg = 236 - 62 * level;
          let b = 242 - 46 * level;
          const glow = caustic * 0.22 + rays * 0.35;
          r += (255 - r) * glow;
          gg += (255 - gg) * glow;
          b += (255 - b) * glow;
          d[i] = r;
          d[i + 1] = gg;
          d[i + 2] = b;
          d[i + 3] = 255;
        }
      }
      // sand and swaying weed along the bottom
      const sandTop = lh - 6;
      for (let y = sandTop; y < lh; y++)
        for (let x = 0; x < lw; x++) {
          const i = (y * lw + x) * 4;
          const bump = Math.sin(x * 0.3) * 0.8 + Math.sin(x * 0.11) * 1.4;
          if (y < sandTop + 2 + bump) continue;
          const shade = ((x * 7 + y * 13) % 5 === 0 ? 18 : 0) + (y - sandTop) * 3;
          d[i] = 236 - shade;
          d[i + 1] = 214 - shade;
          d[i + 2] = 170 - shade;
        }
      for (let s = 0; s < lw; s += 11) {
        const base = s + ((s * 7) % 5);
        const tall = 8 + ((s * 13) % 9);
        for (let k = 0; k < tall; k++) {
          const x = Math.round(base + Math.sin(t * 1.3 + s + k * 0.35) * (k * 0.12));
          const y = sandTop - k + 2;
          if (x < 0 || x >= lw || y < 0) continue;
          const i = (y * lw + x) * 4;
          const dark = k % 3 === 0;
          d[i] = dark ? 34 : 52;
          d[i + 1] = dark ? 130 : 160;
          d[i + 2] = dark ? 96 : 110;
        }
      }
      // bubbles
      for (const b of w.bubbles) {
        const bx = Math.round((b.x + Math.sin(b.wob) * 3) / PX);
        const by = Math.round(b.y / PX);
        for (let yy = -b.r; yy <= b.r; yy++)
          for (let xx = -b.r; xx <= b.r; xx++) {
            const x = bx + xx;
            const y = by + yy;
            if (x < 0 || y < 0 || x >= lw || y >= lh) continue;
            const r2 = xx * xx + yy * yy;
            if (r2 > b.r * b.r + 0.5) continue;
            const i = (y * lw + x) * 4;
            const rim = r2 >= b.r * b.r - 0.5 || b.r === 1;
            const k = rim ? 0.75 : 0.25;
            d[i] += (255 - d[i]) * k;
            d[i + 1] += (255 - d[i + 1]) * k;
            d[i + 2] += (255 - d[i + 2]) * k;
          }
      }
      // ripples
      for (const r of w.ripples) {
        const age = (now - r.t0) / 1000;
        const rad = (age * 140) / PX;
        const a = 0.6 * (1 - age / 1.2);
        const cx = r.x / PX;
        const cy = r.y / PX;
        const steps = Math.max(12, Math.round(rad * 6));
        for (let s = 0; s < steps; s++) {
          const ang = (s / steps) * Math.PI * 2;
          const x = Math.round(cx + Math.cos(ang) * rad);
          const y = Math.round(cy + Math.sin(ang) * rad * 0.8);
          if (x < 0 || y < 0 || x >= lw || y >= lh) continue;
          const i = (y * lw + x) * 4;
          d[i] += (255 - d[i]) * a;
          d[i + 1] += (255 - d[i + 1]) * a;
          d[i + 2] += (255 - d[i + 2]) * a;
        }
      }
      for (const f of w.fish) paintFish(d, lw, lh, f, t);
      lctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(low, 0, 0, lw * PX * (cv.width / w.W), lh * PX * (cv.height / w.H));
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (inViewRef.current && !document.hidden) {
        step(dt, now);
        draw(now);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [fishCount, reduced]);

  // ─── the pointer in the water ───
  const local = (e: { clientX: number; clientY: number }) => {
    const b = rootRef.current!.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const p = local(e);
    Object.assign(world.current.ptr, { x: p.x, y: p.y, on: true, t: performance.now() });
  };
  const onLeave = () => {
    world.current.ptr.on = false;
  };
  const onWaterDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (formRef.current?.contains(e.target as Node)) return;
    const p = local(e);
    world.current.ripples.push({ x: p.x, y: p.y, t0: performance.now() });
  };

  // ─── sending ───
  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const v = text.trim();
    if (!v) return;
    const b = rootRef.current!.getBoundingClientRect();
    const r = (sendRef.current ?? inputRef.current)!.getBoundingClientRect();
    const fr = formRef.current!.getBoundingClientRect();
    world.current.gulp = { x: (fr.left + fr.right) / 2 - b.left, y: r.top + r.height / 2 - b.top, t: performance.now() };
    setSent({ id: Date.now(), text: v });
    setText("");
    onSubmit?.(v);
  };
  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(null), 2200);
    return () => clearTimeout(t);
  }, [sent]);

  // ─── Autoplay: a ghost finger stirs the water, then types and sends ───
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const gs = useMotionValue(1);
  const go = useMotionValue(0);
  useEffect(() => {
    if (!autoplay || reduced) return;
    const root = rootRef.current;
    if (!root) return;
    let alive = true;
    const running = new Set<AnimationPlaybackControls>();
    const abort = () => {
      if (!alive) return;
      alive = false;
      running.forEach((c) => c.stop());
      world.current.ptr.on = false;
      animate(go, 0, { duration: 0.2 });
    };
    const onTouch = (e: Event) => e.isTrusted && abort();
    root.addEventListener("pointerdown", onTouch, true);
    root.addEventListener("keydown", onTouch, true);
    const wait = (ms: number) =>
      new Promise<void>((res, rej) => {
        let left = ms;
        let lastT = performance.now();
        const tick = () => {
          if (!alive) return rej(STOP);
          const t = performance.now();
          if (inViewRef.current) left -= t - lastT;
          lastT = t;
          if (left <= 0) res();
          else setTimeout(tick, Math.min(60, Math.max(16, left)));
        };
        tick();
      });
    const run = (mv: MotionValue<number>, target: number, duration: number, e: [number, number, number, number] = [0.4, 0, 0.2, 1]) =>
      new Promise<void>((res, rej) => {
        if (!alive) return rej(STOP);
        if (Math.abs(mv.get() - target) < 0.01) return res();
        const c = animate(mv, target, { duration, ease: e, onComplete: () => (running.delete(c), res()) });
        running.add(c);
      });
    const follow = () => Object.assign(world.current.ptr, { x: gx.get(), y: gy.get(), on: go.get() > 0.5, t: performance.now() });
    const offs = [gx.on("change", follow), gy.on("change", follow)];
    const PROMPTS = ["Plan a slow weekend in Lisbon", "Name my new coffee shop", "Explain tides like I'm five"];
    (async () => {
      let n = 0;
      while (alive) {
        await wait(1000);
        const W = root.clientWidth;
        const H = root.clientHeight;
        gx.set(W * 0.12);
        gy.set(H * 0.75);
        await run(go, 1, 0.3);
        // stir the water
        await Promise.all([run(gx, W * 0.42, 1.3, [0.45, 0, 0.55, 1]), run(gy, H * 0.82, 1.3)]);
        await Promise.all([run(gx, W * 0.8, 1.2, [0.45, 0, 0.55, 1]), run(gy, H * 0.3, 1.2)]);
        await run(gs, 0.8, 0.08);
        world.current.ripples.push({ x: gx.get(), y: gy.get(), t0: performance.now() });
        await run(gs, 1, 0.14);
        await wait(700);
        // type
        const ir = inputRef.current!.getBoundingClientRect();
        const b = root.getBoundingClientRect();
        await Promise.all([run(gx, ir.left - b.left + 40, 0.6), run(gy, ir.top - b.top + ir.height / 2, 0.6)]);
        await run(gs, 0.8, 0.08);
        await run(gs, 1, 0.12);
        await run(go, 0, 0.25);
        const p = PROMPTS[n++ % PROMPTS.length];
        for (let i = 1; i <= p.length; i++) {
          await wait(62 + Math.random() * 50);
          setText(p.slice(0, i));
        }
        await wait(900);
        const sr = sendRef.current!.getBoundingClientRect();
        gx.set(sr.left - b.left + sr.width / 2 + 30);
        gy.set(sr.top - b.top + sr.height / 2 + 30);
        await run(go, 1, 0.2);
        await Promise.all([run(gx, sr.left - b.left + sr.width / 2, 0.4), run(gy, sr.top - b.top + sr.height / 2, 0.4)]);
        await run(gs, 0.8, 0.08);
        sendRef.current?.click();
        await run(gs, 1, 0.12);
        await run(go, 0, 0.3);
        await wait(3200);
      }
    })().catch((e) => e !== STOP && console.error(e));
    return () => {
      abort();
      offs.forEach((o) => o());
      root.removeEventListener("pointerdown", onTouch, true);
      root.removeEventListener("keydown", onTouch, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, reduced]);

  // the text field grows the caret effect on its own (it is a controlled input)
  useEffect(() => {
    if (text) requestAnimationFrame(typed);
  }, [text, typed]);

  return (
    <div
      ref={rootRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={onWaterDown}
      className={`relative h-[440px] w-full max-w-[880px] select-none overflow-hidden rounded-[28px] bg-[#7fd3e3] shadow-[0_0_0_1px_rgba(0,0,0,.05),0_24px_48px_-28px_rgba(0,60,80,.55)] sm:h-[460px] ${className}`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full [image-rendering:pixelated]" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5">
        <h3 id={labelId} className="m-0 text-center text-[clamp(26px,4.4vw,40px)] font-light tracking-[-0.03em] text-[#0b4757] [text-shadow:0_1px_0_rgba(255,255,255,.35)]">
          {title}
        </h3>
        <form
          ref={formRef}
          onSubmit={send}
          className="pointer-events-auto relative mt-6 flex w-full max-w-[560px] items-center gap-2 rounded-[22px] border border-white/60 bg-white/45 p-2 pl-5 shadow-[0_18px_40px_-20px_rgba(0,70,90,.55),inset_0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl"
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClick={typed}
            placeholder={placeholder}
            aria-labelledby={labelId}
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-[#06303b] outline-none placeholder:text-[#2c6878]/70"
          />
          <motion.button
            ref={sendRef}
            type="submit"
            disabled={!text.trim()}
            aria-label="Send"
            whileTap={{ scale: 0.9 }}
            animate={{ backgroundColor: text.trim() ? "#0b4757" : "rgba(11,71,87,.25)" }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b4757]"
          >
            <svg viewBox="0 0 56 56" width={17} height={17} aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON.arrow_up }} />
          </motion.button>
          {/* the message floats up out of the box as a bubble, and pops */}
          <AnimatePresence>
            {sent && (
              <motion.div
                key={sent.id}
                aria-live="polite"
                initial={{ y: 0, opacity: 0, scale: 0.6 }}
                animate={{ y: -150, opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 1.15] }}
                transition={{ duration: 2.1, ease: [0.3, 0.1, 0.4, 1], opacity: { times: [0, 0.12, 0.8, 1], duration: 2.1 } }}
                style={{ x: "-50%" }}
                className="pointer-events-none absolute left-1/2 top-0 max-w-[80%] truncate rounded-full border border-white/70 bg-white/40 px-4 py-1.5 text-[14px] text-[#06303b] shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_20px_-10px_rgba(0,70,90,.6)] backdrop-blur-md"
              >
                {sent.text}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        <p className="m-0 mt-3 text-[12.5px] text-[#0b4757]/70">Move through the water, or tap it.</p>
      </div>
      {/* ghost finger for the self-demo */}
      <motion.span
        aria-hidden="true"
        style={{ x: gx, y: gy, scale: gs, opacity: go }}
        className="pointer-events-none absolute left-0 top-0 z-30 -ml-[15px] -mt-[15px] h-[30px] w-[30px] rounded-full border-[1.5px] border-white/90 bg-[#0b4757]/20 shadow-[0_4px_14px_rgba(0,0,0,.18)] backdrop-blur-[2px]"
      />
    </div>
  );
}

