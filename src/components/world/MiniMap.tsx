import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import {
  getPose,
  samplePath,
  tracePose,
  WAYPOINTS,
  OBSTACLES,
  BOUNDS,
  PATH_LENGTH,
  worldState,
} from "./path";

const NARRATION: Record<string, { label: string; line: string }> = {
  home: {
    label: "boot",
    line: "TARS online. Goal received: far end of the map. Scroll and I'll start navigating.",
  },
  about: {
    label: "mission",
    line: "Waypoint 01 — mission brief: four research interests, one principle. Read the machine at every layer.",
  },
  journey: {
    label: "journey",
    line: "Waypoint 02 — career log, newest first. RigBetel Labs today; e-Yantra at IIT Bombay before that.",
  },
  research: {
    label: "research",
    line: "Waypoint 03 — he gave a vacuum root access, decompiled its firmware, and now it speaks ROS2.",
  },
  projects: {
    label: "projects",
    line: "Waypoint 04 — six systems on real hardware. One of them is my chassis.",
  },
  expertise: {
    label: "stack",
    line: "Waypoint 05 — the toolchain: Nav2, SLAM, Ghidra, simulation. Everything used to build all this.",
  },
  contact: {
    label: "goal",
    line: "Goal reached, zero collisions. He's aiming at graduate research — email works best.",
  },
};

const QUIPS = [
  "Humor setting: 75 percent.",
  "Honesty setting: 90 percent — the orange line is the plan, the blue one is where I actually went.",
  "Localization wobble is intentional. Mostly.",
  "Cue light's broken. Assume that was a joke.",
];

// svg mapping
const W = 232;
const H = 104;
const sx = (x: number) => ((x - BOUNDS.minX) / (BOUNDS.maxX - BOUNDS.minX)) * W;
const sy = (z: number) => ((z - BOUNDS.minZ) / (BOUNDS.maxZ - BOUNDS.minZ)) * H;

const PLAN_PTS = samplePath(140);
const PLAN_STR = PLAN_PTS.map((p) => `${sx(p.x).toFixed(1)},${sy(p.z).toFixed(1)}`).join(" ");
const TRACE_PTS = Array.from({ length: 141 }, (_, i) => tracePose(i, 140));

