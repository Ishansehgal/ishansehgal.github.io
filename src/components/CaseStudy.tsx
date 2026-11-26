import { useReveal } from "@/hooks/useReveal";
import { ArrowUpRight } from "lucide-react";
import roomFly from "../assets/room_fly_through.mp4";
import houseFly from "../assets/house_fly_through.mp4";

export const STEPS = [
  {
    n: "01",
    title: "Liberate the platform",
    body: "Rooted a Mi Vacuum-Mop Pro 2 with Dustbuilder + Valetudo — fully cloud-free, with SSH into its Tina Linux (ARMv7) brain. Goal: a rigid, sensor-rich base to benchmark visual odometry, without building a chassis from scratch.",
    mono: "ssh root@vacuum · Tina Linux · ARMv7",
  },
  {
    n: "02",
    title: "Map the architecture",
    body: "Recon on the live system: two key processes (AuxCtrl, everest-server) and two serial ports (/dev/ttyS3, /dev/ttyS1) talking to an STM32 that owns every actuator and sensor.",
    mono: "AuxCtrl ↔ /dev/ttyS3 ↔ STM32",
  },
  {
    n: "03",
    title: "Decompile the firmware",
    body: "Pulled the binaries and decompiled them in Ghidra. Knowing the ISA gave readable pseudo-C; searching symbols like lidar, motor, encoder exposed how the host framed packets to the STM32 — byte structure by byte structure.",
    mono: "ghidra · string xrefs · offset tables",
  },
  {
    n: "04",
    title: "Decode the protocol",
    body: "Every packet: two sync bytes, a command byte (motor velocity, LiDAR power, heartbeat…), a length byte, then the payload with fixed field offsets. The STM32 demands a heartbeat every 25 ms — miss it and the base halts. Full packet layouts documented in the repo.",
    mono: "heartbeat_period = 25 ms // or it stops",
  },
  {
    n: "05",
    title: "Bridge it into ROS2",
    body: "A C bridge runs on the robot itself: scans the serial stream for sync bytes, reassembles payloads, does the bit-shifting and filtering, and streams clean data over TCP/WiFi (or USB). On the workstation: LiDAR, IMU, wheel encoders and full motor control as native ROS2 topics.",
    mono: "serial → C bridge → TCP → ros2 topic echo /scan",
  },
];

export const TALK_TEXT =
  "The vacuum is now my research robot: one USB webcam about 15 cm off the floor, and a 2D lidar that sees one line at 13.5 cm. Depth Anything 3 gives depth in metres from one image. Inside one frame the shape is right, but each frame has its own scale, so one wall becomes several in the map. I put every lidar point on the image, fit DA3's error as a straight line in log, and spread what is left to every pixel of the same material and surface. The fixed depth goes into RTAB-Map.";

export const TALK_STATS = [
  { v: "8.9 cm", t: "camera-only path over a 7.6 m drive. No lidar, no wheels. ORB-SLAM3 mono: 37–40 cm." },
  { v: "15.4 → 4.8 cm", t: "room walls 1 to 1.6 m up, far above the lidar line" },
  { v: "10.7 FPS", t: "the whole system, live, on a 6 GB laptop GPU" },
];

