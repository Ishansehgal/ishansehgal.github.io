import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Autonomous Navigation Stack",
    description: "Custom Nav2 behaviors and plugins for unconventional robot kinematics. Integrated Beluga for high-performance MCL localization.",
    tech: ["ROS2", "C++", "Nav2", "Beluga"],
    link: "https://github.com/Ishansehgal" // Pointing to main github as requested for general overview
  },
  {
    title: "TARS Robot Replica",
    description: "Recreating the iconic TARS robot with a focus on dynamic walking gait and human-robot interaction.",
    tech: ["Robotics", "Mechanical Design", "Control Theory"],
    link: "https://www.linkedin.com/in/sehgalishan/" // Pointing to LinkedIn properties
  },
  {
    title: "e-Yantra Robotics Competition",
    description: "Finalist execution involving multi-agent systems and complex task planning in a simulated environment.",
    tech: ["Path Planning", "Python", "Image Processing"],
    link: "https://github.com/Ishansehgal"
  },
  {
    title: "Social Navigation Awareness",
    description: "Exploring socially aware navigation for robots in crowded human environments.",
    tech: ["ROS2", "Social Force Model", "C++"],
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
    <section id="projects" className="py-20 md:py-32 bg-secondary/50">
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 reveal">
            <span className="text-sm font-bold tracking-widest uppercase">Selected Works</span>
            <a href="https://github.com/Ishansehgal" target="_blank" rel="noreferrer" className="text-sm border-b border-foreground hover:opacity-70 transition-opacity">
              View Github
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group reveal p-8 border border-border bg-background hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold group-hover:underline decoration-1 underline-offset-4">
                    {project.title}
                  </h3>
                  <a href={project.link} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-muted-foreground mb-6 h-20">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-xs uppercase tracking-wider font-medium">
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
