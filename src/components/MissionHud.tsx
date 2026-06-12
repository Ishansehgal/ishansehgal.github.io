import { useEffect, useState } from "react";

const WAYPOINTS = [
  { id: "home", label: "boot" },
  { id: "about", label: "mission" },
  { id: "journey", label: "tf_tree" },
  { id: "research", label: "research" },
  { id: "projects", label: "projects" },
  { id: "expertise", label: "stack" },
  { id: "contact", label: "contact" },
];

/**
 * Persistent HUD: a global-plan style waypoint rail on the left margin and a
 * scroll odometer bottom-right, as if the page itself were a robot executing
 * a planned path.
 */
export const MissionHud = () => {
  const [active, setActive] = useState("home");
  const [odom, setOdom] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setOdom(window.scrollY / 100); // 100 px ≙ 1 m, close enough for a demo bag
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    WAYPOINTS.forEach((w) => {
      const el = document.getElementById(w.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    id === "home"
      ? window.scrollTo({ top: 0, behavior: "smooth" })
      : document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* waypoint rail */}
      <div className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0">
        {WAYPOINTS.map((w, i) => (
          <div key={w.id} className="flex flex-col items-center">
            {i > 0 && <div className="w-px h-7 border-l border-dashed border-foreground/30" />}
            <button
              onClick={() => scrollTo(w.id)}
              className="group relative flex items-center"
              aria-label={w.label}
            >
              <span
                className={`block w-2.5 h-2.5 rotate-45 border transition-all duration-300 ${
                  active === w.id
                    ? "bg-primary border-primary scale-125"
                    : "bg-background border-foreground/40 group-hover:border-primary"
                }`}
              />
              <span
                className={`absolute left-5 font-mono text-[10px] tracking-widest uppercase whitespace-nowrap transition-opacity duration-300 ${
                  active === w.id ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60"
                }`}
              >
                {w.label}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* odometer */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase bg-card/85 backdrop-blur border border-border px-3 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        <span className="text-muted-foreground">
          odom <span className="text-foreground">{odom.toFixed(1)} m</span>
        </span>
        <span className="text-muted-foreground">
          goal <span className="text-foreground">{Math.round(progress * 100)}%</span>
        </span>
      </div>
    </>
  );
};