export const CaseStudy = ({ inWorld = false }: { inWorld?: boolean }) => {
  const ref = useReveal();

  const body = (
      <div ref={ref} className="wp max-w-6xl mx-auto relative">
        <div className="absolute inset-0 bg-gridpaper-fine pointer-events-none opacity-60" />
        <div className="flex items-baseline gap-4 mb-4 reveal">
          <span className="kicker text-primary">03 / featured research</span>
          <div className="flex-1 h-px bg-border reveal-line" />
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 mb-16 items-end">
          <h2 className="reveal font-display font-black text-4xl md:text-6xl leading-[0.95] uppercase">
            Reverse-engineering a vacuum into a{" "}
            <span className="text-primary">research platform</span>
          </h2>
          <div className="reveal space-y-4" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <p className="text-muted-foreground leading-relaxed">
              I had an old Mi robot vacuum lying around and needed a solid base to test some visual
              odometry work. Building one from scratch is hard, so I decided to take full control of
              this one instead. Two weekends later it was cloud-free and running ROS2 — LiDAR, IMU,
              encoders and motor control, all exposed.
            </p>
            <a
              href="https://github.com/Ishansehgal/mi_vacuum_edu_hack"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary border border-primary px-4 py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              mi_vacuum_edu_hack <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* decoded packet diagram */}
        <figure className="reveal mb-16">
          <div className="border border-foreground bg-card overflow-x-auto">
            <div className="flex min-w-[640px] font-mono text-center text-[11px] md:text-xs">
              {[
                { label: "SYNC", sub: "0x__ 0x__", w: "w-[14%]", hot: false },
                { label: "CMD", sub: "vel · lidar · ♥", w: "w-[14%]", hot: true },
                { label: "LEN", sub: "payload size", w: "w-[12%]", hot: false },
                { label: "PAYLOAD", sub: "fixed field offsets — odom, imu, scan…", w: "w-[48%]", hot: false },
                { label: "CKSUM", sub: "verify", w: "w-[12%]", hot: false },
              ].map((f, i) => (
                <div
                  key={f.label}
                  className={`${f.w} py-5 px-2 ${i > 0 ? "border-l border-foreground/40" : ""} ${
                    f.hot ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  <div className="font-semibold tracking-[0.2em]">{f.label}</div>
                  <div className={`text-[9px] md:text-[10px] mt-1 ${f.hot ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {f.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figcaption className="font-mono text-[10px] text-muted-foreground mt-3 flex flex-wrap justify-between gap-2">
            <span>fig. 2 — host ↔ STM32 frame, recovered via static analysis</span>
            <span className="text-primary">♥ heartbeat every 25 ms, or the base halts</span>
          </figcaption>
        </figure>

        {/* the five steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="reveal bg-background p-5 flex flex-col gap-3 hover:bg-card transition-colors group"
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="font-mono text-3xl font-semibold text-border group-hover:text-primary transition-colors">
                {s.n}
              </div>
              <h3 className="font-display-tight font-semibold text-base leading-tight">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed flex-1">{s.body}</p>
              <div className="font-mono text-[10px] text-accent border-t border-border pt-3 break-words">
                {s.mono}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-8 flex flex-wrap gap-2" style={{ "--reveal-delay": "200ms" } as React.CSSProperties}>
          {["Ghidra", "ARMv7", "STM32", "Serial Protocols", "C", "ROS2", "Valetudo", "Embedded Linux"].map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-wider border border-border bg-background px-2 py-1 text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        {/* what the platform does now: the ROSCon India 2026 talk */}
        <div className="reveal mt-20 border-t border-border pt-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 mb-10 items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
                06 / selected talk · ROSCon India 2026, main stage
              </div>
              <h3 className="font-display font-black text-3xl md:text-4xl uppercase leading-[0.95]">
                Odometry and a 3D map from <span className="text-primary">one camera</span>
              </h3>
              <div className="font-mono text-[11px] text-muted-foreground mt-3">
                Depth Anything 3 and ROS 2 on a small home robot
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{TALK_TEXT}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border mb-10">
            {TALK_STATS.map((s) => (
              <div key={s.v} className="bg-background p-5">
                <div className="font-mono text-2xl font-semibold text-primary">{s.v}</div>
                <p className="text-[13px] text-muted-foreground leading-relaxed mt-2">{s.t}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { src: roomFly, fig: "fig. 3 — room, one live run", note: "walls at the lidar's height: 9.0 → 3.2 cm" },
              { src: houseFly, fig: "fig. 4 — full house, 54 m, nothing tuned", note: "walls 1 to 1.6 m up: 6.9 → 3.8 cm" },
            ].map((f) => (
              <figure key={f.fig}>
                <video
                  src={f.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full border border-foreground/20 bg-secondary"
                />
                <figcaption className="font-mono text-[10px] text-muted-foreground mt-3 flex flex-wrap justify-between gap-2">
                  <span>{f.fig}</span>
                  <span className="text-primary">{f.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
  );

  return inWorld ? (
    <div className="relative overflow-hidden">{body}</div>
  ) : (
    <section id="research" className="py-24 md:py-32 px-4 md:px-8 relative overflow-hidden">{body}</section>
  );
};
