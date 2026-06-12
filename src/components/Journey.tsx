import { useReveal } from "@/hooks/useReveal";

const NODES = [
  {
    frame: "base_link",
    org: "RigBetel Labs",
    role: "Associate Robotics Developer",
    period: "Present",
    desc: "Building production autonomous navigation for the TortoiseBot platform line. Custom Nav2 planner, controller and behavior-tree plugins for unconventional kinematics; migrated localization to Beluga MCL for performance-critical deployments; Dockerized ROS2 stacks shipped to real customers.",
    tags: ["ROS2", "Nav2", "C++", "Beluga", "Docker"],
  },
  {
    frame: "odom",
    org: "e-Yantra, IIT Bombay",
    role: "Summer Research Intern — E-YSIP 2024",
    period: "2024",
    desc: "Selected for the competitive e-Yantra Summer Internship Program at IIT Bombay, working on robotics systems development in a research-lab environment — rapid prototyping, documentation discipline, and mentored research practice.",
    tags: ["Research", "Embedded", "ROS2"],
  },
  {
    frame: "map → odom",
    org: "e-Yantra Robotics Competition",
    role: "Finalist — Cosmo Logistic, eYRC 2023",
    period: "2023 – 24",
    desc: "National-level finalist (IIT Bombay's eYRC). Built a warehouse automation system pairing a UR5 manipulator with an autonomous mobile robot: perception, pick-and-place, task allocation and navigation in simulation and on hardware.",
    tags: ["MoveIt", "UR5", "Path Planning", "Computer Vision"],
  },
  {
    frame: "map",
    org: "Guru Nanak Dev University, Amritsar",
    role: "B.Tech — Engineering",
    period: "origin",
    desc: "The fixed frame everything else is expressed in. Started with microcontrollers and bare-metal C, then found ROS — and never built anything non-autonomous again.",
    tags: ["Foundations", "C", "Control Theory"],
  },
];

export const Journey = () => {
  const ref = useReveal();

  return (
    <section id="journey" className="py-24 md:py-32 px-4 md:px-8 border-b border-border bg-card/40">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-4 reveal">
          <span className="kicker text-primary">02 / tf_tree</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>
        <p className="reveal font-mono text-[11px] text-muted-foreground mb-14 max-w-xl">
          $ ros2 run tf2_tools view_frames &nbsp;—&nbsp; every robot pose is a chain of transforms
          back to a fixed frame. So is a career. (frame conventions per REP-105)
        </p>

        <div className="relative">
          {/* trunk */}
          <div className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px border-l border-dashed border-foreground/30" />

          <div className="space-y-14">
            {NODES.map((node, i) => (
              <div key={i} className="reveal relative pl-10 md:pl-14" style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
                {/* frame node marker */}
                <span className="absolute left-0 top-1 w-4 h-4 md:w-5 md:h-5 rotate-45 border-2 border-foreground bg-background" >
                  <span className={`absolute inset-1 ${i === 0 ? "bg-primary" : "bg-transparent"}`} />
                </span>

                <div className="font-mono text-[10px] tracking-widest text-accent mb-2 uppercase">
                  frame: {node.frame}
                </div>
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
      </div>
    </section>
  );
};
