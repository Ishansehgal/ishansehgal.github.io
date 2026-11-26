import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import houseFly from "../../assets/house_fly_through.mp4";
import {
  getPose,
  tracePose,
  collides,
  scrollToRoute,
  WAYPOINTS,
  OBSTACLES,
  PATH_LENGTH,
  worldState,
  type Pose,
} from "./path";

const STRIDE_K = (Math.PI * 2) / 1.15; // gait phase per metre (one stride ≈ 1.15 m)

const INK = "#211f1b";
const ORANGE = "#f54e00";
const BLUE = "#2c5aa0";
const TARS_GREY = "#9a968f"; // brushed-grey slabs
const TARS_DARK = "#2c2925"; // black 3D-printed slabs (the ones carrying TARS)
const TARS_YELLOW = "#f2c230";

const TRACE_N = 600;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type V3 = [number, number, number];

/* ---------- the journey's places: one frame per stop, built on the road's right ---------- */

// each place is authored in its own frame: +z along the road, -x is the screen-right side
const FRAMES: Pose[] = WAYPOINTS.map((w) => getPose(w.t));

const toWorld = (f: Pose, l: V3, out: THREE.Vector3) =>
  out.set(
    f.x + Math.cos(f.heading) * l[0] + Math.sin(f.heading) * l[2],
    l[1],
    f.z - Math.sin(f.heading) * l[0] + Math.cos(f.heading) * l[2]
  );

// each place is built a little up the road from where TARS parks, so the parked
// shot reads front to back: board (2D, left) · TARS · the place behind him
const AHEAD = 5.5;

// parked camera shot at each stop, in that place's frame
type Shot = { cam: V3; look: V3 };
const SHOT: Shot = { cam: [5, 6.2, -10.5], look: [-4.2, 1.0, 8.5] };
// a place stands AHEAD up the road and follows the road's direction there
const PLACE_FRAMES: Pose[] = WAYPOINTS.map((w, k) =>
  k === WAYPOINTS.length - 1 ? FRAMES[k] : getPose(w.t + AHEAD / PATH_LENGTH)
);
const SHOTS: Record<number, Shot> = {
  7: { cam: [5.5, 3.6, -9], look: [-3.8, 2.4, 14] },
};

// where that stop's parked camera is, in the place's own frame (signs turn to it),
// and the stop's progress (signs rise as TARS arrives)
const FaceCtx = createContext<{ face: V3; t: number }>({ face: [0, 5, -10], t: 0 });

const Place = ({ k, children }: { k: number; children: React.ReactNode }) => {
  const f = PLACE_FRAMES[k];
  const ctx = useMemo(() => {
    const c = toWorld(FRAMES[k], (SHOTS[k] ?? SHOT).cam, new THREE.Vector3());
    const dx = c.x - f.x;
    const dz = c.z - f.z;
    const face: V3 = [
      Math.cos(f.heading) * dx - Math.sin(f.heading) * dz,
      c.y,
      Math.sin(f.heading) * dx + Math.cos(f.heading) * dz,
    ];
    return { face, t: WAYPOINTS[k].t };
  }, [k, f]);
  return (
    <FaceCtx.Provider value={ctx}>
      <group position={[f.x, 0, f.z]} rotation={[0, f.heading, 0]}>
        {children}
      </group>
    </FaceCtx.Provider>
  );
};

/* ---------- shared low-poly materials and primitives ---------- */

const mats = new Map<string, THREE.MeshStandardMaterial>();
const mat = (color: string, e = 0, rough = 0.82, metal = 0.05) => {
  const k = `${color}|${e}|${rough}|${metal}`;
  let m = mats.get(k);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      roughness: rough,
      metalness: metal,
      emissive: e ? color : "#000000",
      emissiveIntensity: e,
      flatShading: true,
    });
    mats.set(k, m);
  }
  return m;
};

const Bx = ({ p, s, c, e, r }: { p: V3; s: V3; c: string; e?: number; r?: V3 }) => (
  <mesh position={p} rotation={r} material={mat(c, e)}>
    <boxGeometry args={s} />
  </mesh>
);

const Cy = ({
  p,
  r,
  h,
  c,
  rb,
  seg = 18,
  e,
  rot,
}: {
  p: V3;
  r: number;
  h: number;
  c: string;
  rb?: number;
  seg?: number;
  e?: number;
  rot?: V3;
}) => (
  <mesh position={p} rotation={rot} material={mat(c, e)}>
    <cylinderGeometry args={[r, rb ?? r, h, seg]} />
  </mesh>
);

/* ---------- painted signs: the headline of each place, in the world ---------- */

type Line = {
  text: string;
  size: number;
  mono?: boolean;
  color?: string;
  gap?: number;
};

const drawSign = (c: HTMLCanvasElement, lines: Line[], dark: boolean) => {
  const ctx = c.getContext("2d")!;
  const W = c.width;
  const H = c.height;
  ctx.fillStyle = dark ? "#0d1322" : "#fbfaf6";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = dark ? "#ffb547" : INK;
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, W - 8, H - 8);
  ctx.fillStyle = ORANGE;
  ctx.fillRect(4, 4, W - 8, 16);
  let y = 74;
  const pad = 52;
  for (const l of lines) {
    let size = l.size;
    const font = (s: number) =>
      l.mono ? `500 ${s}px 'IBM Plex Mono', monospace` : `900 ${s}px Archivo, sans-serif`;
    ctx.font = font(size);
    while (ctx.measureText(l.text).width > W - pad * 2 && size > 12) {
      size -= 2;
      ctx.font = font(size);
    }
    y += size * 0.86 + (l.gap ?? 0);
    ctx.fillStyle = l.color ?? (dark ? "#f3f6fa" : INK);
    ctx.fillText(l.text, pad, y);
    y += size * 0.42;
  }
};

const Sign = ({
  p,
  lines,
  w = 4.6,
  h = 2.3,
  dark = false,
  face,
  lift = 3,
}: {
  p: V3;
  lines: Line[];
  w?: number;
  h?: number;
  dark?: boolean;
  face?: V3;
  lift?: number;
}) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * 240);
    c.height = Math.round(h * 240);
    drawSign(c, lines, dark);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    // repaint once the web fonts are in, so the board uses Archivo / Plex
    document.fonts?.ready.then(() => {
      drawSign(c, lines, dark);
      t.needsUpdate = true;
    });
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const place = useContext(FaceCtx);
  const f = face ?? place.face;
  const yaw = Math.atan2(f[0] - p[0], f[2] - p[2]);
  const rise = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!rise.current) return;
    // up out of the ground as TARS arrives, so only this place's sign is standing
    const k =
      worldState.mode === "teleop"
        ? 1
        : THREE.MathUtils.smoothstep(1 - Math.abs(worldState.t - place.t) * 6.5, 0, 1);
    rise.current.position.y = (k - 1) * (lift + h + 0.3);
    rise.current.visible = k > 0.002;
  });
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <group ref={rise}>
        {[-1, 1].map((k) => (
          <Bx
            key={k}
            p={[k * (w / 2 - 0.25), (lift + h) / 2, -0.06]}
            s={[0.1, lift + h, 0.1]}
            c={INK}
          />
        ))}
        <Bx p={[0, lift + h / 2, -0.05]} s={[w + 0.12, h + 0.12, 0.06]} c={INK} />
        <mesh position={[0, lift + h / 2, 0]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

const canvasTex = (w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  document.fonts?.ready.then(() => {
    paint(c.getContext("2d")!);
    t.needsUpdate = true;
  });
  return t;
};

/* ---------- TARS — modeled on the real two-tone replica ---------- */

const SLAB_W = 0.38;
const SLAB_H = 2.5;
const SLAB_D = 0.34;
const GAP = 0.04;
const SEGMENTS = 4;
const SEG_GAP = 0.05;
const SEG_H = (SLAB_H - (SEGMENTS - 1) * SEG_GAP) / SEGMENTS;
const SLAB_X = [-1.5, -0.5, 0.5, 1.5].map((m) => m * (SLAB_W + GAP));

const makeTarsLetters = () => {
  const c = document.createElement("canvas");
  c.width = 96;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = TARS_YELLOW;
  ctx.font = "bold 76px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ["T", "A", "R", "S"].forEach((ch, i) => ctx.fillText(ch, 48, 110 + i * 108));
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
};

const Slab = ({
  x,
  slabRef,
  letters,
  led,
  dark,
}: {
  x: number;
  slabRef?: React.Ref<THREE.Group>;
  letters?: boolean;
  led?: boolean;
  dark?: boolean;
}) => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: dark ? TARS_DARK : TARS_GREY,
        metalness: dark ? 0.1 : 0.18,
        roughness: dark ? 0.7 : 0.5,
      }),
    [dark]
  );
  const lettersTex = useMemo(() => (letters ? makeTarsLetters() : null), [letters]);

  return (
    <group ref={slabRef} position={[x, SLAB_H, 0]}>
      <group position={[0, -SLAB_H / 2, 0]}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <mesh
            key={i}
            material={material}
            position={[0, SLAB_H / 2 - SEG_H / 2 - i * (SEG_H + SEG_GAP), 0]}
          >
            <boxGeometry args={[SLAB_W, SEG_H, SLAB_D]} />
          </mesh>
        ))}
        {lettersTex && (
          <mesh position={[0, SLAB_H * 0.22, -(SLAB_D / 2 + 0.006)]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[SLAB_W * 0.8, SLAB_H * 0.62]} />
            <meshBasicMaterial map={lettersTex} transparent />
          </mesh>
        )}
        {led && (
          <mesh position={[0, SLAB_H / 2 - 0.16, -(SLAB_D / 2 + 0.012)]}>
            <boxGeometry args={[0.07, 0.07, 0.03]} />
            <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={2.4} />
          </mesh>
        )}
      </group>
    </group>
  );
};

