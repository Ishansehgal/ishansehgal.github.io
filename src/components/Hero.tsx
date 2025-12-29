import { useRef, useEffect } from "react";
import roboCar from "../assets/robocar_sketch.png";

export const Hero = () => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Moving Background Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-end pb-10 z-0">
        <img
          src={roboCar}
          alt="Robocar Sketch"
          className="w-48 h-auto animate-move-bot"
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="reveal space-y-4">
            <p className="text-lg md:text-xl font-medium tracking-wide">
              HELLO, I AM
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
              ISHAN
              <br />
              SEHGAL
            </h1>
          </div>

          <div className="reveal space-y-6 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-light leading-tight">
              A <span className="font-bold">Robotics Delevoper</span> bridging the gap between hardware and software.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Specializing in ROS2, Navigation, and Autonomous Systems. I solve complex problems to bring robots to life.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://www.linkedin.com/in/sehgalishan/"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                LINKEDIN
              </a>
              <a
                href="https://github.com/Ishansehgal"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                GITHUB
              </a>
              <a
                href="/resum (1).pdf"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                RESUME
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
