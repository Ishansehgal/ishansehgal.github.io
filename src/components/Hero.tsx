const BOOT_LINES = [
  { delay: 100, text: "$ ros2 launch ishan_sehgal portfolio.launch.py" },
  { delay: 320, prefix: "[INFO] [navigation] ", text: "global plan computed — 7 waypoints" },
  { delay: 520, prefix: "[INFO] [slam]       ", text: "map → odom transform locked" },
  { delay: 720, prefix: "[INFO] [tars]       ", text: "gait controller active" },
  { delay: 920, prefix: "[INFO] [portfolio]  ", text: "scroll to start navigation" },
];

const TOPICS = [
  "/cmd_vel", "/scan", "/tf", "/odom", "/imu/data", "/map",
  "/goal_pose", "/joint_states", "/camera/image_raw", "/battery_state",
  "/global_costmap", "/plan", "/behavior_tree_log", "/diagnostics",
];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="relative z-10 flex-1 flex items-center pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-2xl space-y-8">
            {/* boot log */}
            <div className="font-mono text-[11px] md:text-xs leading-relaxed text-muted-foreground border border-border bg-card/85 backdrop-blur px-4 py-3 max-w-xl">
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
                className="font-display font-black text-[clamp(3.2rem,9vw,7rem)] leading-[0.9] uppercase bootline"
                style={{ "--boot-delay": "1100ms" } as React.CSSProperties}
              >
                Ishan
                <br />
                Sehgal<span className="text-primary">.</span>
              </h1>
            </div>

            <div className="bootline space-y-6 max-w-xl" style={{ "--boot-delay": "1250ms" } as React.CSSProperties}>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground bg-background/60 backdrop-blur-[2px]">
                I work across the autonomy stack:{" "}
                <span className="text-foreground font-medium">
                  custom Nav2 planners and behaviors in C++, SLAM and localization pipelines, and
                  firmware-level reverse engineering when the hardware is undocumented
                </span>
                . Robotics developer at RigBetel Labs; e-Yantra (IIT Bombay) research intern, 2024.
              </p>

              <p className="font-mono text-[11px] text-muted-foreground">
                ▾ TARS will walk the route with you — watch the map, bottom right.
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
                  className="px-6 py-3 border border-foreground bg-background/70 backdrop-blur-[2px] font-mono text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="/Ishan_Sehgal_r.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 border border-primary text-primary bg-background/70 backdrop-blur-[2px] font-mono text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* topic ticker */}
      <div className="relative z-10 border-y border-border bg-card/70 backdrop-blur overflow-hidden py-2.5">
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
