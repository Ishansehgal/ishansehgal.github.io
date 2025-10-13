import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "eYantra Robotics Competition",
    description: "AIR 13 in autonomous AMR with UR5 robotic arm theme. Developed warehouse automation system with simulation-to-real-world deployment using ROS2 Humble.",
    tags: ["ROS2 Humble", "UR5 Arm", "AMR", "Competition"],
    videoPath: "eyantra.mp4",
    imagePath: "eyantra.jpg",
    githubUrl: "https://github.com/Ishansehgal", // Update with actual repo
  },
  {
    title: "Autonomous Robot",
    description: "Custom differential drive robot with 2D LiDAR sensor. Implemented SLAM for mapping and localization using ROS2 Foxy, Nav2 stack for autonomous navigation.",
    tags: ["ROS2 Foxy", "SLAM", "Nav2", "LiDAR"],
    videoPath: "autonomous-robot.mp4",
    imagePath: "autonomous-robot.jpg",
    githubUrl: "https://github.com/Ishansehgal", // Update with actual repo
  },
  {
    title: "Auto Docking System",
    description: "Developed precision docking system for autonomous mobile robots. Implemented visual servoing and sensor fusion for accurate alignment and docking procedures.",
    tags: ["ROS2", "Computer Vision", "Sensor Fusion", "Navigation"],
    videoPath: "auto-docking.mp4",
    imagePath: "auto-docking.jpg",
    githubUrl: "https://github.com/Ishansehgal", // Update with actual repo
  },
  {
    title: "TARS Mini Version",
    description: "Compact autonomous robot inspired by TARS from Interstellar. Features advanced navigation capabilities and autonomous decision-making systems.",
    tags: ["ROS2", "Autonomous", "Navigation", "AI"],
    videoPath: "tars-mini.mp4",
    imagePath: "tars-mini.jpg",
    githubUrl: "https://github.com/Ishansehgal", // Update with actual repo
  },
];

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <section id="projects" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Featured <span className="text-gradient">Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="card-glass overflow-hidden hover:glow-box transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProject(project)}
            >
              {/* Video/Image Placeholder */}
              <div className="aspect-video bg-muted/30 flex items-center justify-center border-b border-border/50">
                <div className="text-center p-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    Add your video or image to:
                  </p>
                  <code className="text-xs bg-background/50 px-3 py-1 rounded">
                    public/media/{project.videoPath}
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">or</p>
                  <code className="text-xs bg-background/50 px-3 py-1 rounded">
                    public/media/{project.imagePath}
                  </code>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/50 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.githubUrl, "_blank");
                  }}
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Video/Image will display here: public/media/{selectedProject?.videoPath}
              </p>
            </div>
            <p className="text-muted-foreground">{selectedProject?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProject?.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-primary/50 hover:bg-primary/10"
              onClick={() => window.open(selectedProject?.githubUrl, "_blank")}
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
