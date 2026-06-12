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
    line: "I'm TARS — Ishan built my hardware twin. Goal is the far end of the map. Scroll and I'll start driving.",
  },
  about: {
    label: "about",
    line: "A bit about how he works, and the research directions he's most interested in.",
  },
  journey: {
    label: "journey",
    line: "Where he's worked, newest first — RigBetel Labs now, e-Yantra at IIT Bombay before that.",
  },
  research: {
    label: "research",
    line: "The vacuum he reverse-engineered into a ROS2 base. Worth reading the steps on the right.",
  },
  projects: {
    label: "projects",
    line: "Projects that ran on real robots — including the chassis I'm modeled on.",
  },
  expertise: {
    label: "stack",
    line: "The tools behind all of the above — Nav2, SLAM, Ghidra, simulation.",
  },
  contact: {
    label: "goal",
    line: "Reached the goal, no collisions. He's looking for a master's place — email is best.",
  },
};

const QUIPS = [
  "The orange line is the plan. The blue one is where I actually drove.",
  "Hold the keys and I'll move. Acceleration's limited, like the real base.",
  "That wobble in the trace is honest — it's roughly what odometry drift looks like.",
  "Ask Ishan about the 25-millisecond heartbeat. He has opinions.",
];

const TELEOP_LINE =
  "Teleop engaged — /cmd_vel is yours. WASD / arrows or the pad. ESC hands control back.";

// teleop limits
const V_FWD = 2.4;
const V_REV = -1.3;
const W_MAX = 1.9;

// svg mapping
const W = 232;
const H = 104;
const sx = (x: number) => ((x - BOUNDS.minX) / (BOUNDS.maxX - BOUNDS.minX)) * W;
const sy = (z: number) => ((z - BOUNDS.minZ) / (BOUNDS.maxZ - BOUNDS.minZ)) * H;

const PLAN_PTS = samplePath(140);
const PLAN_STR = PLAN_PTS.map((p) => `${sx(p.x).toFixed(1)},${sy(p.z).toFixed(1)}`).join(" ");
const TRACE_PTS = Array.from({ length: 141 }, (_, i) => tracePose(i, 140));

/** recompute cmd targets from the set of currently held controls */
const applyKeys = (held: Set<string>) => {
  worldState.cmd.v = held.has("fwd") ? V_FWD : held.has("rev") ? V_REV : 0;
  worldState.cmd.w = (held.has("left") ? W_MAX : 0) + (held.has("right") ? -W_MAX : 0);
};

const KEYMAP: Record<string, string> = {
  w: "fwd",
  arrowup: "fwd",
  s: "rev",
  arrowdown: "rev",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
};

