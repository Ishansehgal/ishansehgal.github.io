import { useRef, useEffect } from "react";
import tarsGif from "../assets/one.gif";

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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">

            {/* Left Column: Text Content */}
            <div className="md:col-span-2 space-y-8">
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

            {/* Right Column: TARS GIF */}
            <div className="reveal flex justify-center md:justify-end">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full"></div>
                <img
                  src={tarsGif}
                  alt="TARS Robot in Action"
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl rounded-lg opacity-90 hover:opacity-100 transition-all duration-500 scale-110"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
