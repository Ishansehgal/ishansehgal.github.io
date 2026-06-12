import { useState, useEffect } from "react";

const LINKS = [
  { id: "about", label: "Mission", index: "01" },
  { id: "journey", label: "Journey", index: "02" },
  { id: "research", label: "Research", index: "03" },
  { id: "projects", label: "Work", index: "04" },
  { id: "expertise", label: "Stack", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setOpen(false);
    if (id === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 group"
          >
            <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">
              ishan_sehgal<span className="text-muted-foreground">.node</span>
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-primary border border-primary/40 px-1.5 py-0.5 tracking-widest">
              ACTIVE
            </span>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToSection(l.id)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary/60 mr-1">{l.index}</span>
                {l.label}
              </button>
            ))}
            <a
              href="/Ishan_Sehgal_r.pdf"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.18em] bg-foreground text-background px-3 py-1.5 hover:bg-primary transition-colors"
            >
              Resume ↗
            </a>
          </div>

          <button
            className="md:hidden font-mono text-xs uppercase tracking-widest"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "[ close ]" : "[ menu ]"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="text-left font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary py-1"
            >
              <span className="text-primary/60 mr-2">{l.index}</span>
              {l.label}
            </button>
          ))}
          <a
            href="/Ishan_Sehgal_r.pdf"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-[0.18em] text-primary py-1"
          >
            Resume ↗
          </a>
        </div>
      )}
    </nav>
  );
};