export const MiniMap = ({ webgl }: { webgl: boolean }) => {
  const active = useActiveSection(WAYPOINTS.map((w) => w.id));
  const [t, setT] = useState(0);
  const [teleop, setTeleop] = useState(false);
  const [, setTick] = useState(0); // re-render driver during teleop
  const [quip, setQuip] = useState<string | null>(null);
  const quipIndex = useRef(0);
  const quipTimer = useRef<ReturnType<typeof setTimeout>>();
  const raf = useRef(0);
  const held = useRef(new Set<string>());
  const frame = useRef(0);

  useEffect(() => {
    const tick = () => {
      if (!webgl) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        worldState.t = max > 0 ? window.scrollY / max : 0;
      }
      setT((prev) => (Math.abs(prev - worldState.t) > 0.0008 ? worldState.t : prev));
      frame.current += 1;
      if (worldState.mode === "teleop" && frame.current % 4 === 0) setTick((n) => n + 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [webgl]);

  const exitTeleop = () => {
    worldState.mode = "route";
    worldState.cmd = { v: 0, w: 0 };
    held.current.clear();
    document.body.style.overflow = "";
    document.documentElement.classList.remove("teleop-on");
    setTeleop(false);
  };

  const enterTeleop = () => {
    const p = getPose(worldState.t);
    worldState.free = { x: p.x, z: p.z, heading: p.heading };
    worldState.cmd = { v: 0, w: 0 };
    worldState.mode = "teleop";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("teleop-on");
    setTeleop(true);
  };

  // keyboard teleop
  useEffect(() => {
    if (!teleop) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exitTeleop();
        return;
      }
      const ctl = KEYMAP[e.key.toLowerCase()];
      if (ctl) {
        e.preventDefault();
        held.current.add(ctl);
        applyKeys(held.current);
      }
    };
    const up = (e: KeyboardEvent) => {
      const ctl = KEYMAP[e.key.toLowerCase()];
      if (ctl) {
        held.current.delete(ctl);
        applyKeys(held.current);
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
     
  }, [teleop]);

  // safety: restore scrolling if unmounted mid-teleop
  useEffect(
    () => () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("teleop-on");
    },
    []
  );

  const pose = teleop ? { ...worldState.free } : getPose(t);
  const heading = teleop ? worldState.free.heading : pose.heading;
  const odom = t * PATH_LENGTH;
  const headingDeg = ((heading * 180) / Math.PI + 360) % 360;
  const markerAngle = (Math.atan2(Math.cos(heading), Math.sin(heading)) * 180) / Math.PI;

  const traceStr = useMemo(() => {
    const n = Math.max(1, Math.floor(t * 140));
    return TRACE_PTS.slice(0, n + 1)
      .map((p) => `${sx(p.x).toFixed(1)},${sy(p.z).toFixed(1)}`)
      .join(" ");
  }, [t]);

  const onPoke = () => {
    if (teleop) return;
    worldState.spinTarget += Math.PI * 2;
    setQuip(QUIPS[quipIndex.current % QUIPS.length]);
    quipIndex.current += 1;
    clearTimeout(quipTimer.current);
    quipTimer.current = setTimeout(() => setQuip(null), 4500);
  };

  const n = NARRATION[active] ?? NARRATION.home;
  const text = teleop ? TELEOP_LINE : quip ?? n.line;
  const label = teleop ? "teleop" : quip ? "aside" : n.label;
  const activeIdx = WAYPOINTS.findIndex((w) => w.id === active);

  const padBtn =
    "pointer-events-auto select-none w-12 h-12 md:w-11 md:h-11 border border-border bg-card/95 backdrop-blur font-mono text-base flex items-center justify-center active:bg-primary active:text-primary-foreground touch-none";

  const hold = (ctl: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      held.current.add(ctl);
      applyKeys(held.current);
    },
    onPointerUp: () => {
      held.current.delete(ctl);
      applyKeys(held.current);
    },
    onPointerCancel: () => {
      held.current.delete(ctl);
      applyKeys(held.current);
    },
  });

  return (
    <>
      {/* D-pad, teleop only */}
      {teleop && (
        <div className="fixed bottom-6 left-4 md:left-6 z-50 grid grid-cols-3 gap-1.5 w-fit">
          <div />
          <button className={padBtn} aria-label="forward" {...hold("fwd")}>▲</button>
          <div />
          <button className={padBtn} aria-label="turn left" {...hold("left")}>◀</button>
          <button className={padBtn} aria-label="reverse" {...hold("rev")}>▼</button>
          <button className={padBtn} aria-label="turn right" {...hold("right")}>▶</button>
        </div>
      )}

      <div
        className="fixed bottom-2 right-2 md:bottom-3 md:right-3 z-50 w-56 md:w-64 select-none"
        onClick={onPoke}
        title={teleop ? undefined : "poke TARS"}
      >
        {/* narration / teleop status */}
        <div className={`border bg-card/95 backdrop-blur px-3 py-2.5 mb-1.5 ${teleop ? "border-primary" : "border-border"}`}>
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
              tars · <span className={teleop ? "text-primary" : ""}>{label}</span>
            </span>
            <span>
              {teleop
                ? `v ${worldState.cmd.v.toFixed(1)} · ω ${worldState.cmd.w.toFixed(1)}`
                : `odom ${odom.toFixed(1)} m`}
            </span>
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
              <span>/map · {teleop ? "free drive" : "global plan"}</span>
              <span>
                x {pose.x.toFixed(1)} z {pose.z.toFixed(1)} θ {headingDeg.toFixed(0)}°
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
              <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="hsl(42 30% 99%)" stroke="hsl(38 14% 78%)" />
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={(i + 1) * (W / 12)} y1="1" x2={(i + 1) * (W / 12)} y2={H - 1} stroke="hsl(215 60% 38% / 0.10)" />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <line key={`h${i}`} x1="1" y1={(i + 1) * (H / 5)} x2={W - 1} y2={(i + 1) * (H / 5)} stroke="hsl(215 60% 38% / 0.10)" />
              ))}

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

              <polyline points={PLAN_STR} fill="none" stroke="hsl(17 100% 48%)" strokeWidth="1.6" strokeDasharray="3 2" />
              {!teleop && <polyline points={traceStr} fill="none" stroke="hsl(215 60% 38%)" strokeWidth="1.2" />}

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
                    fill={i === activeIdx && !teleop ? "hsl(17 100% 48%)" : "hsl(42 30% 99%)"}
                    stroke="hsl(30 10% 25%)"
                    strokeWidth="1"
                  />
                );
              })}

              <g transform={`translate(${sx(pose.x)} ${sy(pose.z)}) rotate(${markerAngle})`}>
                <polygon points="6,0 -3.6,3.4 -3.6,-3.4" fill="hsl(17 100% 48%)" stroke="hsl(30 10% 11%)" strokeWidth="0.8" />
              </g>
            </svg>
            <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-muted-foreground mt-1 px-0.5">
              <span>
                <span className="text-primary">――</span> plan
                {!teleop && (
                  <>
                    <span className="text-accent ml-2">――</span> trace
                  </>
                )}
              </span>
              <span>{teleop ? "bounds locked" : `goal ${(t * 100).toFixed(0)}%`}</span>
            </div>

            {/* teleop toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (teleop) exitTeleop();
                else enterTeleop();
              }}
              className={`mt-2 w-full font-mono text-[10px] uppercase tracking-[0.2em] py-2 border transition-colors ${
                teleop
                  ? "border-primary bg-primary text-primary-foreground hover:bg-foreground hover:border-foreground"
                  : "border-foreground bg-foreground text-background hover:bg-primary hover:border-primary"
              }`}
            >
              {teleop ? "✕ exit teleop (esc)" : "▶ teleop — drive TARS yourself"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
