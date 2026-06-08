"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, Suspense, useEffect } from "react";
import * as THREE from "three";

/**
 * Black Swan scan carousel.
 *
 * Adapted from React Bits Pro "hero-7" (3D rotating carousel + glow scan bar +
 * particles). Instead of stock photos, each plane is a content card rendered to
 * a <canvas>. A dual-texture shader shows the *raw* content on the unscanned
 * (left) side of the glow bar and the *analyzed* version — misogynistic phrases
 * highlighted, with a risk badge + confidence — on the scanned (right) side.
 * The glow bar is the Black Swan risk scanner resolving harm in real time.
 */

type Band = "Elevated" | "Severe" | "Critical";

type ContentCard = {
  source: string;
  text: string;
  flagged: string[];
  category: string;
  band: Band;
  score: number;
  confidence: number;
};

const BAND_COLORS: Record<Band, string> = {
  Elevated: "#E6A6C7", // blush
  Severe: "#B567E0", // mulberry-violet
  Critical: "#A06BFF", // electric violet
};

const CARDS: ContentCard[] = [
  {
    source: "Reply",
    text: "Leadership really isn't a woman's strong suit.",
    flagged: ["isn't a woman's strong suit"],
    category: "Gendered contempt",
    band: "Severe",
    score: 78,
    confidence: 0.94,
  },
  {
    source: "Comment",
    text: "Calm down, you're just being emotional again.",
    flagged: ["being emotional"],
    category: "Coded misogyny",
    band: "Elevated",
    score: 58,
    confidence: 0.88,
  },
  {
    source: "Forum post",
    text: "Nobody asked for her opinion here.",
    flagged: ["Nobody asked for her opinion"],
    category: "Targeted harassment",
    band: "Severe",
    score: 74,
    confidence: 0.91,
  },
  {
    source: "Reply",
    text: "She only got promoted because of how she looks.",
    flagged: ["because of how she looks"],
    category: "Sexualized hostility",
    band: "Elevated",
    score: 56,
    confidence: 0.86,
  },
  {
    source: "Direct message",
    text: "You'd be prettier if you smiled and talked less.",
    flagged: ["smiled and talked less"],
    category: "Gendered contempt",
    band: "Elevated",
    score: 52,
    confidence: 0.83,
  },
  {
    source: "Model output",
    text: "Nurses are women and engineers are men.",
    flagged: ["Nurses are women and engineers are men"],
    category: "Dataset bias",
    band: "Elevated",
    score: 49,
    confidence: 0.8,
  },
  {
    source: "Comment",
    text: "Typical female logic, honestly.",
    flagged: ["Typical female logic"],
    category: "Coded misogyny",
    band: "Severe",
    score: 71,
    confidence: 0.9,
  },
];

const TEX_W = 1200;
const TEX_H = 800;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

type LaidWord = {
  word: string;
  x: number;
  width: number;
  flagged: boolean;
};

function layoutBody(
  ctx: CanvasRenderingContext2D,
  card: ContentCard,
  maxWidth: number,
  startX: number,
) {
  // Tokenize while tracking character offsets so we can map words to flags.
  const parts = card.text.split(/(\s+)/);
  const tokens: { word: string; start: number; end: number }[] = [];
  let idx = 0;
  for (const p of parts) {
    if (p.trim() === "") {
      idx += p.length;
      continue;
    }
    tokens.push({ word: p, start: idx, end: idx + p.length });
    idx += p.length;
  }

  const ranges = card.flagged
    .map((phrase) => {
      const s = card.text.indexOf(phrase);
      return s >= 0 ? ([s, s + phrase.length] as const) : null;
    })
    .filter((r): r is readonly [number, number] => r !== null);

  const spaceW = ctx.measureText(" ").width;
  const lines: LaidWord[][] = [];
  let line: LaidWord[] = [];
  let cursorX = startX;

  for (const tok of tokens) {
    const wWidth = ctx.measureText(tok.word).width;
    if (line.length > 0 && cursorX - startX + wWidth > maxWidth) {
      lines.push(line);
      line = [];
      cursorX = startX;
    }
    const flagged = ranges.some(([s, e]) => tok.start < e && tok.end > s);
    line.push({ word: tok.word, x: cursorX, width: wWidth, flagged });
    cursorX += wWidth + spaceW;
  }
  if (line.length > 0) lines.push(line);
  return lines;
}

