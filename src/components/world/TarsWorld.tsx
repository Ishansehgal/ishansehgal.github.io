import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getPose,
  tracePose,
  collides,
  panelAnchor,
  WAYPOINTS,
  OBSTACLES,
  PATH_LENGTH,
  worldState,
} from "./path";

const STRIDE_K = (Math.PI * 2) / 1.15; // gait phase per metre (one stride ≈ 1.15 m)

const PAPER = "#f4f1ea";
const INK = "#211f1b";
const ORANGE = "#f54e00";
const BLUE = "#2c5aa0";
const TARS_GREY = "#9a968f"; // brushed-grey slabs
const TARS_DARK = "#2c2925"; // black 3D-printed slabs (the ones carrying TARS)
const TARS_YELLOW = "#f2c230";

const TRACE_N = 600;

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

/* ---------- waypoint markers that rise from the ground ---------- */

const makeLabelTexture = (text: string) => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, c.width - 6, c.height - 6);
  ctx.fillStyle = INK;
  ctx.font = "600 56px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, c.width / 2, c.height / 2 + 4);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
};

const Waypoint = ({ t, label, side }: { t: number; label: string; side: number }) => {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);
  const pose = useMemo(() => {
    const p = getPose(t);
    // signpost stands beside the road
    return { x: p.x + Math.cos(p.heading) * 1.9 * side, z: p.z - Math.sin(p.heading) * 1.9 * side };
  }, [t, side]);
  const tex = useMemo(() => makeLabelTexture(label), [label]);
  const { camera } = useThree();

  useFrame(() => {
    const f =
      worldState.mode === "teleop"
        ? THREE.MathUtils.smoothstep(
            1 -
              THREE.MathUtils.clamp(
                (Math.hypot(worldState.free.x - pose.x, worldState.free.z - pose.z) - 3) / 6,
                0,
                1
              ),
            0,
            1
          )
        : THREE.MathUtils.smoothstep(1 - Math.min(1, Math.abs(worldState.t - t) * 7), 0, 1);
    if (group.current) {
      group.current.scale.setScalar(Math.max(0.0001, f));
      group.current.position.y = (f - 1) * 1.2;
    }
    plate.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group position={[pose.x, 0, pose.z]}>
      <group ref={group}>
        {/* pylon */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[0.09, 2.5, 0.09]} />
          <meshStandardMaterial color={INK} />
        </mesh>
        {/* floating label plate (billboard) */}
        <mesh ref={plate} position={[0, 2.6, 0]}>
          <planeGeometry args={[1.9, 0.475]} />
          <meshBasicMaterial map={tex} side={THREE.DoubleSide} />
        </mesh>
        {/* ground ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.55, 0.72, 40]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
};

/* ---------- goal flag at the end of the plan ---------- */

const Goal = () => {
  const pose = useMemo(() => getPose(1), []);
  const flag = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.y = Math.sin(clock.elapsedTime * 1.4) * 0.18;
  });
  return (
    <group position={[pose.x, 0, pose.z]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 3.2, 10]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh ref={flag} position={[0, 2.85, 0]}>
        <mesh position={[0.55, 0, 0]}>
          <planeGeometry args={[1.1, 0.6]} />
          <meshBasicMaterial color={ORANGE} side={THREE.DoubleSide} />
        </mesh>
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.8, 1.05, 48]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.55} />
      </mesh>
    </group>
  );
};

/* ---------- static scene pieces ---------- */

const Obstacles = () => {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#cdc8bc", roughness: 0.85, metalness: 0.05 }),
    []
  );
  return (
    <group>
      {OBSTACLES.map((o, i) => (
        <group key={i} position={[o.x, 0, o.z]}>
          <mesh material={material} position={[0, o.h / 2, 0]}>
            <boxGeometry args={[o.w, o.h, o.d]} />
          </mesh>
          {/* costmap inflation halo */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
            <circleGeometry args={[Math.max(o.w, o.d) * 0.85, 24]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.07} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

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
  const geometry = useMemo(() => new THREE.TubeGeometry(new PlanCurve(), 360, 0.03, 6), []);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={ORANGE} />
    </mesh>
  );
};

const TraceLine = () => {
  const line = useRef<THREE.Line>(null);
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
      ref={line}
      object={useMemo(
        () => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: BLUE })),
        [geometry]
      )}
    />
  );
};

/* ---------- the navigable free-space corridor along the plan ---------- */

