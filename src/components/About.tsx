import { useReveal } from "@/hooks/useReveal";
import tarsVideo from "../assets/tars.mp4";
import profileImg from "../assets/profile.jpg";

const INTERESTS = [
  { n: "i", title: "Visual & Visual-Inertial Odometry", note: "ego-motion from cameras, validated on a hacked vacuum base" },
  { n: "ii", title: "Socially-Aware Navigation", note: "planners that treat humans as agents, not obstacles" },
  { n: "iii", title: "Humanoid Locomotion & Manipulation", note: "Unitree G1, OpenArm — from gait to grasp" },
  { n: "iv", title: "Embedded Autonomy", note: "owning the full stack down to the serial bus" },
];

export const About = () => {
  const ref = useReveal();

  return (
    <section id="about" className="py-24 md:py-32 px-4 md:px-8 border-y border-border bg-background">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-12 reveal">
          <span className="kicker text-primary">01 / mission</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-10">
            <h2 className="reveal font-display font-bold text-3xl md:text-5xl leading-[1.05]">
              Robots make sense to me at every layer —{" "}
              <em className="font-serif italic font-normal text-primary">
                serial bus, firmware, middleware, planner
              </em>{" "}
              — and I build autonomy across all of them.
            </h2>

            <div className="reveal space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <p>
                My work spans the full autonomy stack: decompiling ARM firmware with Ghidra to
                liberate sensor data, writing custom Nav2 planners and behaviors in C++,
                calibrating localization pipelines, and putting it all on real hardware — mobile
                bases, a humanoid, and robots I've rebuilt from the inside out.
              </p>
              <p>
                I'm drawn to research problems where the path isn't documented: when the datasheet
                doesn't exist, you read the bytes yourself. That instinct — measure, hypothesize,
                verify on hardware — is what I want to bring to graduate research in robotics.
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
