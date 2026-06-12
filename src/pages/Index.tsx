import { lazy, Suspense, useState } from "react";
import { useWorldPanels } from "@/hooks/useWorldPanels";
import { Navigation } from "@/components/Navigation";
import { MissionHud } from "@/components/MissionHud";
import { MiniMap } from "@/components/world/MiniMap";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { CaseStudy } from "@/components/CaseStudy";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { Contact } from "@/components/Contact";

const TarsWorld = lazy(() => import("@/components/world/TarsWorld"));

const supportsWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

/** A transparent gap where the 3D world takes the stage. */
const WorldWindow = ({ open }: { open: boolean }) => (
  <div aria-hidden className={`pointer-events-none ${open ? "h-[85vh] md:h-screen" : "h-16"}`} />
);

const Index = () => {
  const [webgl] = useState(supportsWebGL);
  useWorldPanels();

  return (
    <div className="min-h-screen text-foreground">
      {webgl && (
        <Suspense fallback={null}>
          <TarsWorld />
        </Suspense>
      )}
      <Navigation />
      <MissionHud />
      <MiniMap webgl={webgl} />

      <main className="relative z-10">
        <Hero />
        <WorldWindow open={webgl} />
        <About />
        <WorldWindow open={webgl} />
        <Journey />
        <WorldWindow open={webgl} />
        <CaseStudy />
        <WorldWindow open={webgl} />
        <Projects />
        <WorldWindow open={webgl} />
        <Expertise />
        <WorldWindow open={webgl} />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