const Corridor = () => {
  const geometry = useMemo(() => {
    const N = 240;
    const hw = 1.7; // half-width of the drivable ribbon
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const p = getPose(i / N);
      const nx = Math.cos(p.heading); // lateral normal (matches waypoint offset convention)
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
      <meshBasicMaterial color={BLUE} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

/* ---------- projector pad + light beam under each waypoint ---------- */

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
        : THREE.MathUtils.smoothstep(1 - Math.min(1, Math.abs(worldState.t - t) * 6), 0, 1);
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
      {/* glowing landing pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.25, 56]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.15, 1.32, 64]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      {/* projected light cone rising from the pad */}
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

/* ---------- distant scenery for depth ---------- */

const SCENERY: [number, number, number][] = [
  [3, 13, 4.5], [9, -14, 6], [24, 15, 7.5], [30, -15, 5.5],
  [38, 14, 6.5], [46, -13, 5], [44, 13, 7], [16, 15, 5],
];

const Scenery = () => {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d7d2c6", roughness: 0.95, metalness: 0 }),
    []
  );
  return (
    <group>
      {SCENERY.map(([x, z, h], i) => (
        <mesh key={i} material={material} position={[x, h / 2, z]}>
          <boxGeometry args={[1.1, h, 1.1]} />
        </mesh>
      ))}
    </group>
  );
};

/* ---------- the rig: scroll → pose, gait, chase camera ---------- */

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
  const anchors = useMemo(
    () => WAYPOINTS.map((w) => new THREE.Vector3(...panelAnchor(w.t))),
    []
  );
  const projV = useRef(new THREE.Vector3());

  useFrame(({ camera }, dtRaw) => {
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
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const raw =
        forceT.current ?? (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      const prev = worldState.t;
      worldState.t += (raw - worldState.t) * (1 - Math.exp(-4 * dt));
      const speed = Math.abs(worldState.t - prev) / dt; // progress/s
      pose = getPose(worldState.t);
      phaseAcc.current = worldState.t * PATH_LENGTH * STRIDE_K;
      eTarget = Math.min(1, speed * 28);
    }

    energy.current = THREE.MathUtils.lerp(energy.current, eTarget, 1 - Math.exp(-6 * dt));
    spin.current += (worldState.spinTarget - spin.current) * Math.min(1, dt * 5);

    const e = reduced ? 0 : energy.current;
    const phase = phaseAcc.current;
    const swing = Math.sin(phase) * 0.5 * e;
    const bob = Math.abs(Math.sin(phase)) * 0.08 * e;
    const idleBob = reduced ? 0 : Math.sin(performance.now() / 800) * 0.015;

    if (tars.current) {
      tars.current.position.set(pose.x, bob + idleBob, pose.z);
      tars.current.rotation.y = pose.heading + spin.current;
      tars.current.rotation.z = Math.sin(phase) * 0.035 * e;
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

    // chase camera: behind, above, offset so TARS sits right of frame center
    const dir = new THREE.Vector3(Math.sin(pose.heading), 0, Math.cos(pose.heading));
    const side = new THREE.Vector3(dir.z, 0, -dir.x); // TARS appears right of center
    const wide = window.innerWidth < 768 ? 1.5 : 0; // pull back a bit on phones
    const target = new THREE.Vector3(pose.x, 0, pose.z)
      .addScaledVector(dir, -6.4 - wide)
      .addScaledVector(side, 2.6)
      .add(new THREE.Vector3(0, 3.1 + wide * 0.4, 0));
    camPos.current.lerp(target, 1 - Math.exp(-3 * dt));
    camera.position.copy(camPos.current);

    const lookTarget = new THREE.Vector3(pose.x, 1.35, pose.z)
      .addScaledVector(dir, 2.2)
      .addScaledVector(side, 1.0);
    look.current.lerp(lookTarget, 1 - Math.exp(-3 * dt));
    camera.lookAt(look.current);

    // project each waypoint's side-anchor to screen px so the DOM banner can
    // park there — rising as TARS nears, sinking as it passes
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const teleop = worldState.mode === "teleop";
    for (let i = 0; i < anchors.length; i++) {
      const pr = worldState.panels[i];
      projV.current.copy(anchors[i]).project(camera);
      const behind = projV.current.z > 1;
      const fRaw = teleop
        ? 0
        : THREE.MathUtils.smoothstep(
            1 - Math.min(1, Math.abs(worldState.t - WAYPOINTS[i].t) * 5.5),
            0,
            1
          );
      const on =
        !behind && fRaw > 0.02 && projV.current.x > -1.35 && projV.current.x < 1.35;
      pr.sx = (projV.current.x * 0.5 + 0.5) * w;
      pr.sy = (-projV.current.y * 0.5 + 0.5) * h;
      pr.f = on ? fRaw : 0;
      pr.on = on;
    }
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
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [-7, 3.4, 1.6], fov: 38 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <color attach="background" args={[PAPER]} />
        <fog attach="fog" args={[PAPER, 24, 64]} />
        <hemisphereLight args={["#fff7ec", "#9a958c", 1.05]} />
        <directionalLight position={[6, 10, 4]} intensity={1.25} />
        <directionalLight position={[-6, 4, -3]} intensity={0.4} color="#ffe1c4" />
        <pointLight position={[getPose(1).x, 4, getPose(1).z]} intensity={18} distance={16} color={ORANGE} />

        {/* ground + grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color={PAPER} roughness={1} metalness={0} />
        </mesh>
        <gridHelper
          args={[400, 200, new THREE.Color("#9db4d4"), new THREE.Color("#c4cfde")]}
          position={[0, 0.001, 0]}
        >
          <lineBasicMaterial attach="material" color="#b7c4d8" transparent opacity={0.35} />
        </gridHelper>

        <Corridor />
        <PlanLine />
        <TraceLine />
        <Obstacles />
        <Scenery />
        {WAYPOINTS.map((w, i) => (
          <Waypoint key={w.id} t={w.t} label={w.label} side={i % 2 === 0 ? -1 : 1} />
        ))}
        {WAYPOINTS.map((w) => (
          <Projector key={`proj-${w.id}`} t={w.t} />
        ))}
        <Goal />
        <Rig reduced={reduced} />
      </Canvas>
    </div>
  );
};

export default TarsWorld;
