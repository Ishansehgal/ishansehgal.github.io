import { lazy, Suspense, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MissionHud } from "@/components/MissionHud";
import { MiniMap } from "@/components/world/MiniMap";
import { HoloOverlay } from "@/components/world/HoloOverlay";
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

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A transparent gap where the 3D world takes the stage (2D fallback only). */
const WorldWindow = ({ open }: { open: boolean }) => (
  <div aria-hidden className={`pointer-events-none ${open ? "h-[85vh] md:h-screen" : "h-16"}`} />
);

/** Empty, full-height anchors that give the journey its scroll length and feed
 *  the nav / active-section logic — the visible content lives in HoloOverlay. */
const STAGE = ["about", "journey", "research", "projects", "expertise", "contact"];

const Index = () => {
  const [webgl] = useState(supportsWebGL);
  const [reduced] = useState(prefersReduced);
  const immersive = webgl && !reduced;

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
      {immersive && <HoloOverlay />}

      <main className="relative z-10">
        <Hero />

        {immersive ? (
          STAGE.map((id) => <section key={id} id={id} className="min-h-screen" aria-hidden="true" />)
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
