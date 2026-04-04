import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
}

const Orb = ({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
}: OrbProps) => {
  const ctnDom = useRef<HTMLDivElement>(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform float uBurst;
    uniform float uBurstX;
    uniform float uBurstY;
    uniform float uScroll;
    varying vec2 vUv;

    // ---- Simplex 3D Noise ----
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod(i,289.0);
      vec4 p=permute(permute(permute(
        i.z+vec4(0.0,i1.z,i2.z,1.0))
        +i.y+vec4(0.0,i1.y,i2.y,1.0))
        +i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=1.0/7.0;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    // FBM (fractal brownian motion)
    float fbm(vec3 p) {
      float f = 0.0;
      f += 0.5000 * snoise(p); p *= 2.01;
      f += 0.2500 * snoise(p); p *= 2.02;
      f += 0.1250 * snoise(p); p *= 2.03;
      f += 0.0625 * snoise(p);
      return f;
    }

    // Neon palette
    vec3 neonPalette(float t) {
      vec3 blue   = vec3(0.1, 0.3, 1.0);
      vec3 purple = vec3(0.5, 0.1, 0.9);
      vec3 cyan   = vec3(0.0, 0.8, 0.9);
      vec3 col = mix(blue, purple, smoothstep(0.0, 0.5, t));
      col = mix(col, cyan, smoothstep(0.5, 1.0, t));
      return col;
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
      float t = iTime;

      // Mouse in UV space
      vec2 mouse = (uMouse - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);

      // ---- Fluid noise field ----
      vec3 p = vec3(uv * 2.0, t * 0.15);
      
      // Mouse gravity distortion
      vec2 diff = uv - mouse;
      float dist = length(diff);
      float gravity = uHover * 0.4 / (dist * 4.0 + 0.3);
      vec2 gravityOffset = normalize(diff + 0.001) * gravity * 0.15;
      p.xy -= gravityOffset;

      // Scroll modulation
      p.z += uScroll * 2.0;
      float scrollWarp = uScroll * 0.3;

      // Multi-layer fluid
      float n1 = fbm(p + vec3(0.0, 0.0, t * 0.1));
      float n2 = fbm(p * 1.5 + vec3(t * 0.08, -t * 0.05, 0.0));
      float n3 = snoise(vec3(uv * 4.0 + n1 * 0.5, t * 0.2));
      
      // Combine layers
      float field = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      field = field * 0.5 + 0.5; // normalize to 0-1

      // Color from palette
      float colorT = field + t * 0.05;
      vec3 col = neonPalette(fract(colorT));
      
      // Intensity modulation
      float intensity = smoothstep(-0.2, 0.6, field);
      intensity *= 0.6 + 0.4 * sin(field * 6.28 + t);
      col *= intensity * 0.7;

      // ---- Energy veins / flow lines ----
      float veins = abs(sin(field * 12.0 + t * 0.5));
      veins = pow(veins, 8.0);
      vec3 veinColor = neonPalette(fract(field * 2.0 + 0.3)) * 1.5;
      col += veinColor * veins * 0.4;

      // ---- Mouse glow / magnetic field ----
      float mouseGlow = exp(-dist * dist * 8.0) * uHover;
      vec3 glowCol = mix(vec3(0.2, 0.5, 1.0), vec3(0.6, 0.2, 1.0), sin(t) * 0.5 + 0.5);
      col += glowCol * mouseGlow * 0.8;
      
      // Magnetic rings around cursor
      float ring1 = abs(dist - 0.15 - sin(t * 2.0) * 0.03);
      float ring2 = abs(dist - 0.25 - cos(t * 1.5) * 0.04);
      col += glowCol * exp(-ring1 * 60.0) * uHover * 0.5;
      col += glowCol * 0.7 * exp(-ring2 * 40.0) * uHover * 0.3;

      // ---- Click burst / ripple ----
      if (uBurst > 0.01) {
        vec2 burstCenter = vec2(uBurstX, uBurstY);
        burstCenter = (burstCenter - 0.5) * vec2(iResolution.x / iResolution.y, 1.0);
        float bd = length(uv - burstCenter);
        float expansion = (1.0 - uBurst) * 1.5;
        float ripple = sin(bd * 40.0 - expansion * 20.0) * exp(-bd * 5.0) * uBurst;
        col += vec3(0.3, 0.6, 1.0) * ripple * 2.0;
        col += vec3(0.5, 0.2, 1.0) * exp(-bd * 3.0) * uBurst * 0.5;
      }

      // ---- Particle sparkles ----
      for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float px = sin(fi * 127.1 + t * 0.1 * sin(fi * 0.3)) * 0.8;
        float py = cos(fi * 311.7 + t * 0.08 * cos(fi * 0.5)) * 0.5;
        vec2 pp = vec2(px, py);
        
        // Particles attracted to mouse
        vec2 toMouse = mouse - pp;
        pp += toMouse * uHover * 0.1 * exp(-length(toMouse) * 2.0);
        
        float pd = length(uv - pp);
        float sparkle = exp(-pd * pd * 800.0);
        float flicker = 0.5 + 0.5 * sin(t * (3.0 + fi * 0.5) + fi * 42.0);
        vec3 pCol = neonPalette(fract(fi * 0.13 + t * 0.02));
        col += pCol * sparkle * flicker * 0.8;
      }

      // ---- Bloom / soft glow ----
      // Fake bloom by brightening hot spots
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 bloom = col * smoothstep(0.3, 1.0, lum) * 0.5;
      col += bloom;

      // ---- Vignette ----
      float vig = 1.0 - dot(uv * 0.8, uv * 0.8);
      vig = smoothstep(0.0, 1.0, vig);
      col *= vig;

      // ---- Depth fog / atmosphere ----
      float fog = smoothstep(1.2, 0.0, length(uv));
      col *= 0.3 + fog * 0.7;

      // Additive blending feel — clamp but allow brightness
      col = pow(col, vec3(0.9));
      col = clamp(col, 0.0, 1.0);

      // Dark base
      vec3 bg = vec3(0.01, 0.01, 0.03);
      float bgMix = smoothstep(0.8, 0.0, length(uv));
      col = mix(bg, col, max(bgMix, 0.15));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, 1) },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uBurst: { value: 0 },
        uBurstX: { value: 0.5 },
        uBurstY: { value: 0.5 },
        uScroll: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w * dpr, h * dpr);
      gl.canvas.style.width = w + "px";
      gl.canvas.style.height = h + "px";
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 1);
    }

    window.addEventListener("resize", resize);
    resize();

    let targetMouse = { x: 0.5, y: 0.5 };
    let smoothMouseX = 0.5;
    let smoothMouseY = 0.5;
    let targetHover = 0;
    let burstValue = 0;
    let scrollProgress = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetHover = 1;
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      program.uniforms.uBurstX.value = (e.clientX - rect.left) / rect.width;
      program.uniforms.uBurstY.value = 1.0 - (e.clientY - rect.top) / rect.height;
      burstValue = 1.0;
    };

    const handleScroll = () => {
      const section = container.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let rafId: number;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      const time = t * 0.001;

      program.uniforms.iTime.value = time;

      // Smooth mouse interpolation
      smoothMouseX += (targetMouse.x - smoothMouseX) * 0.06;
      smoothMouseY += (targetMouse.y - smoothMouseY) * 0.06;
      program.uniforms.uMouse.value = [smoothMouseX, smoothMouseY];

      // Smooth hover
      const currentHover = program.uniforms.uHover.value as number;
      program.uniforms.uHover.value = currentHover + (targetHover - currentHover) * 0.05;

      // Burst decay
      burstValue *= 0.97;
      if (burstValue < 0.005) burstValue = 0;
      program.uniforms.uBurst.value = burstValue;

      // Scroll
      const currentScroll = program.uniforms.uScroll.value as number;
      program.uniforms.uScroll.value = currentScroll + (scrollProgress - currentScroll) * 0.05;

      renderer.render({ scene: mesh });
      lastTime = t;
    };

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={ctnDom} className="absolute inset-0 w-full h-full" />;
};

export default Orb;
