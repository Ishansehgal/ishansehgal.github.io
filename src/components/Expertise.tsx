import { useReveal } from "@/hooks/useReveal";

const STACK = [
  {
    category: "Navigation & Control",
    items: ["Nav2 (custom planners, controllers, BT nodes)", "ros2_control", "Behavior Trees", "Path planning & tracking", "Lifecycle nodes"],
    note: "a costmap is just an opinionated occupancy grid",
  },
  {
    category: "Localization & SLAM",
    items: ["Beluga MCL / AMCL", "slam_toolbox", "RTAB-Map", "Sensor fusion (EKF)", "Visual odometry", "Odometry calibration"],
    note: "every estimate worth trusting ships with a covariance",
  },
  {
    category: "Simulation & Modeling",
    items: ["Gazebo / Ignition", "OpenArm simulation", "MoveIt 2", "URDF / Xacro", "TF2 & REP-105 frames", "RViz"],
    note: "sim-to-real starts with an honest URDF",
  },
  {
    category: "Embedded & Reverse Engineering",
    items: ["Ghidra static analysis", "STM32 serial protocols", "C / C++ on ARM Linux", "UART / USB buses", "Firmware recon", "Custom drivers"],
    note: "when there's no datasheet, the bytes are the datasheet",
  },
  {
    category: "Infrastructure",
    items: ["Docker", "colcon / CMake", "CI/CD for ROS", "Linux (Ubuntu)", "Git", "Python"],
    note: "a build that isn't reproducible isn't science",
  },
];

export const Expertise = () => {
  const ref = useReveal();

  return (
    <section id="expertise" className="py-24 md:py-32 px-4 md:px-8 border-b border-border">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-14 reveal">
          <span className="kicker text-primary">05 / system stack</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {STACK.map((group, index) => (
            <div key={group.category} className="reveal" style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
              <h3 className="font-display-tight font-bold text-lg border-b-2 border-foreground pb-3 mb-4 flex items-baseline justify-between gap-2">
                {group.category}
                <span className="font-mono text-[10px] text-primary tracking-widest">0{index + 1}</span>
              </h3>
              <ul className="space-y-2 mb-4">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex gap-2.5 items-baseline">
                    <span className="w-1.5 h-1.5 rotate-45 bg-primary/70 shrink-0 translate-y-px" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[10px] text-accent leading-relaxed">// {group.note}</p>
            </div>
          ))}

          {/* field note card filling the grid */}
          <div className="reveal border border-dashed border-foreground/40 p-5 flex flex-col justify-center gap-3" style={{ "--reveal-delay": "270ms" } as React.CSSProperties}>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">field note</span>
            <p className="font-serif italic text-xl leading-snug">
              "The robot doesn't care how elegant your architecture is. It cares whether the
              transform arrives on time."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
