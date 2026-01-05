import { useRef, useEffect } from "react";
import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    title: "Autonomous Navigation Stack",
    description: "Custom Nav2 behaviors and plugins for unconventional robot kinematics. Integrated Beluga for high-performance MCL localization. Production-ready navigation stack for Regbetel Labs.",
    tech: ["ROS2", "C++", "Nav2", "Beluga", "Docker"],
    link: "https://github.com/Ishansehgal"
  },
  {
    title: "TARS Robot Replica",
    description: "A faithful recreation of the TARS robot from Interstellar. Challenges involved designing a transformable chassis and implementing dynamic gait generation for non-standard locomotion.",
    tech: ["Robotics", "Kinematics", "Fusion 360", "Embedded"],
    link: "https://github.com/Ishansehgal/Tars"
  },
  {
    title: "Cosmo Logistic (eYRC 2023)",
    description: "Finalist in the e-Yantra Robotics Competition. Developed a multi-agent system for warehouse logistics, involving complex path planning and task allocation algorithms.",
    tech: ["ROS2", "Python", "Path Planning", "Swarm Robotics"],
    link: "https://github.com/Ishansehgal/eYRC-2023_Cosmo_Logistic"
  },
  {
    title: "Autonomous E-Bot",
    description: "Early college project focusing on building an autonomous differential drive robot from scratch, implementing basic slam and navigation.",
    tech: ["ROS", "Python", "SLAM", "Lidar"],
    link: "https://github.com/Ishansehgal/Autonomous-E-bot"
  },
  {
    title: "Unitree G1 Humanoid Development",
    description: "Hands-on experience with the Unitree G1 Education humanoid robot. Implemented autonomous navigation, SLAM, and custom motion control algorithms, focusing on humanoid kinematics and dynamic stability.",
    tech: ["ROS2", "Unitree SDK", "SLAM", "Navigation", "C++"],
    link: ""
  },
  {
    title: "Social Navigation Research",
    description: "Current research focus on exploring socially aware navigation behaviors for robots operating in crowded human environments. (Work in Progress)",
    tech: ["ROS2", "Social Force Model", "Human-Robot Interaction"],
    link: "https://github.com/Ishansehgal"
  }
];

export const Projects = () => {
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
    <section id="projects" className="py-20 md:py-32">
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 reveal">
            <span className="text-sm font-bold tracking-widest uppercase text-primary">Selected Works</span>
            <a href="https://github.com/Ishansehgal" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm border-b border-primary/50 pb-1 hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
              View Full Github
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group reveal p-6 border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary text-[10px] uppercase tracking-wider font-medium rounded text-primary/80">
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
