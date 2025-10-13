import { GraduationCap, Trophy, Wrench, Briefcase, Rocket, Code } from "lucide-react";

const journey = [
  {
    icon: GraduationCap,
    title: "First Year • Obstacle Avoidance Car",
    period: "2021",
    description: "Built my first obstacle avoidance car during the first year of BTech ECE at Guru Nanak Dev University, sparking my passion for robotics",
  },
  {
    icon: Code,
    title: "Second Year • Arduino & ROS1 Noetic",
    period: "2022",
    description: "Developed remote sensing car using Arduino. Started with ROS1 Noetic, created custom robot in Fusion 360, and integrated it with ROS nav stack for autonomous navigation",
  },
  {
    icon: Trophy,
    title: "Third Year • eYantra Competition",
    period: "2023",
    description: "Competed in eYantra IIT Bombay. Achieved AIR 13 working with ROS2 Humble, simulating autonomous AMR with UR5 robotic arm in warehouse automation system",
  },
  {
    icon: Wrench,
    title: "Custom Robot Build",
    period: "Late 2023",
    description: "Built my own robot with 4 planetary geared motors, old Asus laptop (Core i5 5th gen), 2D YD LiDAR, and implemented SLAM with ROS2 Foxy",
  },
  {
    icon: Rocket,
    title: "eYantra IIT Bombay • Internship",
    period: "May 2024",
    description: "Secured internship at eYantra IIT Bombay due to competition performance. Worked on AMR and UR5 arm automation, focusing on making systems failure resistant",
  },
  {
    icon: Briefcase,
    title: "RigBetel Labs • Online Internship",
    period: "Oct 2024 - Jan 2025",
    description: "Started online internship at RigBetel Labs, working on Nav2 stack in ROS2 Humble. Converted to on-site position in January 2025",
  },
  {
    icon: Briefcase,
    title: "RigBetel Labs • Associate Robotics Engineer",
    period: "June 2025 - Present",
    description: "Graduated with BTech ECE in June 2025. Received and accepted full-time offer as Associate Robotics Engineer at RigBetel Labs, working on behavior trees, Nav2 plugins, SLAM, Beluga SLAM, localization, and odometry systems",
  },
];

export const About = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
          My <span className="text-gradient">Robotics Journey</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto text-lg">
          Passionate about research projects and tackling new, exciting robotics challenges. 
          Experienced with behavior trees, Nav2 plugins, SLAM, Beluga SLAM, localization, and odometry systems.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {journey.map((item, index) => (
            <div
              key={index}
              className="card-glass rounded-xl p-6 hover:glow-box transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-primary mb-3">{item.period}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
