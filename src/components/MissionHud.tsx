import { useActiveSection } from "@/hooks/useActiveSection";

const WAYPOINTS = [
  { id: "home", label: "boot" },
  { id: "about", label: "mission" },
  { id: "journey", label: "journey" },
  { id: "research", label: "research" },
  { id: "projects", label: "projects" },
  { id: "expertise", label: "stack" },
  { id: "contact", label: "contact" },
];

/**
 * Global-plan style waypoint rail on the left margin — the page's table of
 * contents drawn as a planned path.
 */
export const MissionHud = () => {
  const active = useActiveSection(WAYPOINTS.map((w) => w.id));

  const scrollTo = (id: string) =>
    id === "home"
      ? window.scrollTo({ top: 0, behavior: "smooth" })
      : document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="hud-rail fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-0">
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
  );
};