/* ---------- time of day: dawn in Amritsar, golden hour on stage, night at the gate ---------- */

type Key = {
  t: number;
  top: string;
  hor: string;
  ground: string;
  hemiSky: string;
  hemiGround: string;
  hemi: number;
  sun: string;
  sunI: number;
  elev: number;
  night: number;
};
// prettier-ignore
const KEYS: Key[] = [
  { t: 0, top: "#8ea6d2", hor: "#f6c9a6", ground: "#efe1d2", hemiSky: "#ffe2c8", hemiGround: "#8f8999", hemi: 0.95, sun: "#ffc596", sunI: 1.05, elev: 0.1, night: 0 },
  { t: 0.143, top: "#a3bde3", hor: "#f5dcc4", ground: "#efe6da", hemiSky: "#fff0df", hemiGround: "#958f92", hemi: 1.0, sun: "#ffd9b2", sunI: 1.15, elev: 0.28, night: 0 },
  { t: 0.33, top: "#b2cdea", hor: "#eef0eb", ground: "#f2eee5", hemiSky: "#fff7ec", hemiGround: "#9a958c", hemi: 1.05, sun: "#ffffff", sunI: 1.25, elev: 0.75, night: 0 },
  { t: 0.6, top: "#aac4e6", hor: "#f1ebe1", ground: "#efe8dc", hemiSky: "#fff3e4", hemiGround: "#9a938a", hemi: 1.0, sun: "#fff0da", sunI: 1.2, elev: 0.5, night: 0 },
  { t: 0.72, top: "#8a9fcc", hor: "#f3cd9f", ground: "#e9d9c5", hemiSky: "#ffe0bb", hemiGround: "#8a7f80", hemi: 0.92, sun: "#ffbf76", sunI: 1.15, elev: 0.22, night: 0 },
  { t: 0.857, top: "#3f4680", hor: "#f2975a", ground: "#d8bca2", hemiSky: "#ffcb98", hemiGround: "#6a5763", hemi: 0.78, sun: "#ff9b55", sunI: 1.1, elev: 0.05, night: 0.2 },
  { t: 1, top: "#050a18", hor: "#1a2647", ground: "#111a2c", hemiSky: "#5b70aa", hemiGround: "#0d1222", hemi: 0.55, sun: "#a9b9ff", sunI: 0.4, elev: 0.55, night: 1 },
];
const KEYC = KEYS.map((k) => ({
  ...k,
  cTop: new THREE.Color(k.top),
  cHor: new THREE.Color(k.hor),
  cGround: new THREE.Color(k.ground),
  cHemiSky: new THREE.Color(k.hemiSky),
  cHemiGround: new THREE.Color(k.hemiGround),
  cSun: new THREE.Color(k.sun),
}));

