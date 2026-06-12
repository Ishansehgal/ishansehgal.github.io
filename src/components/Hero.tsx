import profileImg from "../assets/profile.jpg";

const BOOT_LINES = [
  { delay: 100, text: "$ ros2 launch ishan_sehgal portfolio.launch.py" },
  { delay: 320, prefix: "[INFO] [navigation] ", text: "lifecycle: configuring → active" },
  { delay: 520, prefix: "[INFO] [slam]       ", text: "map → odom transform locked" },
  { delay: 720, prefix: "[INFO] [perception] ", text: "/scan publishing @ 10 Hz" },
  { delay: 920, prefix: "[INFO] [portfolio]  ", text: "all systems nominal — scroll to begin" },
];

const TOPICS = [
  "/cmd_vel", "/scan", "/tf", "/odom", "/imu/data", "/map",
  "/goal_pose", "/joint_states", "/camera/image_raw", "/battery_state",
  "/global_costmap", "/plan", "/behavior_tree_log", "/diagnostics",
];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* blueprint grid backdrop */}
      <div className="absolute inset-0 bg-gridpaper edge-fade pointer-events-none" />

      {/* lidar ornament */}
      <div className="absolute -right-24 -top-24 w-72 h-72 md:w-96 md:h-96 lidar opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            {/* boot log */}
            <div className="font-mono text-[11px] md:text-xs leading-relaxed text-muted-foreground border border-border bg-card/70 backdrop-blur px-4 py-3 max-w-xl">
              {BOOT_LINES.map((line, i) => (
                <div
                  key={i}
                  className={`bootline ${i === BOOT_LINES.length - 1 ? "cursor-blink" : ""}`}
                  style={{ "--boot-delay": `${line.delay}ms` } as React.CSSProperties}
                >
                  {line.prefix && <span className="text-accent">{line.prefix}</span>}
                  <span className={i === 0 ? "text-foreground" : ""}>{line.text}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="kicker mb-4 bootline" style={{ "--boot-delay": "1050ms" } as React.CSSProperties}>
                Robotics Engineer · ROS2 · Autonomous Systems
              </p>
              <h1
                className="font-display font-black text-[clamp(3.2rem,10vw,7.5rem)] leading-[0.9] uppercase bootline"
                style={{ "--boot-delay": "1100ms" } as React.CSSProperties}
              >
                Ishan
                <br />
                Sehgal<span className="text-primary">.</span>
              </h1>
            </div>

            <div className="bootline space-y-6 max-w-xl" style={{ "--boot-delay": "1250ms" } as React.CSSProperties}>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                I work across the autonomy stack:{" "}
                <span className="text-foreground font-medium">
                  custom Nav2 planners and behaviors in C++, SLAM and localization pipelines, and
                  firmware-level reverse engineering when the hardware is undocumented
                </span>
                . Robotics developer at RigBetel Labs; e-Yantra (IIT Bombay) research intern, 2024.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/Ishansehgal"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/sehgalishan/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 border border-foreground font-mono text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="/Ishan_Sehgal_r.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 border border-primary text-primary font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>

          {/* portrait as calibration target with body-frame axes */}
          <div className="bootline hidden lg:block" style={{ "--boot-delay": "1400ms" } as React.CSSProperties}>
            <figure className="relative max-w-sm ml-auto">
              <div className="corner-frame">
                <img
                  src={profileImg}
                  alt="Ishan Sehgal"
                  className="w-full aspect-[4/5] object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-700 border border-foreground/20"
                />
                {/* coordinate frame overlay: x forward (orange), y left (blue) — REP-103 */}
                <svg className="absolute bottom-4 left-4 w-24 h-24 pointer-events-none" viewBox="0 0 100 100">
                  <line x1="20" y1="80" x2="85" y2="80" stroke="hsl(17 100% 48%)" strokeWidth="2.5" />
                  <polygon points="85,76 95,80 85,84" fill="hsl(17 100% 48%)" />
                  <line x1="20" y1="80" x2="20" y2="15" stroke="hsl(215 60% 38%)" strokeWidth="2.5" />
                  <polygon points="16,15 20,5 24,15" fill="hsl(215 60% 38%)" />
                  <circle cx="20" cy="80" r="4" fill="hsl(30 10% 11%)" />
                </svg>
              </div>
              <figcaption className="font-mono text-[10px] text-muted-foreground mt-3 flex justify-between">
                <span>fig. 0 — operator</span>
                <span className="text-primary">x fwd · z up</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* topic ticker */}
      <div className="relative z-10 border-y border-border bg-card/60 backdrop-blur overflow-hidden py-2.5">
        <div className="marquee font-mono text-[11px] tracking-widest text-muted-foreground">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0">
              {TOPICS.map((t) => (
                <span key={`${dup}-${t}`} className="mx-5 flex items-center gap-5">
                  <span className="hover:text-primary transition-colors">{t}</span>
                  <span className="text-primary/50">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
