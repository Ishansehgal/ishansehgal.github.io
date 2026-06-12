import { useEffect } from "react";

/**
 * Tilts each `.wp` panel in 3D (CSS perspective) based on where it sits in the
 * viewport: laid back as it rises in from the bottom, flat and facing you while
 * it's the active stop, easing forward as it leaves the top. This is what makes
 * the section content read as a physical placard standing up out of the world,
 * rather than a flat sheet sliding over it.
 */
export const useWorldPanels = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const panels = Array.from(document.querySelectorAll<HTMLElement>(".wp"));

    const update = () => {
      const vh = window.innerHeight;
      for (const el of panels) {
        const r = el.getBoundingClientRect();
        // skip panels far outside the viewport — no visible tilt to compute
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const center = r.top + r.height / 2;
        const rel = Math.max(-1.2, Math.min(1.2, (center - vh / 2) / vh));
        const clamped = Math.max(-1, Math.min(1, rel));
        const rx = (clamped * 7).toFixed(2);
        const tz = (-Math.min(Math.abs(rel), 1) * 80).toFixed(1);
        el.style.setProperty("--wp-rx", `${rx}deg`);
        el.style.setProperty("--wp-tz", `${tz}px`);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);
};
