import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const NODES = [
  {
    org: "RigBetel Labs",
    role: "Associate Robotics Developer",
    period: "Present",
    desc: "Building production autonomous navigation for the TortoiseBot platform line. Custom Nav2 planner, controller and behavior-tree plugins for unconventional kinematics; migrated localization to Beluga MCL for performance-critical deployments; Dockerized ROS2 stacks shipped to real customers.",
    tags: ["ROS2", "Nav2", "C++", "Beluga", "Docker"],
  },
  {
    org: "e-Yantra, IIT Bombay",
    role: "Summer Research Intern — E-YSIP 2024",
    period: "2024",
    desc: "Selected for the competitive e-Yantra Summer Internship Program at IIT Bombay, working on robotics systems development in a research-lab environment — rapid prototyping, documentation discipline, and mentored research practice.",
    tags: ["Research", "Embedded", "ROS2"],
  },
  {
    org: "e-Yantra Robotics Competition",
    role: "Finalist — Cosmo Logistic, eYRC 2023",
    period: "2023 – 24",
    desc: "National-level finalist (IIT Bombay's eYRC). Built a warehouse automation system pairing a UR5 manipulator with an autonomous mobile robot: perception, pick-and-place, task allocation and navigation in simulation and on hardware.",
    tags: ["MoveIt", "UR5", "Path Planning", "Computer Vision"],
  },
  {
    org: "Guru Nanak Dev University, Amritsar",
    role: "B.Tech — Engineering",
    period: "Undergrad",
    desc: "First microcontrollers, control loops and C. Picked up ROS early and kept scaling: line followers gave way to SLAM-capable mobile robots, then to the competition and research work above.",
    tags: ["Foundations", "C", "Control Systems"],
  },
];

/**
 * A stylized render of my physical TARS replica (the hardware version is in
 * fig. 1). Four articulated slabs; the outer pair lifts alternately in a
 * walking gait driven entirely by scroll progress through this section —
 * scroll and it walks, stop and it stands.
 */
const TarsWalker = ({ progress, active }: { progress: number; active: number }) => {
  // ~5 stride cycles across the section
  const phase = progress * Math.PI * 10;
  const liftL = Math.max(0, Math.sin(phase)) * 16;
  const liftR = Math.max(0, Math.sin(phase + Math.PI)) * 16;
  const sway = Math.sin(phase) * 1.6;
  const bob = Math.abs(Math.sin(phase)) * 3;

  const seams = {
    backgroundImage:
      "repeating-linear-gradient(to bottom, transparent 0 46px, hsl(42 33% 96% / 0.28) 46px 48px)",
  };

  const slab = "relative w-8 md:w-9 h-60 md:h-72 bg-foreground transition-transform duration-75";

  return (
    <div className="select-none" aria-hidden="true">
      <div
        className="relative flex items-end justify-center gap-[3px] pb-2"
        style={{ transform: `rotate(${sway}deg) translateY(${bob}px)` }}
      >
        {/* outer left */}
        <div className={slab} style={{ ...seams, transform: `translateY(-${liftL}px)` }} />
        {/* inner left — carries the status LED */}
        <div className={slab} style={{ ...seams, transform: `translateY(-${liftR * 0.25}px)` }}>
          <span className="absolute top-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        </div>
        {/* inner right — nameplate */}
        <div className={slab} style={{ ...seams, transform: `translateY(-${liftL * 0.25}px)` }}>
          <span
            className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.45em] text-background/80"
            style={{ writingMode: "vertical-rl" }}
          >
            TARS
          </span>
        </div>
        {/* outer right */}
        <div className={slab} style={{ ...seams, transform: `translateY(-${liftR}px)` }} />
      </div>

      {/* ground + shadow */}
      <div className="relative h-3">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 h-2 w-36 rounded-[50%] bg-foreground/20 blur-[3px]"
          style={{ transform: `translateX(-50%) scaleX(${1 - bob * 0.04})` }}
        />
      </div>
      <div className="border-t border-dashed border-foreground/40 mt-1" />

      {/* waypoint readout */}
      <div className="mt-4 font-mono text-[10px] uppercase tracking-widest space-y-1">
        <div className="text-muted-foreground">
          waypoint <span className="text-primary">{String(active + 1).padStart(2, "0")}</span> / 0{NODES.length}
        </div>
        <div className="text-foreground">{NODES[active].org}</div>
        <div className="text-muted-foreground">{NODES[active].period}</div>
      </div>
      <p className="mt-4 font-mono text-[10px] text-muted-foreground leading-relaxed">
        gait driven by your scroll — the hardware version is in fig. 1
      </p>
    </div>
  );
};

export const Journey = () => {
  const ref = useReveal<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight * 0.4;
      const p = (window.innerHeight * 0.7 - rect.top) / Math.max(span, 1);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entryRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px" }
    );
    entryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="py-24 md:py-32 px-4 md:px-8 border-b border-border bg-card/40">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-14 reveal">
          <span className="kicker text-primary">02 / journey</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">
          <div className="relative">
            {/* trunk */}
            <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px border-l border-dashed border-foreground/30" />

            <div className="space-y-16">
              {NODES.map((node, i) => (
                <div
                  key={i}
                  ref={(el) => (entryRefs.current[i] = el)}
                  className="reveal relative pl-10 md:pl-14"
                  style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                >
                  <span className="absolute left-0 top-1 w-4 h-4 md:w-5 md:h-5 rotate-45 border-2 border-foreground bg-background">
                    <span className={`absolute inset-1 transition-colors duration-300 ${active === i ? "bg-primary" : "bg-transparent"}`} />
                  </span>

                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-2">
                    <h3 className="font-display font-bold text-2xl md:text-3xl">{node.org}</h3>
                    <span className="font-mono text-xs text-muted-foreground border border-border bg-background px-2 py-1">
                      {node.period}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-primary mb-3">{node.role}</div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl mb-4">{node.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {node.tags.map((t) => (
                      <span key={t} className="font-mono text-[10px] uppercase tracking-wider border border-border px-2 py-1 text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TARS walks the timeline with you */}
          <div className="hidden lg:block sticky top-24">
            <TarsWalker progress={progress} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
};