export const MiniMap = ({ webgl }: { webgl: boolean }) => {
  const active = useActiveSection(WAYPOINTS.map((w) => w.id));
  const [t, setT] = useState(0);
  const [quip, setQuip] = useState<string | null>(null);
  const quipIndex = useRef(0);
  const quipTimer = useRef<ReturnType<typeof setTimeout>>();
  const raf = useRef(0);

  // follow worldState.t (smoothed by the 3D rig); fall back to raw scroll if
  // the 3D world isn't running
  useEffect(() => {
    const tick = () => {
      if (!webgl) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        worldState.t = max > 0 ? window.scrollY / max : 0;
      }
      setT((prev) => (Math.abs(prev - worldState.t) > 0.0008 ? worldState.t : prev));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [webgl]);

  const pose = getPose(t);
  const odom = t * PATH_LENGTH;
  const headingDeg = ((pose.heading * 180) / Math.PI + 360) % 360;
  const markerAngle = (Math.atan2(Math.cos(pose.heading), Math.sin(pose.heading)) * 180) / Math.PI;

  const traceStr = useMemo(() => {
    const n = Math.max(1, Math.floor(t * 140));
    return TRACE_PTS.slice(0, n + 1)
      .map((p) => `${sx(p.x).toFixed(1)},${sy(p.z).toFixed(1)}`)
      .join(" ");
  }, [t]);

  const onPoke = () => {
    worldState.spinTarget += Math.PI * 2;
    setQuip(QUIPS[quipIndex.current % QUIPS.length]);
    quipIndex.current += 1;
    clearTimeout(quipTimer.current);
    quipTimer.current = setTimeout(() => setQuip(null), 4500);
  };

  const n = NARRATION[active] ?? NARRATION.home;
  const text = quip ?? n.line;
  const activeIdx = WAYPOINTS.findIndex((w) => w.id === active);

  return (
    <div
      className="fixed bottom-2 right-2 md:bottom-3 md:right-3 z-40 w-56 md:w-64 cursor-pointer select-none"
      onClick={onPoke}
      title="poke TARS"
    >
      {/* narration */}
      <div className="border border-border bg-card/95 backdrop-blur px-3 py-2.5 mb-1.5">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
            tars · {quip ? "aside" : n.label}
          </span>
          <span>odom {odom.toFixed(1)} m</span>
        </div>
        <p
          key={text}
          className="font-mono text-[10px] md:text-[11px] leading-relaxed text-foreground bootline"
          style={{ "--boot-delay": "60ms" } as React.CSSProperties}
        >
          {text}
        </p>
      </div>

      {/* map */}
      {webgl && (
        <div className="border border-border bg-card/95 backdrop-blur px-2.5 pt-2 pb-2">
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mb-1 px-0.5">
            <span>/map · global plan</span>
            <span>
              x {pose.x.toFixed(1)} z {pose.z.toFixed(1)} θ {headingDeg.toFixed(0)}°
            </span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
            {/* frame + grid */}
            <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="hsl(42 30% 99%)" stroke="hsl(38 14% 78%)" />
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * (W / 12)} y1="1" x2={(i + 1) * (W / 12)} y2={H - 1} stroke="hsl(215 60% 38% / 0.10)" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`h${i}`} x1="1" y1={(i + 1) * (H / 5)} x2={W - 1} y2={(i + 1) * (H / 5)} stroke="hsl(215 60% 38% / 0.10)" />
            ))}

            {/* obstacles + inflation */}
            {OBSTACLES.map((o, i) => (
              <g key={i}>
                <rect
                  x={sx(o.x - o.w / 2) - 1.5}
                  y={sy(o.z - o.d / 2) - 1.5}
                  width={(o.w / (BOUNDS.maxX - BOUNDS.minX)) * W + 3}
                  height={(o.d / (BOUNDS.maxZ - BOUNDS.minZ)) * H + 3}
                  fill="hsl(17 100% 48% / 0.12)"
                />
                <rect
                  x={sx(o.x - o.w / 2)}
                  y={sy(o.z - o.d / 2)}
                  width={(o.w / (BOUNDS.maxX - BOUNDS.minX)) * W}
                  height={(o.d / (BOUNDS.maxZ - BOUNDS.minZ)) * H}
                  fill="hsl(30 10% 25%)"
                />
              </g>
            ))}

            {/* plan + executed trace */}
            <polyline points={PLAN_STR} fill="none" stroke="hsl(17 100% 48%)" strokeWidth="1.6" strokeDasharray="3 2" />
            <polyline points={traceStr} fill="none" stroke="hsl(215 60% 38%)" strokeWidth="1.2" />

            {/* waypoints */}
            {WAYPOINTS.map((w, i) => {
              const p = getPose(w.t);
              return (
                <rect
                  key={w.id}
                  x={sx(p.x) - 2.4}
                  y={sy(p.z) - 2.4}
                  width="4.8"
                  height="4.8"
                  transform={`rotate(45 ${sx(p.x)} ${sy(p.z)})`}
                  fill={i === activeIdx ? "hsl(17 100% 48%)" : "hsl(42 30% 99%)"}
                  stroke="hsl(30 10% 25%)"
                  strokeWidth="1"
                />
              );
            })}

            {/* TARS pose */}
            <g transform={`translate(${sx(pose.x)} ${sy(pose.z)}) rotate(${markerAngle})`}>
              <polygon points="6,0 -3.6,3.4 -3.6,-3.4" fill="hsl(17 100% 48%)" stroke="hsl(30 10% 11%)" strokeWidth="0.8" />
            </g>
          </svg>
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mt-1 px-0.5">
            <span>
              <span className="text-primary">――</span> plan
              <span className="text-accent ml-2">――</span> trace
            </span>
            <span>goal {(t * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
