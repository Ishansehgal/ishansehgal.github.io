import { useEffect, useRef } from "react";
import { worldState } from "./path";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { CaseStudy } from "@/components/CaseStudy";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { Contact } from "@/components/Contact";

/**
 * Real HTML section content, parked in 3D space. The rig projects each
 * waypoint's side-anchor to a screen point every frame (worldState.panels);
 * here we translate the matching banner there and fade/raise it by proximity,
 * so each card pops up out of the ground beside TARS as it arrives and sinks
 * again as it drives on. Waypoint index 0 is home (the Hero), so we skip it.
 */
const PANELS: { i: number; node: React.ReactNode }[] = [
  { i: 1, node: <About inWorld /> },
  { i: 2, node: <Journey inWorld /> },
  { i: 3, node: <CaseStudy inWorld /> },
  { i: 4, node: <Projects inWorld /> },
  { i: 5, node: <Expertise inWorld /> },
  { i: 6, node: <Contact inWorld /> },
];

export const HoloOverlay = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cardW = Math.min(w * 0.88, 560);
      const marginX = cardW / 2 + 14;
      for (let k = 0; k < PANELS.length; k++) {
        const el = refs.current[k];
        if (!el) continue;
        const p = worldState.panels[PANELS[k].i];
        if (!p || p.f <= 0.02) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.pointerEvents = "none";
          }
          continue;
        }
        // clamp the projected point into the viewport so a card can never end
        // up off-screen — it stays beside TARS but always fully visible
        const sx = Math.max(marginX, Math.min(w - marginX, p.sx));
        const sy = Math.max(h * 0.55, Math.min(h - 18, p.sy));
        el.style.visibility = "visible";
        el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
        // --f lives on the anchor and is inherited by .holo-card (do NOT also
        // set it on the card itself, or the inline value would win and pin it)
        el.style.setProperty("--f", p.f.toFixed(3));
        // only the front-most (fully risen) banner takes clicks
        el.style.pointerEvents = p.f > 0.55 ? "auto" : "none";
        el.style.zIndex = String(10 + Math.round(p.f * 9));
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
          className="holo-anchor"
          style={{ visibility: "hidden" }}
        >
          <div className="holo-card">{panel.node}</div>
        </div>
      ))}
    </div>
  );
};
