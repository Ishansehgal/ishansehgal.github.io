import { useState, useEffect } from "react";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/50" : ""
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold hover:scale-105 transition-transform"
          >
            Ishan Sehgal
          </button>

          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm hover:text-primary transition-colors uppercase tracking-wider font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm hover:text-primary transition-colors uppercase tracking-wider font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("experience")}
              className="text-sm hover:text-primary transition-colors uppercase tracking-wider font-medium"
            >
              Journey
            </button>
            <button
              onClick={() => scrollToSection("expertise")}
              className="text-sm hover:text-primary transition-colors uppercase tracking-wider font-medium"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm hover:text-primary transition-colors uppercase tracking-wider font-medium"
            >
              Projects
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
