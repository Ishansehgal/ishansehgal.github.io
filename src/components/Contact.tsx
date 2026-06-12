import { useReveal } from "@/hooks/useReveal";
import { Mail, Github, Linkedin } from "lucide-react";

export const Contact = () => {
  const ref = useReveal();

  return (
    <section id="contact" className="py-24 md:py-36 px-4 md:px-8 relative overflow-hidden text-background">
      <div ref={ref} className="wp wp-dark max-w-6xl mx-auto relative">
        <div className="reveal font-mono text-[11px] md:text-xs text-background/60 mb-10 space-y-1">
          <div>$ ros2 topic pub /ishan/inbox std_msgs/String \</div>
          <div className="pl-4">
            "data: 'your message here'" <span className="text-primary">--once</span>
          </div>
        </div>

        <h2 className="reveal font-display font-black text-[clamp(2.6rem,8vw,6rem)] leading-[0.92] uppercase mb-10">
          Open to research
          <br />
          &amp; grad school
          <span className="text-primary">_</span>
        </h2>

        <p className="reveal text-background/70 text-lg max-w-2xl leading-relaxed mb-12" style={{ "--reveal-delay": "100ms" } as React.CSSProperties}>
          I'm looking toward graduate research in robotics — perception, navigation and embedded
          autonomy. If you're working on robots that have to function outside the lab, I'd love to
          talk.
        </p>

        <div className="reveal flex flex-wrap gap-4" style={{ "--reveal-delay": "180ms" } as React.CSSProperties}>
          <a
            href="mailto:sehgalishan26@gmail.com"
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-background hover:text-foreground transition-colors"
          >
            <Mail className="w-4 h-4" /> sehgalishan26@gmail.com
          </a>
          <a
            href="https://github.com/Ishansehgal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-background/40 font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-background hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sehgalishan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-background/40 font-mono text-xs uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-background hover:text-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
        </div>

        <div className="mt-20 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-background/50">
          <span>© {new Date().getFullYear()} Ishan Sehgal — Amritsar / Pune, IN</span>
          <span>built with React + Vite · source on GitHub</span>
        </div>
      </div>
    </section>
  );
};
