import { useReveal } from "@/hooks/useReveal";
import { ArrowUpRight, Github } from "lucide-react";

const PROJECTS = [
  {
    id: "P-01",
    title: "Production Nav2 Autonomy Stack",
    context: "RigBetel Labs",
    description:
      "Customer-deployed navigation for the TortoiseBot platform line: custom Nav2 planner/controller plugins and behavior-tree nodes for unconventional kinematics, Beluga MCL for high-performance localization, fully containerized bring-up.",
    tech: ["ROS2", "C++", "Nav2", "Beluga", "Docker"],
    link: "https://github.com/Ishansehgal",
  },
  {
    id: "P-02",
    title: "Unitree G1 Humanoid Development",
    context: "Humanoid robotics",
    description:
      "Hands-on autonomy work on the Unitree G1 Edu humanoid: SLAM and autonomous navigation on a dynamically stabilized biped, plus custom motion control over the Unitree SDK — where Nav2 assumptions about flat, static bases stop holding.",
    tech: ["ROS2", "Unitree SDK", "SLAM", "Locomotion", "C++"],
    link: "",
  },
  {
    id: "P-03",
    title: "OpenArm Manipulation in Simulation",
    context: "Sim-to-real manipulation",
    description:
      "Simulation and control of OpenArm, the open-source humanoid manipulator: URDF modeling, physics-accurate simulation, and motion-planning pipelines — building the manipulation counterpart to my mobile-robot autonomy work.",
    tech: ["OpenArm", "MoveIt 2", "URDF", "Simulation", "ROS2"],
    link: "",
  },
  {
    id: "P-04",
    title: "TARS — Interstellar Replica",
    context: "Personal flagship build",
    description:
      "A functional recreation of TARS with its transformable chassis and decidedly non-standard locomotion. Dynamic gait generation for a robot with no wheels and no legs in the usual sense — kinematics from first principles.",
    tech: ["ROS2", "Kinematics", "Gait Generation", "Embedded"],
    link: "https://github.com/Ishansehgal/TARS-Ros2",
  },
  {
    id: "P-05",
    title: "Cosmo Logistic — eYRC 2023 Finalist",
    context: "e-Yantra, IIT Bombay",
    description:
      "National finalist. Warehouse automation pairing a UR5 manipulator with an autonomous mobile robot: vision-guided pick-and-place, task allocation and coordinated navigation, in simulation and on real hardware at IIT Bombay.",
    tech: ["MoveIt", "UR5", "Perception", "Nav2"],
    link: "https://github.com/Ishansehgal/eYRC-2023_Cosmo_Logistic",
  },
  {
    id: "P-06",
    title: "AI.R — Autonomous Robot Platform",
    context: "Open source",
    description:
      "A ROS2-based platform that streamlines development and deployment of autonomous mobile robots — clean bring-up, navigation and SLAM configuration as a reusable foundation instead of a copy-paste ritual.",
    tech: ["ROS2", "Nav2", "SLAM", "Python"],
    link: "https://github.com/Ishansehgal/AI.R-Autonomous_Robot",
  },
];

const ACTIVE_RESEARCH = [
  {
    id: "R-01",
    title: "Visual Odometry Pipelines",
    status: "data collection",
    note: "Benchmarking VO/VIO algorithms on the reverse-engineered vacuum base — wheel odometry and LiDAR as ground truth.",
  },
  {
    id: "R-02",
    title: "Socially-Aware Navigation",
    status: "literature + prototyping",
    note: "Navigation behaviors for crowded human environments — social force models and human-aware costmap layers in Nav2.",
  },
];

export const Projects = () => {
  const ref = useReveal();

  return (
    <section id="projects" className="py-24 md:py-32 px-4 md:px-8 border-b border-border bg-card/40">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-4 reveal">
          <span className="kicker text-primary">04 / selected work</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <h2 className="reveal font-display font-black text-4xl md:text-5xl uppercase leading-[0.95]">
            Built, shipped,
            <br />
            <span className="text-primary">field-tested</span>
          </h2>
          <a
            href="https://github.com/Ishansehgal"
            target="_blank"
            rel="noreferrer"
            className="reveal inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors border-b border-current pb-1 self-start md:self-auto"
          >
            <Github className="w-4 h-4" /> full archive on GitHub
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="reveal card-lift border border-border bg-background p-6 flex flex-col gap-4"
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between font-mono text-[10px] tracking-widest uppercase">
                <span className="text-primary">{p.id}</span>
                <span className="text-muted-foreground">{p.context}</span>
              </div>
              <h3 className="font-display-tight font-bold text-xl leading-tight">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors inline-flex items-start gap-1">
                    {p.title}
                    <ArrowUpRight className="w-4 h-4 mt-1 shrink-0" />
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
                {p.tech.map((t) => (
                  <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-secondary text-foreground/70">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* active research strip */}
        <div className="mt-16">
          <div className="reveal font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5">
            // active research — work in progress
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {ACTIVE_RESEARCH.map((r, i) => (
              <div
                key={r.id}
                className="reveal border border-dashed border-foreground/40 bg-background/60 p-5 flex gap-4 items-start"
                style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties}
              >
                <span className="font-mono text-[10px] text-primary tracking-widest mt-1">{r.id}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h4 className="font-display-tight font-semibold">{r.title}</h4>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent border border-accent/40 px-1.5 py-0.5">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
