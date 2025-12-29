import { useRef, useEffect } from "react";

const skills = [
  {
    category: "Navigation & Control",
    items: ["ROS2 Navigation (Nav2)", "ROS2 Control", "Behavior Trees", "Path Planning", "mpc_local_planner"]
  },
  {
    category: "Localization & SLAM",
    items: ["Beluga (MCL)", "AMCL", "RTAB-Map", "Sensor Fusion", "Odometry Calibration"]
  },
  {
    category: "Core Robotics",
    items: ["URDF/XACRO", "Gazebo / Ignition", "Kinematics", "TF2", "Lifecycle Nodes"]
  },
  {
    category: "Dev Ops & Tools",
    items: ["Docker", "CMake", "Git", "Linux (Ubuntu)", "CI/CD for ROS"]
  }
];

export const Expertise = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="expertise" className="py-20 md:py-32">
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <span className="text-sm font-bold tracking-widest uppercase mb-12 block reveal text-primary">Technical Arsenal</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {skills.map((skillGroup, index) => (
              <div key={index} className="reveal">
                <h3 className="text-xl font-bold border-b border-primary/20 pb-4 mb-4 flex items-center justify-between">
                  {skillGroup.category}
                  <span className="text-xs text-muted-foreground font-mono">0{index + 1}</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground hover:text-white transition-colors text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
