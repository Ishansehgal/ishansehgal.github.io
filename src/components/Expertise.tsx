import { useRef, useEffect } from "react";

const skills = [
  {
    category: "Core Robotics",
    items: ["ROS2 (Humble/Iron)", "Navigation2 (Nav2)", "Gazebo Simulation", "URDF/XACRO"]
  },
  {
    category: "Localization & Mapping",
    items: ["SLAM", "AMCL", "Beluga (MCL)", "RTAB-Map", "Odometry Fusion"]
  },
  {
    category: "Programming & Tools",
    items: ["C++", "Python", "CMake", "Git/GitHub", "Docker", "Linux"]
  },
  {
    category: "Embedded & Hardware",
    items: ["Microcontrollers", "Sensor Integration", "Motor Control", "PCB Design"]
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
        <div className="max-w-4xl mx-auto">
          <span className="text-sm font-bold tracking-widest uppercase mb-8 block reveal">Expertise</span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {skills.map((skillGroup, index) => (
              <div key={index} className="reveal space-y-4">
                <h3 className="text-xl font-bold border-b border-muted-foreground/20 pb-2">
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 reveal p-6 border border-border bg-secondary/20">
            <h4 className="text-lg font-bold mb-2">Recent Focus: Regbetel Labs</h4>
            <p className="text-muted-foreground">
              Deep dive into <strong>ROS2 Navigation stack</strong>. Worked extensively on custom plugins for Nav2,
              optimizing odometry pipelines, and implementing robust localization solutions using tools like
              <strong>Beluga</strong> and standard <strong>AMCL</strong>. Trusted to deliver production-ready navigation behaviors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
