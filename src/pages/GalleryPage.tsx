import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { fetchPublicGallery, galleryPublicUrl } from "@/lib/gallery";
import { BUNDLED_MEDIA } from "@/lib/galleryMedia";
import "./GalleryPage.css";

/**
 * Gallery media loads automatically from src/assets/gallery/.
 *   - Images: .jpg .jpeg .png .webp .avif .gif   (big index number, no caption)
 *   - Videos: .mp4 .webm .mov                     (hover to play with sound; no controls)
 * The animated section is scroll-pinned: while you scroll over it, the cards
 * advance; the page only continues to the footer once every card has been shown.
 */
const COLORS = [
  "#6B5B50", "#566B5E", "#8BA8A8", "#7A6A55",
  "#4F5D63", "#9A8C78", "#5A6B66", "#6E6A82",
];

// How much page-scroll (in vh) advances one card while the section is pinned.
const SCROLL_PER_CARD_VH = 38;
// The sticky offset from the top (clears the fixed nav).
const PIN_TOP = 80;

interface Slide {
  src: string;
  title: string;
  description?: string;
  type: "image" | "video";
  color: string;
}

const debounce = <A extends unknown[]>(func: (...a: A) => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

class GallerySlider {
  root: HTMLElement;
  slides: Slide[];
  current = 0;
  targetIndex = 0;
  animating = false;
  total: number;
  titleEl: HTMLElement;
  descEl: HTMLElement | null;
  imagesEl: HTMLElement;
  slideEls: { el: HTMLElement; step: number }[] = [];
  currentLine: HTMLElement | null = null;
  cursorEl!: HTMLElement;
  cursorVisible = false;
  reducedMotion: boolean;
  cleanups: (() => void)[] = [];
  cursorMoveX!: (v: number) => void;
  cursorMoveY!: (v: number) => void;

  constructor(root: HTMLElement, slides: Slide[]) {
    this.root = root;
    this.slides = slides;
    this.total = slides.length;
    this.titleEl = root.querySelector(".gallery-slider__title")!;
    this.descEl = root.querySelector(".gallery-slider__desc");
    this.imagesEl = root.querySelector(".gallery-slider__images")!;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.setTitle(slides[0].title);
    this.setDesc(0);
    gsap.set(this.root, { backgroundColor: slides[0].color });
    this.buildCarousel();
    this.buildCursor();
    this.bind();
    this.bindScroll();
  }

  mod(n: number) {
    return ((n % this.total) + this.total) % this.total;
  }

  buildCursor() {
    this.cursorEl = document.createElement("div");
    this.cursorEl.className = "gallery-slider__cursor";
    this.cursorEl.textContent = "+";
    this.cursorEl.setAttribute("aria-hidden", "true");
    this.root.appendChild(this.cursorEl);
    gsap.set(this.cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });
    this.cursorMoveX = gsap.quickTo(this.cursorEl, "x", { duration: 0.5, ease: "power3" });
    this.cursorMoveY = gsap.quickTo(this.cursorEl, "y", { duration: 0.5, ease: "power3" });
  }

  setDesc(idx: number) {
    if (this.descEl) this.descEl.textContent = this.slides[idx].description ?? "";
  }

  // Build a line as non-breaking words (wraps at spaces, not mid-word), with
  // each character in its own span for the stagger animation.
  fillLine(container: HTMLElement, text: string) {
    const words = text.split(" ");
    words.forEach((word, wi) => {
      const wordEl = document.createElement("span");
      wordEl.className = "gword";
      [...word].forEach((ch) => {
        const c = document.createElement("span");
        c.className = "gchar";
        c.textContent = ch;
        wordEl.appendChild(c);
      });
      container.appendChild(wordEl);
      if (wi < words.length - 1) container.appendChild(document.createTextNode(" "));
    });
  }

  setTitle(text: string) {
    this.titleEl.innerHTML = "";
    const line = document.createElement("div");
    this.fillLine(line, text);
    this.titleEl.appendChild(line);
    this.currentLine = line;
  }

  animateTitle(newText: string, direction: "next" | "prev") {
    const h = this.titleEl.offsetHeight;
    const dir = direction === "next" ? 1 : -1;
    const oldLine = this.currentLine!;
    const oldChars = [...oldLine.querySelectorAll(".gchar")];

    this.titleEl.style.height = h + "px";
    oldLine.style.cssText = "position:absolute;top:0;left:0;width:100%";

    const newLine = document.createElement("div");
    newLine.style.cssText = "position:absolute;top:0;left:0;width:100%";
    this.fillLine(newLine, newText);
    this.titleEl.appendChild(newLine);

    const newChars = [...newLine.querySelectorAll(".gchar")];
    gsap.set(newChars, { y: h * dir });

    const duration = this.reducedMotion ? 0.01 : 0.45;
    const stagger = this.reducedMotion ? 0 : 0.025;

    const tl = gsap.timeline({
      onComplete: () => {
        oldLine.remove();
        newLine.style.cssText = "";
        gsap.set(newChars, { clearProps: "all" });
        this.titleEl.style.height = "";
        this.currentLine = newLine;
      },
    });
    tl.to(oldChars, { y: -h * dir, stagger, duration, ease: "expo.inOut" }, 0);
    tl.to(newChars, { y: 0, stagger, duration, ease: "expo.inOut" }, 0);
    return tl;
  }

  makeSlide(idx: number) {
    const item = this.slides[idx];
    const div = document.createElement("div");
    div.className = "gallery-slider__slide";

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.muted = false;
      video.addEventListener(
        "loadedmetadata",
        () => {
          try {
            if (video.currentTime === 0) video.currentTime = 0.1;
          } catch {
            /* ignore */
          }
        },
        { once: true }
      );
      div.appendChild(video);

      div.style.cursor = "pointer";
      const playWithSound = () => {
        video.muted = false;
        video.play().catch(() => undefined);
      };
      const pauseVideo = () => video.pause();
      div.addEventListener("mouseenter", playWithSound);
      div.addEventListener("mouseleave", pauseVideo);
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) playWithSound();
        else pauseVideo();
      });
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "";
      img.loading = "lazy";
      img.draggable = false;
      div.appendChild(img);
    }
    return div;
  }

  getSlideProps(step: number) {
    const h = this.imagesEl.offsetHeight;
    const absStep = Math.abs(step);
    // Center card stays full-size; background cards smaller and tucked closer in.
    const positions = [
      { x: -0.24, y: -0.66, rot: -20, s: 0.7, b: 16, o: 0 },
      { x: -0.12, y: -0.36, rot: -10, s: 0.72, b: 8, o: 0.5 },
      { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },
      { x: -0.05, y: 0.36, rot: 10, s: 0.6, b: 6, o: 0.5 },
      { x: -0.08, y: 0.66, rot: 20, s: 0.45, b: 14, o: 0 },
    ];
    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];
    return {
      x: p.x * h,
      y: p.y * h,
      rotation: p.rot,
      scale: p.s,
      blur: p.b,
      opacity: p.o,
      zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1,
    };
  }

  positionSlide(slide: HTMLElement, step: number) {
    const props = this.getSlideProps(step);
    gsap.set(slide, {
      xPercent: -50,
      yPercent: -50,
      x: props.x,
      y: props.y,
      rotation: props.rotation,
      scale: props.scale,
      opacity: props.opacity,
      filter: "blur(" + props.blur + "px)",
      zIndex: props.zIndex,
    });
  }

  buildCarousel() {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return;
    this.imagesEl.innerHTML = "";
    this.slideEls = [];
    const span = this.total <= 1 ? 0 : 1;
    for (let step = -span; step <= span; step++) {
      const idx = this.mod(this.current + step);
      const slide = this.makeSlide(idx);
      this.imagesEl.appendChild(slide);
      this.positionSlide(slide, step);
      this.slideEls.push({ el: slide, step });
    }
  }

  animateCarousel(direction: "next" | "prev") {
    if (!this.imagesEl || this.imagesEl.offsetHeight === 0) return gsap.timeline();

    const shift = direction === "next" ? -1 : 1;
    const enterStep = direction === "next" ? 2 : -2;
    const newIdx =
      direction === "next" ? this.mod(this.current + 2) : this.mod(this.current - 2);

    const newSlide = this.makeSlide(newIdx);
    this.imagesEl.appendChild(newSlide);
    this.positionSlide(newSlide, enterStep);
    this.slideEls.push({ el: newSlide, step: enterStep });

    this.slideEls.forEach((s) => (s.step += shift));

    const duration = this.reducedMotion ? 0.01 : 0.5;
    const tl = gsap.timeline({
      onComplete: () => {
        this.slideEls = this.slideEls.filter((s) => {
          if (Math.abs(s.step) >= 2) {
            s.el.remove();
            return false;
          }
          return true;
        });
      },
    });

    this.slideEls.forEach((s) => {
      const props = this.getSlideProps(s.step);
      s.el.style.zIndex = String(props.zIndex);
      tl.to(
        s.el,
        {
          x: props.x,
          y: props.y,
          rotation: props.rotation,
          scale: props.scale,
          opacity: props.opacity,
          filter: "blur(" + props.blur + "px)",
          duration,
          ease: "power3.inOut",
        },
        0
      );
    });
    return tl;
  }

  go(direction: "next" | "prev") {
    if (this.animating || this.total <= 1) return;
    this.animating = true;

    const nextIdx =
      direction === "next" ? this.mod(this.current + 1) : this.mod(this.current - 1);

    this.setDesc(nextIdx);

    const master = gsap.timeline({
      onComplete: () => {
        this.current = nextIdx;
        this.animating = false;
        this.advanceToTarget(); // keep stepping toward the scroll target
      },
    });
    master.to(
      this.root,
      {
        backgroundColor: this.slides[nextIdx].color,
        duration: this.reducedMotion ? 0.01 : 0.5,
        ease: "power2.inOut",
      },
      0
    );
    master.add(this.animateTitle(this.slides[nextIdx].title, direction), 0);
    master.add(this.animateCarousel(direction), 0);
  }

  // Scroll mapping → snap toward a target card index
  setTarget(idx: number) {
    const clamped = Math.max(0, Math.min(this.total - 1, idx));
    if (clamped === this.targetIndex) return;
    this.targetIndex = clamped;
    this.advanceToTarget();
  }

  // Snap straight to a card (no per-step animation) — used for fast scroll jumps
  jumpTo(index: number) {
    const idx = Math.max(0, Math.min(this.total - 1, index));
    this.current = idx;
    this.targetIndex = idx;
    this.setTitle(this.slides[idx].title);
    this.setDesc(idx);
    gsap.set(this.root, { backgroundColor: this.slides[idx].color });
    this.buildCarousel();
  }

  advanceToTarget() {
    if (this.animating) return;
    const diff = this.targetIndex - this.current;
    if (diff === 0) return;
    // One card away → animate the transition; further → snap instantly to keep up with scroll
    if (Math.abs(diff) > 1) {
      this.jumpTo(this.targetIndex);
      return;
    }
    this.go(diff > 0 ? "next" : "prev");
  }

  bind() {
    // Left/Right arrows step manually. Wheel/touch are NOT hijacked — the page
    // scrolls, and that scroll is what drives the cards (see bindScroll).
    const onKey = (e: KeyboardEvent) => {
      if (this.animating) return;
      if (e.key === "ArrowRight") this.setTarget(this.current + 1);
      if (e.key === "ArrowLeft") this.setTarget(this.current - 1);
    };
    window.addEventListener("keydown", onKey);
    this.cleanups.push(() => window.removeEventListener("keydown", onKey));

    const onMove = (e: MouseEvent) => {
      if (!this.cursorVisible) {
        gsap.to(this.cursorEl, { opacity: 1, duration: 0.3 });
        this.cursorVisible = true;
      }
      this.cursorMoveX(e.clientX);
      this.cursorMoveY(e.clientY);
    };
    this.root.addEventListener("mousemove", onMove, { passive: true });
    this.cleanups.push(() => this.root.removeEventListener("mousemove", onMove));

    const onLeave = () => {
      gsap.to(this.cursorEl, { opacity: 0, duration: 0.3 });
      this.cursorVisible = false;
    };
    this.root.addEventListener("mouseleave", onLeave);
    this.cleanups.push(() => this.root.removeEventListener("mouseleave", onLeave));

    const onResize = debounce(() => {
      if (!this.animating && this.imagesEl.offsetHeight > 0) {
        this.slideEls.forEach((s) => this.positionSlide(s.el, s.step));
      }
    }, 300);
    window.addEventListener("resize", onResize, { passive: true });
    this.cleanups.push(() => window.removeEventListener("resize", onResize));
  }

  bindScroll() {
    const container = this.root.parentElement; // .container
    const pin = container?.parentElement; // .gallery-pin
    const wrap = pin?.parentElement; // .gallery-scroll
    if (!pin || !wrap) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const pinHeight = window.innerHeight - PIN_TOP;
      const dist = wrap.offsetHeight - pinHeight;
      if (dist <= 0) return;
      const wrapTop = wrap.getBoundingClientRect().top;
      const past = PIN_TOP - wrapTop;

      // JS pin: before → in flow at top; during → fixed to viewport; after → rest at wrap bottom
      if (past <= 0) {
        pin.style.position = "relative";
        pin.style.top = "";
        pin.style.left = "";
        pin.style.right = "";
      } else if (past >= dist) {
        pin.style.position = "absolute";
        pin.style.top = dist + "px";
        pin.style.left = "0";
        pin.style.right = "0";
      } else {
        pin.style.position = "fixed";
        pin.style.top = PIN_TOP + "px";
        pin.style.left = "0";
        pin.style.right = "0";
      }

      const progress = Math.min(Math.max(past / dist, 0), 1);
      this.setTarget(Math.round(progress * (this.total - 1)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    this.cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
    update();
  }

  destroy() {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    gsap.killTweensOf(this.cursorEl);
    this.slideEls.forEach((s) => {
      gsap.killTweensOf(s.el);
      s.el.remove();
    });
    this.slideEls = [];
    this.cursorEl?.remove();
    this.imagesEl.innerHTML = "";
  }
}

const GalleryPage = () => {
  const rootRef = useRef<HTMLElement>(null);

  const localSlides = useMemo<Slide[]>(
    () =>
      BUNDLED_MEDIA.map((m, i) => ({
        src: m.src,
        title: m.title,
        description: m.description,
        type: m.type,
        color: COLORS[i % COLORS.length],
      })),
    []
  );

  // Admin-managed gallery comes from the database; fall back to bundled media until populated.
  const [slides, setSlides] = useState<Slide[]>(localSlides);
  useEffect(() => {
    let cancelled = false;
    fetchPublicGallery()
      .then((items) => {
        if (cancelled || items.length === 0) return;
        setSlides(
          items.map((item, i) => ({
            src: galleryPublicUrl(item.media_path),
            title:
              item.title ||
              (item.media_type === "video" ? "VIDEO" : String(i + 1).padStart(2, "0")),
            description: item.description ?? undefined,
            type: item.media_type,
            color: COLORS[i % COLORS.length],
          }))
        );
      })
      .catch(() => {
        /* gallery_items table/bucket not set up yet — keep the local fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || slides.length === 0) return;
    const raf = requestAnimationFrame(() => {
      const slider = new GallerySlider(rootRef.current!, slides);
      (rootRef.current as unknown as { __slider?: GallerySlider }).__slider = slider;
    });
    return () => {
      cancelAnimationFrame(raf);
      const node = rootRef.current as unknown as { __slider?: GallerySlider } | null;
      node?.__slider?.destroy();
      if (node) node.__slider = undefined;
    };
  }, [slides]);

  // Scroll distance that the pinned section consumes before releasing to the footer
  const scrollWrapHeight = `calc(100vh + ${Math.max(0, slides.length - 1) * SCROLL_PER_CARD_VH}vh)`;

  return (
    <>
      <Helmet>
        <title>Gallery | SS. Tharan - Mechatronics Design Engineer</title>
        <meta
          name="description"
          content="An animated stacked-card gallery showcasing engineering, CAD, simulation, and robotics highlights by SS. Tharan."
        />
      </Helmet>

      <div className="min-h-screen bg-background transition-colors duration-300">
        <main className="pt-24 sm:pt-28">
          {/* Header */}
          <div className="container mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12">
            <span className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 block">
              Latest Gallery
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5">
              Photos &amp; Videos
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              A few moments from the things I design and build — robotics, CAD, simulation,
              and the ideas in between. Hover any video to bring it to life.
            </p>
          </div>

          {/* Scroll-pinned animated gallery (centered, with left/right gaps) */}
          {slides.length === 0 ? (
            <div className="container mx-auto px-4 sm:px-6 pb-16 flex items-center justify-center text-center text-muted-foreground">
              <p className="text-sm sm:text-base">
                No media yet. Add images or videos to{" "}
                <code className="px-1.5 py-0.5 bg-secondary border border-border text-foreground text-xs">
                  src/assets/gallery/
                </code>
              </p>
            </div>
          ) : (
            <div className="gallery-scroll" style={{ height: scrollWrapHeight }}>
              <div className="gallery-pin">
                <div className="container mx-auto px-4 sm:px-6">
                  <section ref={rootRef} className="gallery-slider" aria-roledescription="carousel">
                    <div className="gallery-slider__body">
                      <div className="gallery-slider__left">
                        <h2 className="gallery-slider__title" aria-live="polite" />
                        <p className="gallery-slider__desc" />
                        <p className="gallery-slider__hint">
                          SCROLL TO BROWSE · HOVER A VIDEO TO PLAY
                        </p>
                      </div>
                      <div className="gallery-slider__right">
                        <div className="gallery-slider__images" />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default GalleryPage;
