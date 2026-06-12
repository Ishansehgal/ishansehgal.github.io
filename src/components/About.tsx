import { useReveal } from "@/hooks/useReveal";
import tarsVideo from "../assets/tars.mp4";
import profileImg from "../assets/profile.jpg";

const INTERESTS = [
  { n: "i", title: "Visual & Visual-Inertial Odometry", note: "estimating motion from cameras and IMU, tested on the vacuum base" },
  { n: "ii", title: "Socially-Aware Navigation", note: "planning around people in shared spaces, not just static obstacles" },
  { n: "iii", title: "Humanoid Locomotion & Manipulation", note: "navigation on the Unitree G1, manipulation with OpenArm" },
  { n: "iv", title: "Embedded Autonomy", note: "getting autonomy to run on the robot itself, down to the firmware" },
];

export const About = () => {
  const ref = useReveal();

  return (
    <section id="about" className="py-24 md:py-32 px-4 md:px-8">
      <div ref={ref} className="wp max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-12 reveal">
          <span className="kicker text-primary">01 / mission</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-10">
            <h2 className="reveal font-display font-bold text-3xl md:text-5xl leading-[1.05]">
              I like working{" "}
              <em className="font-serif italic font-normal text-primary">close to the hardware</em>,
              where the software finally has to deal with a real machine.
            </h2>

            <div className="reveal space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <p>
                Most of my work is navigation for mobile robots — ROS2 and Nav2, written in C++,
                running on real bases rather than just in simulation. That's what I do day to day at
                RigBetel Labs: custom planners and behaviors, localization that actually holds up
                when the robot leaves the lab.
              </p>
              <p>
                When the hardware I want to use is locked down, I'd rather open it up than work
                around it. That's how the vacuum project started — I needed a solid base for some
                visual odometry tests, so I reverse-engineered one I already had. I learn the most
                from problems like that, where there's no datasheet and you have to figure the thing
                out yourself. That's the kind of work I want to keep doing in a master's.
              </p>
            </div>

            {/* research interests */}
            <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
              {INTERESTS.map((it, i) => (
                <div
                  key={it.n}
                  className="reveal bg-background p-5 group hover:bg-card transition-colors"
                  style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
                >
                  <div className="font-mono text-[10px] text-primary mb-2 tracking-widest uppercase">
                    interest [{it.n}]
                  </div>
                  <div className="font-display-tight font-semibold text-base mb-1">{it.title}</div>
                  <div className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                    // {it.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* operator + TARS hardware */}
          <div className="space-y-10 lg:sticky lg:top-24">
            <figure className="reveal" style={{ "--reveal-delay": "150ms" } as React.CSSProperties}>
              <div className="corner-frame">
                <img
                  src={profileImg}
                  alt="Ishan Sehgal"
                  className="w-full aspect-[4/5] object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-700 border border-foreground/20"
                />
              </div>
              <figcaption className="font-mono text-[10px] text-muted-foreground mt-3 flex justify-between">
                <span>fig. 0 — operator</span>
                <span className="text-primary">with Unitree G1</span>
              </figcaption>
            </figure>

            <figure className="reveal" style={{ "--reveal-delay": "250ms" } as React.CSSProperties}>
              <div className="corner-frame">
                <video
                  src={tarsVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full border border-foreground/20 bg-secondary"
                />
              </div>
              <figcaption className="font-mono text-[10px] text-muted-foreground mt-3 flex justify-between">
                <span>fig. 1 — TARS replica, walking gait test</span>
                <span className="text-primary">live capture</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
