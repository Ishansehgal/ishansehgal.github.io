import { useRef, useEffect } from "react";

export const About = () => {
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
    <section id="about" className="py-20 md:py-32 bg-secondary/50">
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block reveal">About Me</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 reveal">
            Fueled by curiosity and a drive to solve new problems.
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground reveal">
            <p>
              My journey in robotics is defined by a hands-on approach to both hardware and software.
              I don't just write code; I build systems that move, sense, and interact with the world.
              Whether it's fine-tuning navigation parameters for a mobile robot or architecting a robust ROS2 node,
              I am deeply invested in the "how" and "why" of autonomous systems.
            </p>
            <p>
              Currently, I am expanding my horizons with projects like the <strong>TARS</strong> robot, exploring advanced
              locomotion and interaction. I thrive in research-oriented environments where the path isn't always clear,
              and the solution requires innovation.
            </p>
            <p>
              I want to build technology people can rely on, and I'm looking for opportunities to bring my
              expertise in ROS2, navigation, and embedded systems to a team tackling meaningful challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
