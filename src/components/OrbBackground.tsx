import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
}

const MAX_TRAIL = 12;

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
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float burst;
    uniform float breath;
    uniform float shake;
    uniform float scrollSquash;
    uniform vec2 trailPos[${MAX_TRAIL}];
    uniform float trailAlpha[${MAX_TRAIL}];
    uniform float squareness;
    uniform vec2 mouseDir;
    varying vec2 vUv;

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y, p3.x + p3.z, p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 silverColor1 = vec3(0.95, 0.95, 1.0);
    const vec3 silverColor2 = vec3(0.75, 0.78, 0.85);
    const vec3 silverColor3 = vec3(0.15, 0.16, 0.22);
    const vec3 blueColor1 = vec3(0.7, 0.85, 1.0);
    const vec3 blueColor2 = vec3(0.3, 0.5, 0.9);
    const vec3 blueColor3 = vec3(0.08, 0.12, 0.28);
    const float baseInnerRadius = 1.0;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    float ring(float len, float center, float width, float intensity) {
      return intensity * exp(-pow((len - center) / width, 2.0));
    }

    vec4 draw(vec2 uv, float hoverVal, float burstVal, float breathVal) {
      float ang = atan(uv.y, uv.x);
      // Always square base (p=20), hover makes it even sharper
      float p = 20.0 + squareness * 30.0;
      float len = pow(pow(abs(uv.x), p) + pow(abs(uv.y), p), 1.0 / p);
      float circleLen = length(uv);
      float invLen = circleLen > 0.0 ? 1.0 / circleLen : 0.0;

      float breathPulse = breathVal * 0.04;
      float noiseScale = 0.65 + hoverVal * 1.8;
      float innerRadius = baseInnerRadius + hoverVal * 0.15 + burstVal * 0.3 + breathPulse;

      float timeSpeed = 0.5 + hoverVal * 2.0;
      float n0 = snoise3(vec3(uv * noiseScale, iTime * timeSpeed)) * 0.5 + 0.5;
      float n1 = snoise3(vec3(uv * noiseScale * 2.0, iTime * 0.8 + 10.0)) * 0.5 + 0.5;
      n0 = mix(n0, n0 * n1, hoverVal * 0.7);

      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);

      r0 += hoverVal * 0.15 * sin(ang * (3.0 + hoverVal * 6.0) + iTime * 3.0);
      r0 += hoverVal * 0.08 * cos(ang * 7.0 - iTime * 2.0);

      float ringGlow = 0.0;
      if (burstVal > 0.01) {
        float expansion = (1.0 - burstVal) * 2.5;
        ringGlow += ring(len, expansion * 0.6, 0.06 + burstVal * 0.1, burstVal * 1.2);
        ringGlow += ring(len, expansion * 0.4, 0.04 + burstVal * 0.08, burstVal * 0.7);
        ringGlow += ring(len, expansion * 0.2, 0.03 + burstVal * 0.05, burstVal * 0.4);
        r0 += burstVal * 0.12 * sin(len * 40.0 - (1.0 - burstVal) * 20.0);
      }

      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      v0 += breathVal * 0.08 * smoothstep(r0 + 0.1, r0, len);

      float cl = cos(ang + iTime * (2.0 + hoverVal * 3.0)) * 0.5 + 0.5;

      float a = iTime * (-1.0 - hoverVal * 2.0);
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5 + hoverVal * 1.0, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);

      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

      vec3 c1 = mix(silverColor1, blueColor1, hoverVal);
      vec3 c2 = mix(silverColor2, blueColor2, hoverVal);
      vec3 c3 = mix(silverColor3, blueColor3, hoverVal);
      vec3 col = mix(c1, c2, cl);
      col = mix(c3, col, v0);
      col = (col + v1) * v2 * v3;

      // Bloom glow — intensifies with hover (blue shift)
      vec3 bloomColor = mix(vec3(0.6, 0.65, 0.7), vec3(0.3, 0.5, 1.0), hoverVal);
      float bloomBase = exp(-len * len * 2.5) * (0.08 + hoverVal * 0.35);
      float bloomOuter = exp(-len * len * 0.8) * hoverVal * 0.15;
      col += bloomColor * (bloomBase + bloomOuter);

      col += burstVal * 0.6 * exp(-len * 3.0);
      col += vec3(ringGlow);

      // Particle trail dots
      for (int idx = 0; idx < ${MAX_TRAIL}; idx++) {
        float ta = trailAlpha[idx];
        if (ta > 0.01) {
          float pd = distance(uv, trailPos[idx]);
          float ps = 0.012 + float(idx) * 0.002;
          col += vec3(ta * 0.6 * exp(-pd * pd / (ps * ps)));
        }
      }

      col = clamp(col, 0.0, 1.0);
      return extractAlpha(col);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;

      uv.x += shake * 0.015 * sin(iTime * 60.0);
      uv.y += shake * 0.015 * cos(iTime * 73.0);

      // Scroll squash/stretch
      uv.y *= 1.0 + scrollSquash * 0.3;
      uv.x *= 1.0 - scrollSquash * 0.1;

      // No rotation — square stays axis-aligned

      float distAmt = hover * hoverIntensity;
      uv.x += distAmt * 0.3 * sin(uv.y * 12.0 + iTime * 2.0);
      uv.y += distAmt * 0.3 * cos(uv.x * 12.0 + iTime * 2.0);
      uv.x += distAmt * 0.15 * snoise3(vec3(uv * 3.0, iTime * 1.5));
      uv.y += distAmt * 0.15 * snoise3(vec3(uv * 3.0 + 50.0, iTime * 1.5));

      return draw(uv, hover, burst, breath);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    // Trail data
    const trailPositions = new Float32Array(MAX_TRAIL * 2);
    const trailAlphas = new Float32Array(MAX_TRAIL);
    let trailIndex = 0;
    let trailTimer = 0;
    let mouseUV = { x: 0, y: 0 };
    let mouseInOrb = false;

    const geometry = new Triangle(gl);

    const trailPosUniforms: Record<string, { value: number[] }> = {};
    const trailAlphaUniforms: Record<string, { value: number }> = {};
    for (let i = 0; i < MAX_TRAIL; i++) {
      trailPosUniforms[`trailPos[${i}]`] = { value: [0, 0] };
      trailAlphaUniforms[`trailAlpha[${i}]`] = { value: 0 };
    }

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        hue: { value: hue },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: hoverIntensity },
        burst: { value: 0 },
        breath: { value: 0 },
        shake: { value: 0 },
        scrollSquash: { value: 0 },
        squareness: { value: 0 },
        mouseDir: { value: [0, 0] },
        ...trailPosUniforms,
        ...trailAlphaUniforms,
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + "px";
      gl.canvas.style.height = height + "px";
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }

    window.addEventListener("resize", resize);
    resize();

    let targetHover = 0;
    let lastTime = 0;
    let currentRot = 0;
    let burstValue = 0;
    let shakeValue = 0;
    let scrollProgress = 0;
    const rotationSpeed = 0.3;

    let targetSquareness = 0;
    let mouseDirTarget = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.min(rect.width, rect.height);
      const uvX = ((x - rect.width / 2) / size) * 2.0;
      const uvY = ((y - rect.height / 2) / size) * 2.0;
      mouseUV = { x: uvX, y: -uvY };
      // Entire container is hover area
      const dist = Math.sqrt(uvX * uvX + uvY * uvY);
      mouseInOrb = true;
      targetHover = Math.max(0.15, 1.0 - dist * 0.35);
      // Squareness: how close the mouse is to edges
      const edgeX = Math.abs(x - rect.width / 2) / (rect.width / 2);
      const edgeY = Math.abs(y - rect.height / 2) / (rect.height / 2);
      targetSquareness = Math.max(edgeX, edgeY);
      targetSquareness = Math.pow(targetSquareness, 1.5); // ease in
      mouseDirTarget = { x: uvX * 0.5, y: -uvY * 0.5 };
    };

    const handleMouseLeave = () => {
      targetHover = 0;
      mouseInOrb = false;
      targetSquareness = 0;
      mouseDirTarget = { x: 0, y: 0 };
    };

    const handleClick = () => {
      burstValue = 1.0;
      shakeValue = 1.0;
    };

    const handleScroll = () => {
      const section = container.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      scrollProgress = progress;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    let rafId: number;
    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      const time = t * 0.001;
      program.uniforms.iTime.value = time;
      program.uniforms.hue.value = hue;
      program.uniforms.hoverIntensity.value = hoverIntensity;

      const effectiveHover = forceHoverState ? 1 : targetHover;
      program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.08;

      burstValue *= 0.96;
      shakeValue *= 0.92;
      if (burstValue < 0.005) burstValue = 0;
      if (shakeValue < 0.005) shakeValue = 0;
      program.uniforms.burst.value = burstValue;
      program.uniforms.shake.value = shakeValue;

      program.uniforms.breath.value = Math.sin(time * 1.6) * 0.5 + 0.5;

      // Smooth scroll squash
      const currentSquash = program.uniforms.scrollSquash.value as number;
      program.uniforms.scrollSquash.value = currentSquash + (scrollProgress - currentSquash) * 0.05;

      // Smooth squareness transition
      const currentSq = program.uniforms.squareness.value as number;
      program.uniforms.squareness.value = currentSq + (targetSquareness - currentSq) * 0.06;
      const currentDir = program.uniforms.mouseDir.value as number[];
      program.uniforms.mouseDir.value = [
        currentDir[0] + (mouseDirTarget.x - currentDir[0]) * 0.06,
        currentDir[1] + (mouseDirTarget.y - currentDir[1]) * 0.06,
      ];

      // Particle trail — spawn every ~50ms when mouse is inside orb
      trailTimer += dt;
      if (mouseInOrb && trailTimer > 0.05) {
        trailTimer = 0;
        const idx = trailIndex % MAX_TRAIL;
        trailPositions[idx * 2] = mouseUV.x;
        trailPositions[idx * 2 + 1] = mouseUV.y;
        trailAlphas[idx] = 1.0;
        trailIndex++;
      }

      // Decay trail alphas and update uniforms
      for (let i = 0; i < MAX_TRAIL; i++) {
        trailAlphas[i] *= 0.94;
        if (trailAlphas[i] < 0.01) trailAlphas[i] = 0;
        program.uniforms[`trailPos[${i}]`].value = [trailPositions[i * 2], trailPositions[i * 2 + 1]];
        program.uniforms[`trailAlpha[${i}]`].value = trailAlphas[i];
      }

      if (rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      program.uniforms.rot.value = currentRot;
      renderer.render({ scene: mesh });
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
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return <div ref={ctnDom} className="absolute inset-0 w-full h-full" />;
};

export default Orb;
