import { useEffect, useRef } from "react";
import { WAYPOINTS } from "./path";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { CaseStudy } from "@/components/CaseStudy";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { Contact } from "@/components/Contact";

/**
 * The stop "boards". As TARS drives the route (scroll), each section's real
 * HTML rises into a lit board in a fixed, fully-visible stage on the side of
 * the screen — the camera frames TARS beside it. Visibility is driven straight
 * off scroll position (not a jittery 3D projection), so a board can never be
 * cropped and only one is on stage at a time. Waypoint 0 is home (the Hero).
 */
type Panel = { i: number; code: string; node: React.ReactNode; dark?: boolean };

const PANELS: Panel[] = [
  { i: 1, code: "01 · MISSION", node: <About inWorld /> },
  { i: 2, code: "02 · JOURNEY", node: <Journey inWorld /> },
  { i: 3, code: "03 · RESEARCH", node: <CaseStudy inWorld /> },
  { i: 4, code: "04 · SELECTED WORK", node: <Projects inWorld /> },
  { i: 5, code: "05 · SYSTEM STACK", node: <Expertise inWorld /> },
  { i: 6, code: "06 · GOAL", node: <Contact inWorld />, dark: true },
];

const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

// a bump peaking at the waypoint's scroll position, zero a bit before/after so
// only one board is ever on stage (the gaps are the "driving between stops")
const HALF = 0.082;
const bump = (frac: number, center: number) =>
  smoothstep(1 - Math.min(1, Math.abs(frac - center) / HALF));

export const HoloOverlay = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const frac = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      for (let k = 0; k < PANELS.length; k++) {
        const el = refs.current[k];
        if (!el) continue;
        const f = bump(frac, WAYPOINTS[PANELS[k].i].t);
        if (f <= 0.004) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.pointerEvents = "none";
          }
          continue;
        }
        el.style.visibility = "visible";
        el.style.setProperty("--f", f.toFixed(3));
        el.style.pointerEvents = f > 0.6 ? "auto" : "none";
        el.style.zIndex = String(20 + Math.round(f * 9));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="holo-layer">
      {PANELS.map((panel, k) => (
        <div
          key={panel.i}
          ref={(el) => (refs.current[k] = el)}
          className={`holo-card${panel.dark ? " holo-dark" : ""}`}
          style={{ visibility: "hidden" }}
        >
          <div className="holo-head">
            <span className="holo-code">{panel.code}</span>
            <span className="holo-live">
              <span className="holo-dot" /> projected · live
            </span>
          </div>
          <div className="holo-scroll">{panel.node}</div>
        </div>
      ))}
    </div>
  );
};
