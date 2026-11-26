import { useActiveSection } from "@/hooks/useActiveSection";

const LABELS: Record<string, string> = {
  home: "boot",
  about: "amritsar",
  journey: "iit bombay",
  pune: "pune",
  projects: "workshop",
  research: "the vacuum",
  roscon: "roscon",
  expertise: "stack",
  contact: "next",
};

/**
 * Global-plan style waypoint rail on the left margin — the page's table of
 * contents drawn as a planned path.
 */
export const MissionHud = ({ ids }: { ids: string[] }) => {
  const WAYPOINTS = ids.map((id) => ({ id, label: LABELS[id] }));
  const active = useActiveSection(ids);

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