/** live atmosphere values other pieces read (lamps, signs) */
const env = { night: 0, lamps: 0 };

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const SKY_FRAG = /* glsl */ `
uniform vec3 top;
uniform vec3 hor;
uniform vec3 sunDir;
uniform vec3 sunCol;
uniform float night;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, -0.2, 1.0);
  vec3 c = mix(hor, top, pow(smoothstep(-0.03, 0.55, h), 0.75));
  float s = max(dot(d, normalize(sunDir)), 0.0);
  c += sunCol * (smoothstep(0.9993, 0.9997, s) * 1.6 + pow(s, 14.0) * 0.22) * (1.0 - night * 0.75);
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const Atmosphere = () => {
  const sky = useRef<THREE.Mesh>(null);
  const stars = useRef<THREE.Points>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const ground = useRef<THREE.MeshStandardMaterial>(null);
  const grid = useRef<THREE.LineBasicMaterial>(null);

  const skyMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          top: { value: new THREE.Color() },
          hor: { value: new THREE.Color() },
          sunDir: { value: new THREE.Vector3(0.6, 0.2, -0.6) },
          sunCol: { value: new THREE.Color() },
          night: { value: 0 },
        },
      }),
    []
  );
  const starGeom = useMemo(() => {
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const y = 0.08 + Math.random() * 0.92;
      const r = Math.sqrt(1 - y * y);
      pos.set([Math.cos(a) * r * 380, y * 380, Math.sin(a) * r * 380], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const fog = useMemo(() => new THREE.Fog("#eef0eb", 34, 115), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ scene, camera }) => {
    if (scene.fog !== fog) scene.fog = fog;
    const t = worldState.t;
    let i = 0;
    while (i < KEYC.length - 2 && t > KEYC[i + 1].t) i++;
    const a = KEYC[i];
    const b = KEYC[i + 1];
    const f = THREE.MathUtils.smoothstep(t, a.t, b.t);
    const u = skyMat.uniforms;
    (u.top.value as THREE.Color).lerpColors(a.cTop, b.cTop, f);
    (u.hor.value as THREE.Color).lerpColors(a.cHor, b.cHor, f);
    (u.sunCol.value as THREE.Color).lerpColors(a.cSun, b.cSun, f);
    const night = THREE.MathUtils.lerp(a.night, b.night, f);
    u.night.value = night;
    const elev = THREE.MathUtils.lerp(a.elev, b.elev, f);
    (u.sunDir.value as THREE.Vector3).set(0.62, elev, -0.62).normalize();
    fog.color.copy(u.hor.value as THREE.Color);
    env.night = night;
    env.lamps = THREE.MathUtils.smoothstep(t, 0.76, 0.9);

    if (hemi.current) {
      hemi.current.color.lerpColors(a.cHemiSky, b.cHemiSky, f);
      hemi.current.groundColor.lerpColors(a.cHemiGround, b.cHemiGround, f);
      hemi.current.intensity = THREE.MathUtils.lerp(a.hemi, b.hemi, f);
    }
    if (sun.current) {
      sun.current.color.lerpColors(a.cSun, b.cSun, f);
      sun.current.intensity = THREE.MathUtils.lerp(a.sunI, b.sunI, f);
      sun.current.position.copy(u.sunDir.value as THREE.Vector3).multiplyScalar(40);
    }
    if (fill.current) fill.current.intensity = 0.4 * (1 - night * 0.6);
    if (ground.current) ground.current.color.lerpColors(a.cGround, b.cGround, f);
    if (grid.current) {
      grid.current.color.copy(tmp.set("#b7c4d8")).lerp(tmp.set("#4f7fd6"), night);
      grid.current.opacity = 0.35 + night * 0.3;
    }
    sky.current?.position.copy(camera.position);
    if (stars.current) {
      stars.current.position.copy(camera.position);
      (stars.current.material as THREE.PointsMaterial).opacity = THREE.MathUtils.smoothstep(
        night,
        0.3,
        1
      );
      stars.current.visible = night > 0.3;
    }
  });

  return (
    <>
      <mesh ref={sky} material={skyMat} renderOrder={-1}>
        <sphereGeometry args={[420, 32, 16]} />
      </mesh>
      <points ref={stars} geometry={starGeom}>
        <pointsMaterial
          color="#e8eeff"
          size={1.6}
          sizeAttenuation={false}
          transparent
          fog={false}
          depthWrite={false}
        />
      </points>
      <hemisphereLight ref={hemi} args={["#fff7ec", "#9a958c", 1.05]} />
      <directionalLight ref={sun} position={[6, 10, 4]} intensity={1.25} />
      <directionalLight ref={fill} position={[-6, 4, -3]} intensity={0.4} color="#ffe1c4" />

      {/* ground + blueprint grid (it glows at night) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[60, -0.01, 0]}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial ref={ground} color="#f2eee5" roughness={1} metalness={0} />
      </mesh>
      <gridHelper args={[600, 300]} position={[60, 0.001, 0]}>
        <lineBasicMaterial
          ref={grid}
          attach="material"
          color="#b7c4d8"
          transparent
          opacity={0.35}
        />
      </gridHelper>
    </>
  );
};

/* ---------- the road: plan, executed trace, free-space corridor ---------- */

class PlanCurve extends THREE.Curve<THREE.Vector3> {
  constructor() {
    super();
  }
  getPoint(t: number) {
    const p = getPose(t);
    return new THREE.Vector3(p.x, 0.06, p.z);
  }
}

const PlanLine = () => {
  const geometry = useMemo(() => new THREE.TubeGeometry(new PlanCurve(), 720, 0.03, 6), []);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={ORANGE} />
    </mesh>
  );
};

const TraceLine = () => {
  const geometry = useMemo(() => {
    const positions = new Float32Array((TRACE_N + 1) * 3);
    for (let i = 0; i <= TRACE_N; i++) {
      const p = tracePose(i, TRACE_N);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = 0.1;
      positions[i * 3 + 2] = p.z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  useFrame(() => {
    geometry.setDrawRange(0, Math.max(1, Math.floor(worldState.t * TRACE_N)));
  });

  return (
    <primitive
      object={useMemo(
        () => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: BLUE })),
        [geometry]
      )}
    />
  );
};

const Corridor = () => {
  const geometry = useMemo(() => {
    const N = 480;
    const hw = 1.7; // half-width of the drivable ribbon
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const p = getPose(i / N);
      const nx = Math.cos(p.heading);
      const nz = -Math.sin(p.heading);
      pos.push(p.x + nx * hw, 0.035, p.z + nz * hw);
      pos.push(p.x - nx * hw, 0.035, p.z - nz * hw);
    }
    for (let i = 0; i < N; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={BLUE}
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ---------- projector pad + light beam where TARS parks ---------- */

const Projector = ({ t }: { t: number }) => {
  const beam = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const pose = useMemo(() => getPose(t), [t]);
  useFrame(({ clock }) => {
    const f =
      worldState.mode === "teleop"
        ? THREE.MathUtils.smoothstep(
            1 -
              THREE.MathUtils.clamp(
                (Math.hypot(worldState.free.x - pose.x, worldState.free.z - pose.z) - 2.5) / 6,
                0,
                1
              ),
            0,
            1
          )
        : THREE.MathUtils.smoothstep(1 - Math.min(1, Math.abs(worldState.t - t) * 9), 0, 1);
    if (beam.current) {
      beam.current.scale.y = Math.max(0.0001, f);
      beam.current.visible = f > 0.01;
    }
    if (ring.current) {
      const s = 0.85 + f * 0.15 + Math.sin(clock.elapsedTime * 2) * 0.02 * f;
      ring.current.scale.set(s, s, s);
      (ring.current.material as THREE.Material).opacity = 0.25 + f * 0.45;
    }
  });

  return (
    <group position={[pose.x, 0, pose.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.25, 56]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.15, 1.32, 64]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <group ref={beam}>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[1.45, 1.18, 4.8, 44, 1, true]} />
          <meshBasicMaterial
            color={ORANGE}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};

/* ---------- roadside: street lamps (lit at dusk) and low-poly trees ---------- */

const rand = (() => {
  let s = 1337;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
})();

const Roadside = () => {
  const head = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff1d6",
        emissive: "#ffcf8a",
        emissiveIntensity: 0,
      }),
    []
  );
  const { lamps, trees } = useMemo(() => {
    const lamps: THREE.Matrix4[] = [];
    for (let d = 6; d < PATH_LENGTH - 4; d += 10) {
      const p = getPose(d / PATH_LENGTH);
      lamps.push(
        new THREE.Matrix4().makeTranslation(
          p.x + Math.cos(p.heading) * 2.6,
          0,
          p.z - Math.sin(p.heading) * 2.6
        )
      );
    }
    const trees: { m: THREE.Matrix4; c: THREE.Color }[] = [];
    const greens = ["#7d9a62", "#6b8c5a", "#8fa86b", "#5f7f55"];
    let guard = 0;
    while (trees.length < 150 && guard++ < 4000) {
      const t = rand();
      const p = getPose(t);
      const lat = (rand() < 0.5 ? -1 : 1) * (6 + rand() * 24);
      const x = p.x + Math.cos(p.heading) * lat;
      const z = p.z - Math.sin(p.heading) * lat;
      if (OBSTACLES.some((o) => Math.hypot(o.x - x, o.z - z) < 8)) continue;
      // keep each parked shot's foreground clear (left of the road, behind the stop)
      const blocks = FRAMES.slice(1).some((f) => {
        const dx = x - f.x;
        const dz = z - f.z;
        const lx = Math.cos(f.heading) * dx - Math.sin(f.heading) * dz;
        const lz = Math.sin(f.heading) * dx + Math.cos(f.heading) * dz;
        return lx > -1 && lx < 13 && lz > -17 && lz < 5;
      });
      if (blocks) continue;
      let near = false;
      for (let k = 0; k <= 60 && !near; k++) {
        const q = getPose(k / 60);
        near = Math.hypot(q.x - x, q.z - z) < 4.5;
      }
      if (near) continue;
      const s = 0.7 + rand() * 0.9;
      trees.push({
        m: new THREE.Matrix4().compose(
          new THREE.Vector3(x, 0, z),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * 6.28),
          new THREE.Vector3(s, s * (0.8 + rand() * 0.5), s)
        ),
        c: new THREE.Color(greens[Math.floor(rand() * greens.length)]),
      });
    }
    return { lamps, trees };
  }, []);

  const postRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    lamps.forEach((m, i) => {
      postRef.current?.setMatrixAt(i, m);
      headRef.current?.setMatrixAt(i, m);
    });
    trees.forEach(({ m, c }, i) => {
      trunkRef.current?.setMatrixAt(i, m);
      crownRef.current?.setMatrixAt(i, m);
      crownRef.current?.setColorAt(i, c);
    });
    [postRef, headRef, trunkRef, crownRef].forEach((r) => {
      if (r.current) r.current.instanceMatrix.needsUpdate = true;
    });
    if (crownRef.current?.instanceColor) crownRef.current.instanceColor.needsUpdate = true;
  }, [lamps, trees]);

  useFrame(() => {
    head.emissiveIntensity = env.lamps * 2.6;
  });

  const post = useMemo(
    () => new THREE.CylinderGeometry(0.05, 0.07, 3.4, 6).translate(0, 1.7, 0),
    []
  );
  const lamp = useMemo(() => new THREE.BoxGeometry(0.34, 0.12, 0.34).translate(0, 3.45, 0), []);
  const trunk = useMemo(
    () => new THREE.CylinderGeometry(0.09, 0.13, 1.1, 5).translate(0, 0.55, 0),
    []
  );
  const crown = useMemo(() => new THREE.ConeGeometry(0.85, 2.3, 6).translate(0, 2.1, 0), []);

  return (
    <>
      <instancedMesh ref={postRef} args={[post, mat("#3a3631"), lamps.length]} />
      <instancedMesh ref={headRef} args={[lamp, head, lamps.length]} />
      <instancedMesh ref={trunkRef} args={[trunk, mat("#7a5a3f"), trees.length]} />
      <instancedMesh ref={crownRef} args={[crown, mat("#ffffff"), trees.length]} />
    </>
  );
};

/* ---------- 01 · Amritsar: the university gate, where it started ---------- */

const BRICK = "#b4573c";
const SAND = "#e6d6b8";
const CREAM = "#ece0c8";

const LineFollower = () => {
  const bot = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!bot.current || REDUCED) return;
    const a = clock.elapsedTime * 0.9;
    bot.current.position.set(Math.cos(a) * 1.16, 0.06, Math.sin(a) * 1.16);
    bot.current.rotation.y = -a;
  });
  return (
    <group position={[-3.4, 0, -1.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.1, 1.22, 48]} />
        <meshBasicMaterial color="#1b1a18" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#f7f3ea" />
      </mesh>
      <group ref={bot} position={[1.16, 0.06, 0]}>
        <Bx p={[0, 0.05, 0]} s={[0.22, 0.08, 0.3]} c={ORANGE} />
        <Bx p={[0, 0.12, -0.04]} s={[0.14, 0.06, 0.12]} c="#1f3d6e" />
      </group>
    </group>
  );
};

const Amritsar = () => (
  <Place k={1}>
    {/* campus gate: brick piers, sandstone caps, opening towards the road */}
    {[-1, 1].map((k) => (
      <group key={k}>
        <Bx p={[-6.8, 2.1, 2.2 + k * 2.6]} s={[1.05, 4.2, 1.05]} c={BRICK} />
        <Bx p={[-6.8, 4.33, 2.2 + k * 2.6]} s={[1.3, 0.26, 1.3]} c={SAND} />
        <Cy p={[-6.8, 4.75, 2.2 + k * 2.6]} r={0.08} rb={0.5} h={0.6} c={SAND} seg={8} />
      </group>
    ))}
    <Bx p={[-6.8, 3.85, 2.2]} s={[0.85, 0.7, 4.2]} c={BRICK} />
    <Bx p={[-6.8, 4.33, 2.2]} s={[1.05, 0.22, 4.4]} c={SAND} />
    <Cy p={[-6.8, 4.95, 2.2]} r={0.1} rb={0.75} h={0.95} c={SAND} seg={8} />
    {/* walkway through the gate and the faculty block behind it */}
    <Bx p={[-9, 0.02, 2.2]} s={[7.5, 0.04, 2.6]} c="#d9c8a8" />
    <Bx p={[-12.2, 1.7, 2.2]} s={[2.6, 3.4, 11]} c={CREAM} />
    {[-4, -2, 0, 2, 4].map((z) => (
      <Bx key={z} p={[-10.88, 1.9, 2.2 + z]} s={[0.06, 1.5, 0.9]} c="#7f6b55" />
    ))}
    <Bx p={[-12.2, 3.5, 2.2]} s={[2.9, 0.2, 11.3]} c={SAND} />
    <LineFollower />
    <Sign
      p={[-8.6, 0, 8.4]}
      lines={[
        { text: "01 · AMRITSAR · 2021–25", size: 30, mono: true, color: ORANGE },
        { text: "GURU NANAK DEV UNIVERSITY", size: 60, gap: 8 },
        { text: "B.Tech, Electronics & Communication", size: 34, mono: true, gap: 10 },
        {
          text: "31.63°N 74.87°E · where it started",
          size: 26,
          mono: true,
          color: "#6f6a61",
          gap: 14,
        },
      ]}
    />
  </Place>
);

/* ---------- 02 · Mumbai: the e-Yantra arena at IIT Bombay ---------- */

const fiducial = (seed: number) =>
  canvasTex(120, 120, (ctx) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = "#000";
    ctx.fillRect(10, 10, 100, 100);
    let s = seed;
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        s = (s * 9301 + 49297) % 233280;
        if (s / 233280 > 0.5) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(30 + i * 15, 30 + j * 15, 15, 15);
        }
      }
  });

const UR = "#c9d2da";
const UR_CAP = "#2b5aa0";

const Arena = () => {
  const arm = useRef<THREE.Group>(null);
  const amr = useRef<THREE.Group>(null);
  const matTex = useMemo(
    () =>
      canvasTex(512, 512, (ctx) => {
        ctx.fillStyle = "#17181b";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#f4f4f0";
        ctx.lineWidth = 6;
        ctx.strokeRect(14, 14, 484, 484);
        ctx.lineWidth = 3;
        for (let i = 1; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(14 + i * 80.7, 14);
          ctx.lineTo(14 + i * 80.7, 498);
          ctx.moveTo(14, 14 + i * 80.7);
          ctx.lineTo(498, 14 + i * 80.7);
          ctx.stroke();
        }
        ctx.fillStyle = ORANGE;
        ctx.fillRect(30, 30, 130, 130);
        ctx.fillStyle = "#2c5aa0";
        ctx.fillRect(352, 352, 130, 130);
      }),
    []
  );
  const tags = useMemo(() => [11, 42, 77].map(fiducial), []);
  useFrame(({ clock }) => {
    if (REDUCED) return;
    const e = clock.elapsedTime;
    if (arm.current) arm.current.rotation.y = Math.sin(e * 0.7) * 0.9;
    if (amr.current) {
      // a rectangular delivery loop on the mat
      const u = (e * 0.12) % 1;
      const P: [number, number][] = [
        [-4.4, -0.6],
        [-4.4, 4.6],
        [-9.4, 4.6],
        [-9.4, -0.6],
      ];
      const s = Math.floor(u * 4);
      const f = u * 4 - s;
      const a = P[s];
      const b = P[(s + 1) % 4];
      amr.current.position.set(a[0] + (b[0] - a[0]) * f, 0, a[1] + (b[1] - a[1]) * f);
      amr.current.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
    }
  });
  return (
    <Place k={2}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.9, 0.03, 2]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial map={matTex} roughness={0.9} />
      </mesh>
      {[
        [-6.9, -1.55, 7.2, 0.14],
        [-6.9, 5.55, 7.2, 0.14],
        [-10.45, 2, 0.14, 7.2],
        [-3.35, 2, 0.14, 7.2],
      ].map(([x, z, w, d], i) => (
        <Bx key={i} p={[x, 0.14, z]} s={[w, 0.28, d]} c="#f1efe9" />
      ))}
      {/* UR5-style arm on a pedestal, picking from the blue zone */}
      <group position={[-8.4, 0, 0.6]}>
        <Cy p={[0, 0.35, 0]} r={0.36} h={0.7} c="#3b3a37" />
        <group ref={arm} position={[0, 0.7, 0]}>
          <Cy p={[0, 0.15, 0]} r={0.2} h={0.3} c={UR_CAP} />
          <group position={[0, 0.32, 0]} rotation={[0, 0, -0.5]}>
            <Cy p={[0, 0.65, 0]} r={0.11} h={1.3} c={UR} />
            <Cy p={[0, 1.3, 0]} r={0.16} h={0.32} c={UR_CAP} rot={[Math.PI / 2, 0, 0]} />
            <group position={[0, 1.3, 0]} rotation={[0, 0, 1.6]}>
              <Cy p={[0, 0.55, 0]} r={0.09} h={1.1} c={UR} />
              <Cy p={[0, 1.12, 0]} r={0.12} h={0.22} c={UR_CAP} rot={[Math.PI / 2, 0, 0]} />
              <Bx p={[0, 1.3, 0]} s={[0.16, 0.22, 0.16]} c="#3b3a37" />
            </group>
          </group>
        </group>
      </group>
      {/* the mobile robot doing deliveries */}
      <group ref={amr} position={[-4.4, 0, -0.6]}>
        <Bx p={[0, 0.24, 0]} s={[0.62, 0.3, 0.82]} c="#2a2c31" />
        <Bx p={[0, 0.4, 0]} s={[0.64, 0.04, 0.84]} c={ORANGE} />
        <Bx p={[0, 0.55, 0.05]} s={[0.38, 0.26, 0.38]} c="#c99a62" />
        {[-1, 1].map((k) => (
          <Cy
            key={k}
            p={[k * 0.33, 0.11, 0.2]}
            r={0.11}
            h={0.08}
            c="#111"
            rot={[0, 0, Math.PI / 2]}
          />
        ))}
      </group>
      {/* parcels with fiducial tags */}
      {tags.map((tx, i) => (
        <group key={i} position={[-10, 0.2, 4.6 - i * 0.6]} rotation={[0, 0.3 * i, 0]}>
          <mesh material={mat("#c99a62")}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
          </mesh>
          <mesh position={[0.201, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial map={tx} />
          </mesh>
        </group>
      ))}
      <Sign
        p={[-8.6, 0, 8.4]}
        lines={[
          { text: "02 · MUMBAI · 2023–24", size: 30, mono: true, color: ORANGE },
          { text: "E-YANTRA, IIT BOMBAY", size: 62, gap: 8 },
          { text: "eYRC national finalist · E-YSIP intern 2024", size: 32, mono: true, gap: 10 },
          {
            text: "19.13°N 72.92°E · a UR5 and a mobile robot",
            size: 26,
            mono: true,
            color: "#6f6a61",
            gap: 14,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- 03 · Pune: the RigBetel warehouse, production Nav2 ---------- */

const Warehouse = () => {
  const amr = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!amr.current || REDUCED) return;
    const u = (Math.sin(clock.elapsedTime * 0.35) + 1) / 2;
    amr.current.position.z = -0.6 + u * 6.4;
    amr.current.rotation.y = Math.cos(clock.elapsedTime * 0.35) > 0 ? 0 : Math.PI;
  });
  const rack = (x: number) => (
    <group position={[x, 0, 0]}>
      {[-1, 1].map((sx) =>
        [-1.2, 0.6, 2.4, 4.2, 6].map((z) => (
          <Bx key={`${sx}${z}`} p={[sx * 0.55, 1.6, z]} s={[0.09, 3.2, 0.09]} c={ORANGE} />
        ))
      )}
      {[0.08, 1.15, 2.25].map((y) => (
        <group key={y}>
          {[-1, 1].map((sx) => (
            <Bx key={sx} p={[sx * 0.55, y + 0.05, 2.4]} s={[0.07, 0.12, 7.3]} c={BLUE} />
          ))}
          {[-0.4, 1.4, 3.2, 5.0].map((z, j) => (
            <Bx
              key={z}
              p={[0, y + 0.4, z + 0.1]}
              s={[0.85, 0.62 - ((j + y * 3) % 2) * 0.16, 1.2]}
              c={j % 2 ? "#c99a62" : "#d7ae78"}
            />
          ))}
        </group>
      ))}
    </group>
  );
  return (
    <Place k={3}>
      <Bx p={[-7.3, 0.01, 2.4]} s={[7.4, 0.02, 9]} c="#c9c6c0" />
      {rack(-9.6)}
      {rack(-5)}
      {/* aisle lanes */}
      {[-6.1, -8.5].map((x) => (
        <Bx key={x} p={[x, 0.03, 2.4]} s={[0.08, 0.02, 8.6]} c={TARS_YELLOW} />
      ))}
      {/* the AMR on its aisle run, with its local plan drawn ahead */}
      <group ref={amr} position={[-7.3, 0, 0]}>
        <Cy p={[0, 0.16, 0]} r={0.42} h={0.24} c="#2a2c31" seg={24} />
        <Cy p={[0, 0.3, 0]} r={0.43} h={0.04} c={ORANGE} seg={24} />
        <Cy p={[0, 0.4, 0.12]} r={0.09} h={0.12} c="#111" />
        <Bx p={[0, 0.04, 1.3]} s={[0.05, 0.01, 2]} c="#33c46a" e={0.8} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <ringGeometry args={[0.55, 0.95, 32]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
      {/* charging dock */}
      <Bx p={[-7.3, 0.3, -1.7]} s={[0.8, 0.6, 0.25]} c="#3b3a37" />
      <Bx p={[-7.3, 0.5, -1.56]} s={[0.3, 0.06, 0.02]} c="#33c46a" e={1.5} />
      <Sign
        p={[-8.6, 0, 8.4]}
        lines={[
          { text: "03 · PUNE · JULY 2025 → NOW", size: 30, mono: true, color: ORANGE },
          { text: "RIGBETEL LABS", size: 72, gap: 8 },
          { text: "Associate Robotics Developer", size: 34, mono: true, gap: 10 },
          {
            text: "18.52°N 73.86°E · Nav2 shipped to customers",
            size: 26,
            mono: true,
            color: "#6f6a61",
            gap: 14,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- 04 · the workshop: G1, OpenArm, AI.R and the stack on the wall ---------- */

const STACK_WALL = [
  ["NAVIGATION", "Nav2 plugins · ros2_control · BTs"],
  ["LOCALIZATION", "Beluga MCL · slam_toolbox · RTAB-Map · EKF"],
  ["SIMULATION", "Gazebo · MoveIt 2 · URDF · TF2"],
  ["EMBEDDED", "Ghidra · STM32 serial · C/C++ on ARM"],
  ["TOOLING", "Docker · colcon · CI for ROS · Linux"],
];

const Workshop = () => {
  const openarm = useRef<THREE.Group>(null);
  const wall = useMemo(
    () =>
      canvasTex(1024, 640, (ctx) => {
        ctx.fillStyle = "#d9cfbf";
        ctx.fillRect(0, 0, 1024, 640);
        ctx.fillStyle = "#b9ad99";
        for (let x = 24; x < 1024; x += 32)
          for (let y = 24; y < 640; y += 32) ctx.fillRect(x, y, 5, 5);
        ctx.fillStyle = INK;
        ctx.font = "900 44px Archivo, sans-serif";
        ctx.fillText("THE STACK", 48, 84);
        STACK_WALL.forEach(([k, v], i) => {
          ctx.fillStyle = ORANGE;
          ctx.font = "600 30px 'IBM Plex Mono', monospace";
          ctx.fillText(k, 48, 160 + i * 98);
          ctx.fillStyle = INK;
          ctx.font = "500 28px 'IBM Plex Mono', monospace";
          ctx.fillText(v, 48, 196 + i * 98);
        });
      }),
    []
  );
  useFrame(({ clock }) => {
    if (openarm.current && !REDUCED)
      openarm.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.7;
  });
  const G1 = "#2d2f34";
  const G1J = "#8e949c";
  return (
    <Place k={4}>
      <Bx p={[-7.4, 0.01, 2.4]} s={[7.6, 0.02, 8.4]} c="#d6cfc2" />
      {/* pegboard wall with the toolchain on it */}
      <group position={[-11, 0, 2.6]} rotation={[0, Math.PI / 2, 0]}>
        <Bx p={[0, 1.9, -0.06]} s={[5.4, 3.5, 0.08]} c="#8a7b66" />
        <mesh position={[0, 1.9, 0]}>
          <planeGeometry args={[5.2, 3.25]} />
          <meshBasicMaterial map={wall} toneMapped={false} />
        </mesh>
      </group>
      {/* workbench with OpenArm on it */}
      <Bx p={[-9, 0.92, 4]} s={[1.3, 0.1, 3.4]} c="#b0855a" />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Bx
            key={`${sx}${sz}`}
            p={[-9 + sx * 0.55, 0.45, 4 + sz * 1.55]}
            s={[0.08, 0.9, 0.08]}
            c="#3a3631"
          />
        ))
      )}
      <group position={[-9, 0.97, 4.6]}>
        <Cy p={[0, 0.08, 0]} r={0.17} h={0.16} c="#1f1f22" />
        <group ref={openarm} position={[0, 0.16, 0]}>
          <Cy p={[0, 0.3, 0]} r={0.06} h={0.6} c="#ece9e2" />
          <group position={[0, 0.6, 0]} rotation={[0.9, 0, 0]}>
            <Cy p={[0, 0, 0]} r={0.08} h={0.14} c="#1f1f22" rot={[0, 0, Math.PI / 2]} />
            <Cy p={[0, 0.26, 0]} r={0.05} h={0.52} c="#ece9e2" />
            <Bx p={[0, 0.56, 0]} s={[0.1, 0.12, 0.06]} c="#1f1f22" />
          </group>
        </group>
      </group>
      {/* a G1-style humanoid on its stand */}
      <group position={[-6.6, 0, 0.6]} rotation={[0, -0.5, 0]}>
        <Cy p={[0, 0.03, 0]} r={0.55} h={0.06} c="#3a3631" />
        {[-1, 1].map((k) => (
          <group key={k}>
            <Cy p={[k * 0.12, 0.32, 0]} r={0.06} h={0.5} c={G1} />
            <Cy p={[k * 0.12, 0.6, 0]} r={0.075} h={0.1} c={G1J} rot={[0, 0, Math.PI / 2]} />
            <Cy p={[k * 0.13, 0.85, 0]} r={0.07} h={0.46} c={G1} />
            <Cy p={[k * 0.27, 1.12, 0]} r={0.05} h={0.48} c={G1} />
            <Cy p={[k * 0.27, 1.37, 0]} r={0.065} h={0.09} c={G1J} rot={[0, 0, Math.PI / 2]} />
          </group>
        ))}
        <Bx p={[0, 1.22, 0]} s={[0.4, 0.5, 0.22]} c={G1} />
        <Bx p={[0, 1.24, 0.115]} s={[0.24, 0.16, 0.01]} c={G1J} />
        <Bx p={[0, 1.58, 0]} s={[0.2, 0.22, 0.2]} c={G1} />
        <Bx p={[0, 1.59, 0.101]} s={[0.15, 0.06, 0.01]} c="#7fb4ff" e={1.2} />
      </group>
      {/* AI.R: the small open-source mobile base */}
      <group position={[-4.6, 0, 3.6]}>
        <Cy p={[0, 0.12, 0]} r={0.32} h={0.14} c="#e9e6df" seg={20} />
        {[0.24, 0.38].map((y) => (
          <Cy key={y} p={[0, y, 0]} r={0.3} h={0.02} c="#3a3631" seg={20} />
        ))}
        {[-1, 1, 1, -1].map((k, i) => (
          <Cy
            key={i}
            p={[0.18 * k, 0.3, i < 2 ? 0.18 : -0.18]}
            r={0.012}
            h={0.16}
            c="#888"
            seg={6}
          />
        ))}
        <Cy p={[0, 0.45, 0]} r={0.08} h={0.08} c={ORANGE} />
      </group>
      <Sign
        p={[-8.6, 0, 8.4]}
        lines={[
          { text: "04 · THE WORKSHOP", size: 30, mono: true, color: ORANGE },
          { text: "WHAT I'VE BUILT", size: 70, gap: 8 },
          { text: "Unitree G1 · OpenArm · TARS · AI.R", size: 34, mono: true, gap: 10 },
          {
            text: "ROS 2 on real robots · the stack is on the wall",
            size: 26,
            mono: true,
            color: "#6f6a61",
            gap: 14,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- 05 · the vacuum lab: the real room map from one camera ---------- */

const RoomCloud = ({ t }: { t: number }) => {
  const [geom, setGeom] = useState<THREE.BufferGeometry | null>(null);
  const asked = useRef(false);
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    // fetch the map only as TARS gets close (it's half a megabyte)
    if (!asked.current && worldState.t > t - 0.3) {
      asked.current = true;
      fetch(`${import.meta.env.BASE_URL}world/room_map.bin`)
        .then((r) => r.arrayBuffer())
        .then((buf) => {
          const n = new DataView(buf).getUint32(0, true);
          const q = new Int16Array(buf, 4, n * 3);
          const c8 = new Uint8Array(buf, 4 + n * 6, n * 3);
          const pos = new Float32Array(n * 3);
          const col = new Float32Array(n * 3);
          for (let i = 0; i < n * 3; i++) {
            pos[i] = q[i] / 1000;
            col[i] = Math.pow(c8[i] / 255, 2.2); // sRGB → linear for three
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
          g.setAttribute("color", new THREE.BufferAttribute(col, 3));
          setGeom(g);
        });
    }
    if (spin.current && !REDUCED) spin.current.rotation.y += dt * 0.12;
  });
  return (
    <group ref={spin}>
      {geom && (
        <points geometry={geom} scale={1.05} position={[0.7, 0, -0.5]}>
          <pointsMaterial vertexColors size={0.06} sizeAttenuation />
        </points>
      )}
    </group>
  );
};

const VacuumLab = () => {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const u = REDUCED ? 0.5 : (clock.elapsedTime * 0.6) % 1;
    ring.current.scale.setScalar(0.4 + u * 3.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - u);
  });
  return (
    <Place k={5}>
      {/* plinth with the floating map */}
      <Cy p={[-7.4, 0.14, 2.6]} r={3.5} h={0.28} c="#23262d" seg={40} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.4, 0.29, 2.6]}>
        <ringGeometry args={[3.3, 3.42, 64]} />
        <meshBasicMaterial color={ORANGE} />
      </mesh>
      <group position={[-7.4, 0.75, 2.6]}>
        <RoomCloud t={WAYPOINTS[5].t} />
      </group>
      {/* the vacuum itself: one webcam on a mast, a lidar that sees one line */}
      <group position={[-2.9, 0, -0.4]} rotation={[0, -0.9, 0]}>
        <Cy p={[0, 0.07, 0]} r={0.35} h={0.1} c="#ecebe7" seg={28} />
        <Cy p={[0, 0.135, -0.08]} r={0.09} h={0.05} c="#2a2a2a" seg={16} />
        <Bx p={[0, 0.2, 0.22]} s={[0.03, 0.12, 0.03]} c="#2a2a2a" />
        <Bx p={[0, 0.27, 0.24]} s={[0.1, 0.05, 0.05]} c="#111" />
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.135, -0.08]}>
          <ringGeometry args={[0.98, 1, 64]} />
          <meshBasicMaterial color="#ff3b30" transparent opacity={0.7} depthWrite={false} />
        </mesh>
      </group>
      <Sign
        p={[-8.6, 0, 8.4]}
        lines={[
          { text: "05 · THE VACUUM", size: 30, mono: true, color: ORANGE },
          { text: "A VACUUM, REVERSE-ENGINEERED", size: 58, gap: 8 },
          { text: "Ghidra → STM32 protocol → C bridge → ROS 2", size: 31, mono: true, gap: 10 },
          {
            text: "floating: my room, from one camera · real points",
            size: 26,
            mono: true,
            color: "#6f6a61",
            gap: 14,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- 06 · Bengaluru: the ROSCon India stage, fly-through on the screen ---------- */

const StageScreen = ({ t }: { t: number }) => {
  const video = useMemo(() => {
    const v = document.createElement("video");
    v.src = houseFly;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "none";
    return v;
  }, []);
  const tex = useMemo(() => {
    const x = new THREE.VideoTexture(video);
    x.colorSpace = THREE.SRGBColorSpace;
    return x;
  }, [video]);
  useFrame(() => {
    const near = Math.abs(worldState.t - t) < 0.1;
    if (near && video.paused)
      video.play().catch(() => {}); // a pause() can interrupt it; that's fine
    else if (!near && !video.paused) video.pause();
  });
  useEffect(
    () => () => {
      video.pause();
      tex.dispose();
    },
    [video, tex]
  );
  return (
    <mesh>
      <planeGeometry args={[6.4, 3.6]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

// the screen faces the road, turned halfway towards the parked camera
const BigScreen = () => {
  const { face } = useContext(FaceCtx);
  const yaw = (Math.atan2(face[0] + 10.2, face[2] - 3.4) - Math.PI / 2) * 0.5;
  return (
    <group position={[-10.2, 3.3, 3.4]} rotation={[0, Math.PI / 2 + yaw, 0]}>
      <Bx p={[0, 0, -0.08]} s={[6.8, 4, 0.12]} c="#0c0d11" />
      <StageScreen t={WAYPOINTS[6].t} />
    </group>
  );
};

const Stage = () => {
  const seats = useRef<THREE.InstancedMesh>(null);
  const seatMats = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 7; c++)
        out.push(new THREE.Matrix4().makeTranslation(-3.6 + r * 0.8, 0, 0.2 + c * 0.75));
    return out;
  }, []);
  useLayoutEffect(() => {
    seatMats.forEach((m, i) => seats.current?.setMatrixAt(i, m));
    if (seats.current) seats.current.instanceMatrix.needsUpdate = true;
  }, [seatMats]);
  // a seat: cushion plus a backrest on the road side (the audience faces the stage)
  const seatGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(0.5, 0.12, 0.6).translate(0, 0.42, 0);
    const back = new THREE.BoxGeometry(0.08, 0.5, 0.6).translate(0.24, 0.68, 0);
    const merged = new THREE.BufferGeometry();
    const pos = [
      ...g.toNonIndexed().attributes.position.array,
      ...back.toNonIndexed().attributes.position.array,
    ];
    merged.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    merged.computeVertexNormals();
    return merged;
  }, []);
  return (
    <Place k={6}>
      <Bx p={[-8.4, 0.35, 2.6]} s={[4.6, 0.7, 9.4]} c="#1d1f27" />
      <Bx p={[-6.08, 0.62, 2.6]} s={[0.04, 0.06, 9.4]} c={ORANGE} e={2.2} />
      {/* the screen, playing the house fly-through */}
      <BigScreen />
      {/* lectern */}
      <Bx p={[-7.2, 1.25, -0.6]} s={[0.55, 1.1, 0.5]} c="#2d303a" />
      <Bx p={[-6.92, 1.3, -0.6]} s={[0.02, 0.5, 0.36]} c={ORANGE} e={1.2} />
      {/* lighting truss with three spots */}
      <Bx p={[-7.2, 6.4, 2.6]} s={[0.22, 0.22, 10]} c="#2a2a2e" />
      {[-1, 0, 1].map((k) => (
        <group key={k} position={[-7.2, 6.2, 2.6 + k * 3]}>
          <Bx p={[0, 0, 0]} s={[0.3, 0.3, 0.3]} c="#ffe6b0" e={2} />
          <mesh position={[0, -2.9, 0]}>
            <cylinderGeometry args={[0.12, 1.4, 5.6, 24, 1, true]} />
            <meshBasicMaterial
              color="#ffd79a"
              transparent
              opacity={0.07}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((k) => (
        <Bx key={k} p={[-7.2, 3.2, 2.6 + k * 5]} s={[0.18, 6.4, 0.18]} c="#2a2a2e" />
      ))}
      <instancedMesh ref={seats} args={[seatGeom, mat("#7a2f2a"), seatMats.length]} />
      <Sign
        p={[-6.4, 0, 10.6]}
        lift={1.6}
        lines={[
          { text: "06 · BENGALURU · DEC 2026", size: 30, mono: true, color: ORANGE },
          { text: "ROSCON INDIA 2026", size: 70, gap: 8 },
          {
            text: "Main stage: Odometry and a 3D map from one camera",
            size: 30,
            mono: true,
            gap: 10,
          },
          {
            text: "12.97°N 77.59°E · on screen: the house, 54 m",
            size: 26,
            mono: true,
            color: "#6f6a61",
            gap: 14,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- 07 · next: the runway at night, a departure board ---------- */

const Gate = () => {
  const flag = useRef<THREE.Mesh>(null);
  const rabbit = useRef<THREE.Group>(null);
  const edge = useRef<THREE.InstancedMesh>(null);
  const edgeMats = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    for (let z = 6; z < 150; z += 4)
      for (const x of [-5.6, 5.6]) out.push(new THREE.Matrix4().makeTranslation(x, 0.08, z));
    return out;
  }, []);
  useLayoutEffect(() => {
    edgeMats.forEach((m, i) => edge.current?.setMatrixAt(i, m));
    if (edge.current) edge.current.instanceMatrix.needsUpdate = true;
  }, [edgeMats]);
  const lightGeom = useMemo(() => new THREE.BoxGeometry(0.22, 0.12, 0.22), []);
  const lightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dfe8ff",
        emissive: "#bcd0ff",
        emissiveIntensity: 0,
      }),
    []
  );
  useFrame(({ clock }) => {
    const e = clock.elapsedTime;
    if (flag.current) flag.current.rotation.y = Math.sin(e * 1.4) * 0.18;
    lightMat.emissiveIntensity = 0.3 + env.lamps * 2.4;
    if (rabbit.current) {
      rabbit.current.position.z = 6 + ((REDUCED ? 0.2 : e * 0.45) % 1) * 140;
      rabbit.current.visible = env.lamps > 0.2;
    }
  });
  return (
    <Place k={7}>
      {/* runway out to the horizon */}
      <Bx p={[0, 0.012, 78]} s={[11.4, 0.02, 148]} c="#1d2333" />
      {Array.from({ length: 30 }).map((_, i) => (
        <Bx key={i} p={[0, 0.03, 8 + i * 4.8]} s={[0.22, 0.01, 2.2]} c="#e9edf5" />
      ))}
      <instancedMesh ref={edge} args={[lightGeom, lightMat, edgeMats.length]} />
      <group ref={rabbit} position={[0, 0.25, 6]}>
        <Bx p={[0, 0, 0]} s={[0.5, 0.2, 0.5]} c={ORANGE} e={3} />
      </group>
      {/* the gate: lit beam and a flag */}
      <group position={[0, 0, 3.2]}>
        {[-1.9, 1.9].map((sx, i) => (
          <Bx key={i} p={[sx, 2, 0]} s={[0.18, 4, 0.18]} c={INK} />
        ))}
        <Bx p={[0, 4.05, 0]} s={[4, 0.22, 0.22]} c={ORANGE} e={1.6} />
        <Cy p={[1.9, 4.9, 0]} r={0.03} h={1.6} c={INK} seg={8} />
        <mesh ref={flag} position={[1.9, 5.3, 0]}>
          <mesh position={[0.5, 0, 0]}>
            <planeGeometry args={[1, 0.56]} />
            <meshBasicMaterial color={ORANGE} side={THREE.DoubleSide} />
          </mesh>
        </mesh>
      </group>
      <Sign
        p={[-8.4, 0, 12.5]}
        w={5.4}
        h={2.7}
        lift={3}
        dark
        lines={[
          { text: "DEPARTURES · 2027 · GATE 07", size: 30, mono: true, color: "#ffb547" },
          { text: "NEXT: A MASTER'S IN ROBOTICS", size: 64, gap: 10 },
          {
            text: "destination  ABROAD      status  APPLYING",
            size: 34,
            mono: true,
            color: "#ffb547",
            gap: 14,
          },
          {
            text: "from Amritsar, via Pune · email is best",
            size: 27,
            mono: true,
            color: "#9aa7c4",
            gap: 16,
          },
        ]}
      />
    </Place>
  );
};

/* ---------- warm motes in the air ---------- */

const Dust = () => {
  const points = useRef<THREE.Points>(null);
  const geom = useMemo(() => {
    const N = 520;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = Math.random() * 150 - 8;
      pos[i * 3 + 1] = Math.random() * 8.5 + 0.6;
      pos[i * 3 + 2] = Math.random() * 40 - 20;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (points.current) points.current.position.y = Math.sin(clock.elapsedTime * 0.3) * 0.25;
  });
  return (
    <points ref={points} geometry={geom}>
      <pointsMaterial
        color="#c39a72"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </points>
  );
};

/* ---------- the rig: scroll → pose, gait, chase camera, parked shots ---------- */

const Rig = ({ reduced }: { reduced: boolean }) => {
  const tars = useRef<THREE.Group>(null);
  const outerL = useRef<THREE.Group>(null);
  const innerL = useRef<THREE.Group>(null);
  const innerR = useRef<THREE.Group>(null);
  const outerR = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);

  const energy = useRef(0);
  const spin = useRef(0);
  const vel = useRef({ v: 0, w: 0 });
  const phaseAcc = useRef(0);
  // debug override: ?t=0.4 freezes the route progress for visual tuning
  const forceT = useRef<number | null>(
    (() => {
      const v = new URLSearchParams(window.location.search).get("t");
      return v ? Math.min(1, Math.max(0, parseFloat(v))) : null;
    })()
  );
  const look = useRef(new THREE.Vector3(2, 1.3, 0));
  const camPos = useRef(new THREE.Vector3(-7, 3.4, 1.6));
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3() }), []);

  useFrame(({ camera, size }, dtRaw) => {
    const dt = Math.min(Math.max(dtRaw, 1e-4), 0.05); // never 0 — speed = Δ/dt below

    let pose: { x: number; z: number; heading: number };
    let eTarget: number;

    if (worldState.mode === "teleop") {
      // velocity smoothing with accel limits, like a real base controller
      const dv = THREE.MathUtils.clamp(worldState.cmd.v - vel.current.v, -2.6 * dt, 2.6 * dt);
      const dw = THREE.MathUtils.clamp(worldState.cmd.w - vel.current.w, -5.5 * dt, 5.5 * dt);
      vel.current.v += dv;
      vel.current.w += dw;

      const f = worldState.free;
      f.heading += vel.current.w * dt;
      const nx = f.x + Math.sin(f.heading) * vel.current.v * dt;
      const nz = f.z + Math.cos(f.heading) * vel.current.v * dt;
      if (!collides(nx, nz)) {
        f.x = nx;
        f.z = nz;
      } else {
        vel.current.v = 0; // bumper hit — stop linear motion
      }
      pose = { x: f.x, z: f.z, heading: f.heading };
      phaseAcc.current += Math.abs(vel.current.v) * dt * STRIDE_K;
      eTarget = Math.min(1, Math.abs(vel.current.v) / 1.4 + Math.abs(vel.current.w) / 3.0);
    } else {
      const raw = forceT.current ?? scrollToRoute();
      const prev = worldState.t;
      worldState.t += (raw - worldState.t) * (1 - Math.exp(-4 * dt));
      const speed = Math.abs(worldState.t - prev) / dt; // progress/s
      pose = getPose(worldState.t);
      phaseAcc.current = worldState.t * PATH_LENGTH * STRIDE_K;
      eTarget = Math.min(1, speed * 60);
    }

    energy.current = THREE.MathUtils.lerp(energy.current, eTarget, 1 - Math.exp(-6 * dt));
    spin.current += (worldState.spinTarget - spin.current) * Math.min(1, dt * 5);

    const e = reduced ? 0 : energy.current;
    const phase = phaseAcc.current;
    const swing = Math.sin(phase) * 0.42 * e;
    const bob = Math.abs(Math.sin(phase)) * 0.07 * e;
    const idleBob = reduced ? 0 : Math.sin(performance.now() / 800) * 0.015;

    if (tars.current) {
      tars.current.position.set(pose.x, bob + idleBob, pose.z);
      tars.current.rotation.y = pose.heading + spin.current;
      tars.current.rotation.z = Math.sin(phase) * 0.028 * e;
    }
    if (outerL.current) outerL.current.rotation.x = swing;
    if (outerR.current) outerR.current.rotation.x = -swing;
    if (innerL.current) innerL.current.rotation.x = -swing * 0.2;
    if (innerR.current) innerR.current.rotation.x = swing * 0.2;
    if (shadow.current) {
      shadow.current.position.set(pose.x, 0.012, pose.z);
      const s = 1 - (bob + idleBob) * 0.5;
      shadow.current.scale.set(s, s, s);
    }

    // which place we're parked at, and how parked (0 while driving)
    let stop = 0;
    let at = -1;
    if (worldState.mode !== "teleop") {
      WAYPOINTS.forEach((wp, k) => {
        const s = 1 - Math.min(1, Math.abs(worldState.t - wp.t) / 0.06);
        if (s > stop) {
          stop = s;
          at = k;
        }
      });
      stop = stop * stop * (3 - 2 * stop);
    }
    const isPhone = size.width < 768;
    const wide = isPhone ? 1.6 : 0;

    // chase camera: behind & above, a little to the left
    const dir = new THREE.Vector3(Math.sin(pose.heading), 0, Math.cos(pose.heading));
    const side = new THREE.Vector3(dir.z, 0, -dir.x); // +side is screen-left
    const target = new THREE.Vector3(pose.x, 3.2 + wide * 0.4, pose.z)
      .addScaledVector(dir, -(7 + wide))
      .addScaledVector(side, 2.2);
    const lookTarget = new THREE.Vector3(pose.x, 1.3, pose.z).addScaledVector(dir, 5);

    // parked: ease into that place's framed shot
    if (at > 0) {
      const shot = SHOTS[at] ?? SHOT;
      toWorld(FRAMES[at], shot.cam, tmp.a);
      toWorld(FRAMES[at], shot.look, tmp.b);
      if (isPhone) tmp.a.sub(tmp.b).multiplyScalar(1.7).add(tmp.b); // narrow screen: step back
      target.lerp(tmp.a, stop);
      lookTarget.lerp(tmp.b, stop);
    }
    camPos.current.lerp(target, 1 - Math.exp(-3 * dt));
    look.current.lerp(lookTarget, 1 - Math.exp(-3 * dt));
    camera.position.copy(camPos.current);
    camera.lookAt(look.current);

    // compose around the board: subject right of it on desktop, above the sheet on phones
    const w = size.width;
    const h = size.height;
    (camera as THREE.PerspectiveCamera).setViewOffset(
      w,
      h,
      isPhone ? 0 : -w * (0.08 + 0.02 * stop),
      isPhone ? h * 0.22 * stop : 0,
      w,
      h
    );
  });

  return (
    <>
      <group ref={tars}>
        <Slab x={SLAB_X[0]} slabRef={outerL} dark letters />
        <Slab x={SLAB_X[1]} slabRef={innerL} led />
        <Slab x={SLAB_X[2]} slabRef={innerR} />
        <Slab x={SLAB_X[3]} slabRef={outerR} dark />
      </group>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.85, 28]} />
        <meshBasicMaterial color={INK} transparent opacity={0.16} />
      </mesh>
    </>
  );
};

/* ---------- root ---------- */

const TarsWorld = () => {
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [-7, 3.4, 1.6], fov: 38, far: 1200 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <Atmosphere />
        <pointLight
          position={[getPose(1).x, 4, getPose(1).z]}
          intensity={18}
          distance={16}
          color={ORANGE}
        />
        <Dust />

        <Corridor />
        <PlanLine />
        <TraceLine />
        <Roadside />
        <Amritsar />
        <Arena />
        <Warehouse />
        <Workshop />
        <VacuumLab />
        <Stage />
        <Gate />
        {WAYPOINTS.map((w) => (
          <Projector key={`proj-${w.id}`} t={w.t} />
        ))}
        <Rig reduced={reduced} />
      </Canvas>
    </div>
  );
};

export default TarsWorld;
