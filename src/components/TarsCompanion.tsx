import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTION_IDS = ["home", "about", "journey", "research", "projects", "expertise", "contact"];

const NARRATION: Record<string, { label: string; line: string }> = {
  home: {
    label: "boot",
    line: "TARS online. He built my hardware twin from scratch — footage further down. Scroll; I'll walk.",
  },
  about: {
    label: "mission",
    line: "Mission brief: four research interests, one operating principle — read the machine at every layer.",
  },
  journey: {
    label: "journey",
    line: "Career log, newest first. RigBetel Labs today; e-Yantra at IIT Bombay before that.",
  },
  research: {
    label: "research",
    line: "He gave a vacuum root access, decompiled its firmware, and now it speaks ROS2. The vacuum is fine.",
  },
  projects: {
    label: "projects",
    line: "Six systems on real hardware. P-04 is my chassis. I'm told the gait was the hard part.",
  },
  expertise: {
    label: "stack",
    line: "The toolchain — Nav2, SLAM, Ghidra, simulation. Everything used to build the sections above.",
  },
  contact: {
    label: "contact",
    line: "He's aiming at graduate research in robotics. Email works best. I don't forward messages — I'm a render.",
  },
};

const QUIPS = [
  "Humor setting: 75 percent.",
  "Honesty setting: 90 percent — this walk cycle is procedural.",
  "Sixteen segments, zero servos. The hardware version has the servos.",
  "Cue light's broken. Assume that was a joke.",
];

// shared scroll/interaction state, written by listeners and read inside useFrame
type MotionState = { energy: number; phase: number; spinTarget: number; spin: number };

const SLAB_W = 0.32;
const SLAB_H = 2.6;
const SLAB_D = 0.3;
const GAP = 0.06;
const SEGMENTS = 4;
const SEG_GAP = 0.055;
const SEG_H = (SLAB_H - (SEGMENTS - 1) * SEG_GAP) / SEGMENTS;
const SLAB_X = [-1.5, -0.5, 0.5, 1.5].map((m) => m * (SLAB_W + GAP));

const Slab = ({
  x,
  slabRef,
  led,
  screen,
}: {
  x: number;
  slabRef?: React.Ref<THREE.Group>;
  led?: boolean;
  screen?: boolean;
}) => {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3b352b"),
        metalness: 0.45,
        roughness: 0.5,
      }),
    []
  );

  return (
    // pivot at the slab's top so swing rotation reads like the crutch gait
    <group ref={slabRef} position={[x, SLAB_H / 2, 0]}>
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
        {led && (
          <mesh position={[0, SLAB_H / 2 - 0.18, SLAB_D / 2 + 0.012]}>
            <boxGeometry args={[0.08, 0.08, 0.03]} />
            <meshStandardMaterial color="#ff4d00" emissive="#ff4d00" emissiveIntensity={2.2} />
          </mesh>
        )}
        {screen && (
          <mesh position={[0, SLAB_H / 2 - 0.45, SLAB_D / 2 + 0.008]}>
            <planeGeometry args={[0.2, 0.46]} />
            <meshStandardMaterial color="#6b6353" roughness={0.3} metalness={0.3} />
          </mesh>
        )}
      </group>
    </group>
  );
};

