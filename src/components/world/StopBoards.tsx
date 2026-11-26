import { ArrowUpRight } from "lucide-react";
import { MissionLine, profileImg } from "@/components/About";
import { NODES } from "@/components/Journey";
import { PROJECTS } from "@/components/Projects";
import { STACK } from "@/components/Expertise";
import { STEPS, TALK_TEXT, TALK_STATS } from "@/components/CaseStudy";
import roomFly from "../../assets/room_fly_through.mp4";

/**
 * What each stop's board says. Every line comes from the page sections
 * (About, Journey, Projects, CaseStudy, Expertise), cut to the place TARS
 * is parked at — the full sections still render as the plain page.
 */

const node = (org: string) => NODES.find((n) => n.org.startsWith(org))!;
const project = (id: string) => PROJECTS.find((p) => p.id === id)!;

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-3">{children}</div>
);

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1.5 mt-4">
    {tags.map((t) => (
      <span key={t} className="font-mono text-[10px] uppercase tracking-wider border border-border px-2 py-0.5 text-muted-foreground">
        {t}
      </span>
    ))}
  </div>
);

const Ext = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary border-b border-primary/50 hover:border-primary pb-0.5"
  >
    {children} <ArrowUpRight className="w-3.5 h-3.5" />
  </a>
);

const Entry = ({ org, title }: { org: string; title?: string }) => {
  const n = node(org);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display font-bold text-xl leading-tight">{title ?? n.org}</h3>
        <span className="font-mono text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 shrink-0">{n.period}</span>
      </div>
      <div className="font-mono text-[12px] text-primary mt-1 mb-2">{n.role}</div>
      <p className="text-[14px] text-muted-foreground leading-relaxed">{n.desc}</p>
    </div>
  );
};

export const AmritsarBoard = () => (
  <div>
    <div className="flex gap-4 items-start mb-6">
      <img
        src={profileImg}
        alt="Ishan Sehgal with the Unitree G1"
        className="w-20 h-24 object-cover grayscale border border-foreground/20 shrink-0"
      />
      <h2 className="font-display font-bold leading-[1.08]">
        <MissionLine />
      </h2>
    </div>
    <div className="border-t border-border pt-5">
      <Kicker>2021 – 25 · Amritsar · where it started</Kicker>
      <Entry org="Guru Nanak" title="Guru Nanak Dev University" />
    </div>
  </div>
);

export const BombayBoard = () => (
  <div className="space-y-6">
    <Kicker>2023 – 24 · Mumbai · IIT Bombay</Kicker>
    <Entry org="e-Yantra Robotics" />
    <Entry org="e-Yantra, IIT" />
    <Ext href={project("P-05").link}>Cosmo Logistic on GitHub</Ext>
  </div>
);

export const PuneBoard = () => {
  const n = node("RigBetel");
  return (
    <div>
      <Kicker>July 2025 → now · Pune</Kicker>
      <h2 className="font-display font-black uppercase leading-[0.95] mb-2">{n.org}</h2>
      <div className="font-mono text-[12px] text-primary mb-4">{n.role}</div>
      <p className="text-[15px] text-muted-foreground leading-relaxed">{n.desc}</p>
      <Tags tags={n.tags} />
    </div>
  );
};

export const WorkshopBoard = () => (
  <div>
    <Kicker>The workshop · what I've built</Kicker>
    <div className="space-y-4 mb-7">
      {["P-02", "P-03", "P-04", "P-06"].map((id) => {
        const p = project(id);
        return (
          <div key={id} className="border-l-2 border-primary/60 pl-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display-tight font-bold leading-tight">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-primary inline-flex gap-1">
                    {p.title} <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground shrink-0">{p.context}</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">{p.description}</p>
          </div>
        );
      })}
    </div>
    <div id="expertise-board" className="border-t border-border pt-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">// the stack</div>
      <div className="space-y-2">
        {STACK.map((g) => (
          <div key={g.category} className="text-[12px] leading-snug">
            <span className="font-mono text-primary uppercase tracking-wider text-[10px] mr-2">{g.category}</span>
            <span className="text-muted-foreground">{g.items.join(" · ")}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const VacuumBoard = () => (
  <div>
    <Kicker>The vacuum · featured research</Kicker>
    <h2 className="font-display font-black uppercase leading-[0.95] mb-4">
      Reverse-engineering a vacuum into a <span className="text-primary">research platform</span>
    </h2>
    <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
      I had an old Mi robot vacuum lying around and needed a solid base to test some visual odometry work.
      Two weekends later it was cloud-free and running ROS2: LiDAR, IMU, encoders and motor control, all exposed.
    </p>
    <ol className="space-y-2.5 mb-5">
      {STEPS.map((s) => (
        <li key={s.n} className="flex gap-3 items-baseline">
          <span className="font-mono text-[11px] text-primary w-5 shrink-0">{s.n}</span>
          <div>
            <div className="font-display-tight font-semibold text-[14px] leading-tight">{s.title}</div>
            <div className="font-mono text-[10.5px] text-muted-foreground break-words">{s.mono}</div>
          </div>
        </li>
      ))}
    </ol>
    <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
      <Ext href="https://github.com/Ishansehgal/mi_vacuum_edu_hack">mi_vacuum_edu_hack</Ext>
      <span className="font-mono text-[10px] text-muted-foreground">beside you: my room, mapped from its one camera</span>
    </div>
  </div>
);

export const RosconBoard = () => (
  <div>
    <Kicker>ROSCon India 2026 · main stage · Bengaluru</Kicker>
    <h2 className="font-display font-black uppercase leading-[0.95]">
      Odometry and a 3D map from <span className="text-primary">one camera</span>
    </h2>
    <div className="font-mono text-[11px] text-muted-foreground mt-2 mb-4">
      Depth Anything 3 and ROS 2 on a small home robot · selected from 75+ proposals
    </div>
    <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">{TALK_TEXT}</p>
    <div className="grid grid-cols-3 gap-px bg-border border border-border mb-5 stat-row">
      {TALK_STATS.map((s) => (
        <div key={s.v} className="bg-background p-3">
          <div className="font-mono text-[15px] font-semibold text-primary leading-tight">{s.v}</div>
          <p className="text-[11px] text-muted-foreground leading-snug mt-1">{s.t}</p>
        </div>
      ))}
    </div>
    <figure>
      <video src={roomFly} autoPlay loop muted playsInline className="w-full border border-foreground/20 bg-secondary" />
      <figcaption className="font-mono text-[10px] text-muted-foreground mt-2 flex flex-wrap justify-between gap-2">
        <span>fig. 3 · room, one live run</span>
        <span className="text-primary">on the big screen: the full house, 54 m</span>
      </figcaption>
    </figure>
  </div>
);
