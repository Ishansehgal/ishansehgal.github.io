import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import heroBg1 from "@/assets/hero-bg-1.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";

const backgrounds = [heroBg1, heroBg2, heroBg3];

export const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBg ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={bg}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
          <span className="text-primary font-mono text-sm">🤖 Robotics Developer</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Hi, I'm <span className="text-gradient glow-text">Ishan Sehgal</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto animate-fade-in">
          ROS2 Developer & Autonomous Systems Engineer
        </p>

        <p className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-in">
          From building Arduino-based obstacle avoidance cars to developing enterprise-grade
          autonomous navigation systems. Specialized in ROS2, behavior trees, and real-world
          robotics implementations with hands-on experience across simulation and hardware.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground glow-box"
            onClick={() => scrollToSection("projects")}
          >
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => scrollToSection("contact")}
          >
            Get in Touch
          </Button>
        </div>

        {/* Code Snippet */}
        <div className="max-w-2xl mx-auto card-glass rounded-lg p-6 text-left animate-fade-in">
          <pre className="text-sm font-mono">
            <code className="text-primary">import</code> <code>rclpy</code>
            {"\n"}
            <code className="text-accent">from</code> <code>nav2_simple_commander</code> <code className="text-accent">import</code> <code>BasicNavigator</code>
            {"\n\n"}
            <code className="text-accent">def</code> <code className="text-foreground">autonomous_navigation</code>():
            {"\n  "}
            <code>navigator = BasicNavigator()</code>
            {"\n  "}
            <code>goal_pose = create_pose(</code><code className="text-primary">2.0</code>, <code className="text-primary">1.0</code>)
            {"\n  "}
            <code>navigator.goToPose(goal_pose)</code>
          </pre>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};
