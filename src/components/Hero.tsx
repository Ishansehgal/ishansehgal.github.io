import { useRef, useEffect } from "react";
import roboCar from "../assets/robocar_sketch.png";
import profileImg from "../assets/profile.jpg";


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
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-end pb-10 z-0">
        <img
          src={roboCar}
          alt="Robocar Sketch"
          className="w-64 h-auto animate-move-bot grayscale invert"
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 relative z-10 text-center md:text-left">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="order-2 md:order-1 space-y-8">
            <div className="reveal space-y-4">
              <p className="text-lg md:text-xl font-medium tracking-wide text-primary/80">
                HELLO, I AM
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
                ISHAN
                <br />
                SEHGAL
              </h1>
            </div>

            <div className="reveal space-y-6 max-w-xl">
              <h2 className="text-xl md:text-2xl font-light leading-snug text-muted-foreground">
                A <span className="font-bold text-foreground">Robotics Developer</span> engineering robust autonomous systems.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Bridging the physical and digital worlds. Specialized in <strong>ROS2 Control</strong>, <strong>Behavior Trees</strong>, and <strong>Navigation Stacks</strong>.
                Tackling complex kinematic challenges to bring hardware to life.
              </p>

              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <a
                  href="https://www.linkedin.com/in/sehgalishan/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 bg-white text-black text-sm font-bold hover:opacity-90 transition-opacity tracking-widest"
                >
                  LINKEDIN
                </a>
                <a
                  href="/Ishan_Sehgal_r.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-3 border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all tracking-widest"
                >
                  RESUME
                </a>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end reveal">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full"></div>
              <img
                src={profileImg}
                alt="Ishan Sehgal"
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700 border-4 border-black shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section >
  );
};