function createCardTexture(card: ContentCard, analyzed: boolean): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d")!;
  const color = BAND_COLORS[card.band];

  const padX = 78;
  const padTop = 70;

  // Card background
  const bg = ctx.createLinearGradient(0, 0, TEX_W, TEX_H);
  bg.addColorStop(0, "#1c1426");
  bg.addColorStop(1, "#140e1c");
  roundRect(ctx, 8, 8, TEX_W - 16, TEX_H - 16, 40);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(220, 200, 240, 0.10)";
  ctx.stroke();

  // Source label (top-left)
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(167, 139, 180, 0.55)";
  ctx.fillRect(padX, padTop + 6, 10, 10);
  ctx.font =
    "600 24px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  ctx.fillStyle = "rgba(214, 200, 226, 0.55)";
  ctx.fillText(card.source.toUpperCase(), padX + 24, padTop);

  // Risk badge (top-right) — only after scan
  if (analyzed) {
    ctx.font = "600 23px ui-monospace, SFMono-Regular, Menlo, monospace";
    const badgeText = `${card.category.toUpperCase()} · ${card.band.toUpperCase()} ${card.score}`;
    const tw = ctx.measureText(badgeText).width;
    const bw = tw + 60;
    const bh = 52;
    const bx = TEX_W - padX - bw;
    const by = padTop - 8;
    roundRect(ctx, bx, by, bw, bh, bh / 2);
    ctx.fillStyle = "rgba(160, 107, 255, 0.10)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    // shield dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(bx + 28, by + bh / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(badgeText, bx + 44, by + bh / 2 - 12);
  }

  // Body text
  const bodyFont = "600 52px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.font = bodyFont;
  const lineHeight = 70;
  const maxWidth = TEX_W - padX * 2;
  const lines = layoutBody(ctx, card, maxWidth, padX);
  const blockHeight = lines.length * lineHeight;
  let y = Math.max(padTop + 120, (TEX_H - blockHeight) / 2 - 30);

  for (const lineWords of lines) {
    // Draw highlight boxes for flagged runs (analyzed only)
    if (analyzed) {
      let i = 0;
      while (i < lineWords.length) {
        if (lineWords[i].flagged) {
          let j = i;
          while (j + 1 < lineWords.length && lineWords[j + 1].flagged) j++;
          const a = lineWords[i];
          const b = lineWords[j];
          const x0 = a.x - 12;
          const x1 = b.x + b.width + 12;
          ctx.save();
          ctx.shadowColor = color;
          ctx.shadowBlur = 26;
          roundRect(ctx, x0, y - 10, x1 - x0, lineHeight - 6, 14);
          ctx.fillStyle = "rgba(160, 107, 255, 0.16)";
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.restore();
          i = j + 1;
        } else {
          i++;
        }
      }
    }
    // Draw words
    ctx.font = bodyFont;
    ctx.textBaseline = "top";
    for (const lw of lineWords) {
      ctx.fillStyle = analyzed
        ? "rgba(245, 240, 250, 0.98)"
        : "rgba(210, 200, 222, 0.7)";
      ctx.fillText(lw.word, lw.x, y);
    }
    y += lineHeight;
  }

  // Footer: confidence meter (analyzed) or queued hint (raw)
  const footY = TEX_H - 132;
  ctx.font = "600 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  if (analyzed) {
    ctx.fillStyle = "rgba(214, 200, 226, 0.5)";
    ctx.fillText("CONFIDENCE", padX, footY);
    const pct = Math.round(card.confidence * 100);
    ctx.fillStyle = color;
    ctx.fillText(`${pct}%`, padX + 168, footY);
    const trackX = padX + 250;
    const trackW = TEX_W - padX - trackX;
    const trackY = footY + 12;
    roundRect(ctx, trackX, trackY, trackW, 8, 4);
    ctx.fillStyle = "rgba(220, 200, 240, 0.12)";
    ctx.fill();
    roundRect(ctx, trackX, trackY, trackW * card.confidence, 8, 4);
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.fillStyle = "rgba(167, 139, 180, 0.45)";
    ctx.fillText("AWAITING RISK SCAN", padX, footY);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const carouselVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const carouselFragmentShader = /* glsl */ `
  uniform sampler2D uTextureRaw;
  uniform sampler2D uTextureScanned;
  uniform vec2 uResolution;
  uniform float uBarWidth;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float bayerDither(vec2 position) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float t = 0.0;
    if (index == 0) t = 0.0/16.0;
    else if (index == 1) t = 8.0/16.0;
    else if (index == 2) t = 2.0/16.0;
    else if (index == 3) t = 10.0/16.0;
    else if (index == 4) t = 12.0/16.0;
    else if (index == 5) t = 4.0/16.0;
    else if (index == 6) t = 14.0/16.0;
    else if (index == 7) t = 6.0/16.0;
    else if (index == 8) t = 3.0/16.0;
    else if (index == 9) t = 11.0/16.0;
    else if (index == 10) t = 1.0/16.0;
    else if (index == 11) t = 9.0/16.0;
    else if (index == 12) t = 15.0/16.0;
    else if (index == 13) t = 7.0/16.0;
    else if (index == 14) t = 13.0/16.0;
    else t = 5.0/16.0;
    return t;
  }

  float roundedRectSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    vec4 rawTex = texture2D(uTextureRaw, vUv);
    vec4 scanTex = texture2D(uTextureScanned, vUv);

    // -1 (raw, unscanned) on the left, +1 (scanned) on the right of the bar.
    float barTransition = smoothstep(-uBarWidth, uBarWidth, vWorldPosition.x);

    // Raw side: desaturated + dithered "unprocessed signal".
    float gray = dot(rawTex.rgb, vec3(0.299, 0.587, 0.114));
    vec2 pixelPos = vUv * uResolution;
    float dither = bayerDither(pixelPos);
    float levels = 3.0;
    float quantized = floor(gray * levels + dither) / levels;
    vec3 rawProcessed = vec3(quantized) * 0.85;

    vec3 finalColor = mix(rawProcessed, scanTex.rgb, barTransition);
    float texAlpha = mix(rawTex.a, scanTex.a, barTransition);

    // Rounded plane corners
    vec2 centeredUv = vUv * 2.0 - 1.0;
    float dist = roundedRectSDF(centeredUv, vec2(1.0, 1.0), 0.1);
    float alpha = 1.0 - smoothstep(-0.02, 0.02, dist);

    gl_FragColor = vec4(finalColor, alpha * texAlpha);
  }
`;

const glowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;
    float coreGlow = exp(-centerDist * 60.0) * 2.5;
    float midGlow = exp(-centerDist * 12.0) * 1.2;
    float outerGlow = exp(-centerDist * 4.0) * 0.5;
    float glow = coreGlow + midGlow + outerGlow;
    float pulse = sin(uTime * 1.5) * 0.08 + 0.92;
    glow *= pulse;
    float scanLine = sin(vUv.y * 60.0 + uTime * 2.0) * 0.02 + 0.98;
    glow *= scanLine;
    vec3 glowColor = vec3(0.71, 0.45, 1.0);
    float edgeDist = abs(vUv.y - 0.5) * 2.0;
    float vertFade = 1.0 - smoothstep(0.2, 0.95, edgeDist);
    glow *= vertFade;
    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

interface CarouselItemProps {
  rawTexture: THREE.Texture;
  scannedTexture: THREE.Texture;
  index: number;
  totalItems: number;
  rotationRef: React.RefObject<number>;
  radius: number;
}

function CarouselItem({
  rawTexture,
  scannedTexture,
  index,
  totalItems,
  rotationRef,
  radius,
}: CarouselItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTextureRaw: { value: rawTexture },
      uTextureScanned: { value: scannedTexture },
      uResolution: { value: new THREE.Vector2(220, 150) },
      uBarWidth: { value: 0.12 },
    }),
    [rawTexture, scannedTexture],
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const anglePerItem = (Math.PI * 2) / totalItems;
    const baseAngle = index * anglePerItem;
    const currentAngle = baseAngle + rotationRef.current;
    const normalizedAngle =
      (((currentAngle % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) -
      Math.PI;
    const x = Math.sin(normalizedAngle) * radius;
    const z = -Math.cos(normalizedAngle) * radius + radius * 0.1;
    meshRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y = -normalizedAngle;
    const isBehind = Math.abs(normalizedAngle) > Math.PI * 0.7;
    meshRef.current.visible = !isBehind;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[3.2, 2.13]} />
      <shaderMaterial
        vertexShader={carouselVertexShader}
        fragmentShader={carouselFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GlowParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 80;
  const fadeDistance = 0.4;
  const velocitiesRef = useRef<Float32Array>(
    new Float32Array(particleCount * 3),
  );
  const lifetimesRef = useRef<Float32Array>(new Float32Array(particleCount));

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = (i / particleCount - 0.5) * 1.2;
      pos[i * 3 + 2] = (((i * 0.618) % 1.0) - 0.5) * 0.1;
    }
    return pos;
  }, [particleCount]);

  useEffect(() => {
    const velocities = velocitiesRef.current;
    const lifetimes = lifetimesRef.current;
    for (let i = 0; i < particleCount; i++) {
      const direction = i % 2 === 0 ? 1 : -1;
      velocities[i * 3] = direction * (((i * 0.382) % 1.0) * 0.012 + 0.004);
      velocities[i * 3 + 1] = (((i * 0.786) % 1.0) - 0.4) * 0.006;
      velocities[i * 3 + 2] = (((i * 0.214) % 1.0) - 0.5) * 0.003;
      lifetimes[i] = (i * 0.123) % 1.0;
    }
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const opacities = new Float32Array(particleCount).fill(1);
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    return geo;
  }, [positions]);

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color("#B98CFF") },
          uFadeDistance: { value: fadeDistance },
        },
        vertexShader: `
          attribute float aOpacity;
          varying float vOpacity;
          varying float vDistance;
          void main() {
            vOpacity = aOpacity;
            vDistance = abs(position.x);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 20.0 * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uFadeDistance;
          varying float vOpacity;
          varying float vDistance;
          void main() {
            float fade = 1.0 - smoothstep(0.0, uFadeDistance, vDistance);
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            gl_FragColor = vec4(uColor, alpha * fade * vOpacity * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [fadeDistance],
  );

  useFrame((state) => {
    if (!particlesRef.current) return;
    const positionAttr = particlesRef.current.geometry.attributes.position;
    const opacityAttr = particlesRef.current.geometry.attributes.aOpacity;
    const posArray = positionAttr.array as Float32Array;
    const opacityArray = opacityAttr.array as Float32Array;
    const velocities = velocitiesRef.current;
    const lifetimes = lifetimesRef.current;

    for (let i = 0; i < particleCount; i++) {
      const currentLifetime = lifetimes[i] + 0.012;
      const newLifetime = currentLifetime > 1 ? 0 : currentLifetime;
      lifetimes[i] = newLifetime;
      if (currentLifetime > 1) {
        posArray[i * 3] = 0;
        posArray[i * 3 + 1] =
          (((i + state.clock.elapsedTime * 10) % particleCount) /
            particleCount -
            0.5) *
          1.2;
        posArray[i * 3 + 2] =
          (((i * 0.618 + state.clock.elapsedTime) % 1.0) - 0.5) * 0.1;
        const direction = i % 2 === 0 ? 1 : -1;
        velocities[i * 3] =
          direction *
          ((((i + state.clock.elapsedTime) * 0.382) % 1.0) * 0.012 + 0.004);
        velocities[i * 3 + 1] =
          ((((i + state.clock.elapsedTime) * 0.786) % 1.0) - 0.4) * 0.006;
      }
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] +=
        velocities[i * 3 + 1] +
        Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.0008;
      posArray[i * 3 + 2] += velocities[i * 3 + 2];
      const dist = Math.abs(posArray[i * 3]);
      opacityArray[i] = Math.max(0, 1.0 - dist / fadeDistance);
    }
    positionAttr.needsUpdate = true;
    opacityAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={shaderMaterial} />
  );
}

function GlowBar() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });
  return (
    <group position={[0, 0, 2]}>
      <mesh>
        <planeGeometry args={[0.7, 2.2]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={glowVertexShader}
          fragmentShader={glowFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      <GlowParticles />
    </group>
  );
}

function ResizeHandler() {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const { gl, camera } = useThree();

  useEffect(() => {
    glRef.current = gl;
    cameraRef.current = camera;
  }, [gl, camera]);

  useEffect(() => {
    const canvas = gl.domElement;
    const parent = canvas.parentElement;
    if (!parent) return;
    const updateSize = () => {
      const currentGl = glRef.current;
      const currentCamera = cameraRef.current;
      if (!currentGl || !currentCamera) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width > 0 && height > 0) {
        currentGl.setSize(width, height);
        if (currentCamera instanceof THREE.PerspectiveCamera) {
          currentCamera.aspect = width / height;
          currentCamera.updateProjectionMatrix();
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(parent);
    const t1 = setTimeout(updateSize, 200);
    return () => {
      observer.disconnect();
      clearTimeout(t1);
    };
  }, [gl]);
  return null;
}

type DragControl = {
  rotation: number;
  velocity: number;
  dragging: boolean;
  lastX: number;
};

const AUTO_SPEED = 0.16;

function CarouselScene({
  control,
}: {
  control: React.RefObject<DragControl>;
}) {
  const rotationRef = useRef(0);
  const radius = 4.7;

  const textures = useMemo(
    () =>
      CARDS.map((card) => ({
        raw: createCardTexture(card, false),
        scanned: createCardTexture(card, true),
      })),
    [],
  );

  useEffect(() => {
    return () => {
      textures.forEach((t) => {
        t.raw.dispose();
        t.scanned.dispose();
      });
    };
  }, [textures]);

  // Auto-rotation + inertia are advanced by the parent rAF loop (which owns
  // the control ref). Here we only mirror the shared rotation onto the local
  // ref the carousel items read from.
  useFrame(() => {
    rotationRef.current = control.current.rotation;
  });

  return (
    <group>
      {textures.map((tex, index) => (
        <CarouselItem
          key={index}
          rawTexture={tex.raw}
          scannedTexture={tex.scanned}
          index={index}
          totalItems={textures.length}
          rotationRef={rotationRef}
          radius={radius}
        />
      ))}
      <GlowBar />
    </group>
  );
}

export function ScanCarousel() {
  const control = useRef<DragControl>({
    rotation: 0,
    velocity: 0,
    dragging: false,
    lastX: 0,
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const c = control.current;
      // Clamp delta so background tabs don't cause a rotation jump on resume.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!c.dragging) {
        c.rotation += AUTO_SPEED * dt + c.velocity;
        c.velocity *= 0.94;
        if (Math.abs(c.velocity) < 1e-5) c.velocity = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const c = control.current;
    c.dragging = true;
    c.lastX = e.clientX;
    c.velocity = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const c = control.current;
    if (!c.dragging) return;
    const dx = e.clientX - c.lastX;
    c.lastX = e.clientX;
    // Drag follows the finger: swipe right spins the ring toward you.
    const step = -dx * 0.006;
    c.rotation += step;
    c.velocity = step;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const c = control.current;
    if (!c.dragging) return;
    c.dragging = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className="h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <ResizeHandler />
        <Suspense fallback={null}>
          <CarouselScene control={control} />
        </Suspense>
      </Canvas>
    </div>
  );
}
