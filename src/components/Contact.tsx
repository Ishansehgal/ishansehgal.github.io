import { Mail, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Let's <span className="text-gradient">Connect</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Interested in robotics, ROS2, or autonomous systems? Feel free to reach out!
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 glow-box"
            asChild
          >
            <a href="mailto:sehgalishan26@gmail.com">
              <Mail className="mr-2 h-5 w-5" />
              Email Me
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
            asChild
          >
            <a href="https://github.com/Ishansehgal" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
            asChild
          >
            <a href="https://www.linkedin.com/in/sehgalishan/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
