import { Brain, Navigation, Cpu, Camera, GitBranch, Cog } from "lucide-react";

const expertiseAreas = [
  {
    icon: Navigation,
    title: "ROS2 Navigation",
    skills: ["Nav2 Stack", "Behavior Trees", "Custom Plugins", "Path Planning"],
  },
  {
    icon: Camera,
    title: "SLAM & Localization",
    skills: ["Beluga SLAM", "Visual Odometry", "Sensor Fusion", "Mapping"],
  },
  {
    icon: Brain,
    title: "Autonomous Systems",
    skills: ["AMR Development", "Decision Making", "Obstacle Avoidance", "System Integration"],
  },
  {
    icon: Cpu,
    title: "Robotics Hardware",
    skills: ["Motor Control", "Sensor Integration", "LiDAR Systems", "Embedded Systems"],
  },
  {
    icon: Cog,
    title: "Robotic Arms",
    skills: ["UR5 Arm", "Motion Planning", "Warehouse Automation", "Pick & Place"],
  },
  {
    icon: GitBranch,
    title: "Research & Development",
    skills: ["Algorithm Development", "System Optimization", "Failure Resistance", "Performance Tuning"],
  },
];

export const Expertise = () => {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Areas of <span className="text-gradient">Expertise</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="card-glass rounded-xl p-6 hover:glow-box transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 inline-flex">
                  <area.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
              <ul className="space-y-2">
                {area.skills.map((skill, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