const TarsModel = ({ motion, reduced }: { motion: React.MutableRefObject<MotionState>; reduced: boolean }) => {
  const body = useRef<THREE.Group>(null);
  const outerL = useRef<THREE.Group>(null);
  const innerL = useRef<THREE.Group>(null);
  const innerR = useRef<THREE.Group>(null);
  const outerR = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const m = motion.current;
    const t = state.clock.elapsedTime;

    if (!reduced) {
      // walk energy decays once scrolling stops
      m.energy *= Math.exp(-dt * 2.4);
      m.phase += dt * m.energy * 11;
    }
    // click spin eases toward its target
    m.spin += (m.spinTarget - m.spin) * Math.min(1, dt * 6);

    const swing = reduced ? 0 : Math.sin(m.phase) * 0.5 * Math.min(1, m.energy * 3);
    const idleBob = reduced ? 0 : Math.sin(t * 1.3) * 0.018;
    const walkBob = reduced ? 0 : Math.abs(Math.sin(m.phase)) * 0.07 * Math.min(1, m.energy * 3);
    const idleYaw = reduced ? 0 : Math.sin(t * 0.4) * 0.07;

    if (outerL.current) outerL.current.rotation.x = swing;
    if (outerR.current) outerR.current.rotation.x = -swing;
    if (innerL.current) innerL.current.rotation.x = -swing * 0.18;
    if (innerR.current) innerR.current.rotation.x = swing * 0.18;
    if (body.current) {
      body.current.position.y = -SLAB_H / 2 + idleBob + walkBob;
      body.current.rotation.y = -0.42 + idleYaw + m.spin;
      body.current.rotation.z = reduced ? 0 : Math.sin(m.phase) * 0.03 * Math.min(1, m.energy * 3);
    }
  });

  return (
    <group ref={body} position={[0, -SLAB_H / 2, 0]} rotation={[0, -0.42, 0]}>
      <Slab x={SLAB_X[0]} slabRef={outerL} />
      <Slab x={SLAB_X[1]} slabRef={innerL} led />
      <Slab x={SLAB_X[2]} slabRef={innerR} screen />
      <Slab x={SLAB_X[3]} slabRef={outerR} />
      {/* ground shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.95, 32]} />
        <meshBasicMaterial color="#1c1a17" transparent opacity={0.14} />
      </mesh>
    </group>
  );
};

const supportsWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const TarsCompanion = () => {
  const active = useActiveSection(SECTION_IDS);
  const motion = useRef<MotionState>({ energy: 0, phase: 0, spinTarget: 0, spin: 0 });
  const [quip, setQuip] = useState<string | null>(null);
  const quipIndex = useRef(0);
  const quipTimer = useRef<ReturnType<typeof setTimeout>>();
  const [odom, setOdom] = useState(0);
  const [goal, setGoal] = useState(0);
  const [webgl] = useState(supportsWebGL);
  const reduced = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      motion.current.energy = Math.min(1.2, motion.current.energy + dy / 260);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setOdom(window.scrollY / 100);
      setGoal(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPoke = () => {
    motion.current.spinTarget += Math.PI * 2;
    setQuip(QUIPS[quipIndex.current % QUIPS.length]);
    quipIndex.current += 1;
    clearTimeout(quipTimer.current);
    quipTimer.current = setTimeout(() => setQuip(null), 4200);
  };

  if (!webgl) return null;

  const n = NARRATION[active] ?? NARRATION.home;
  const text = quip ?? n.line;

  return (
    <div className="fixed bottom-3 right-3 z-40 hidden md:flex flex-row items-end gap-2 pointer-events-none">
      {/* speech panel */}
      <div className="pointer-events-auto w-64 border border-border bg-card/90 backdrop-blur px-3.5 py-3 mb-2">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
            tars · {quip ? "aside" : n.label}
          </span>
          <span>
            {odom.toFixed(1)} m · {goal}%
          </span>
        </div>
        <p key={text} className="font-mono text-[11px] leading-relaxed text-foreground bootline" style={{ "--boot-delay": "60ms" } as React.CSSProperties}>
          {text}
        </p>
      </div>

      {/* 3D stage */}
      <div
        className="pointer-events-auto w-36 h-44 cursor-pointer"
        onClick={onPoke}
        title="poke TARS"
        aria-label="Animated TARS robot — click for a remark"
        role="img"
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0.15, 0.55, 6.4], fov: 30 }}
          onCreated={({ camera }) => camera.lookAt(-0.1, -0.1, 0)}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          frameloop={reduced ? "demand" : "always"}
        >
          <hemisphereLight args={["#fff6e8", "#5a5246", 1.1]} />
          <directionalLight position={[2, 4, 6]} intensity={2.1} />
          <directionalLight position={[-4, 2, 2]} intensity={0.9} color="#ffb38a" />
          <TarsModel motion={motion} reduced={reduced} />
        </Canvas>
      </div>
    </div>
  );
};

export default TarsCompanion;
