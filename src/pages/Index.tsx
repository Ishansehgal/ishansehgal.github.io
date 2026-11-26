import { lazy, Suspense, useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MissionHud } from "@/components/MissionHud";
import { MiniMap } from "@/components/world/MiniMap";
import { HoloOverlay } from "@/components/world/HoloOverlay";
import { WAYPOINTS } from "@/components/world/path";
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
const STAGE = WAYPOINTS.slice(1).map((w) => w.id);
const PLAIN_RAIL = ["home", "about", "journey", "research", "projects", "expertise", "contact"];

const Index = () => {
  const [webgl] = useState(supportsWebGL);
  const [reduced] = useState(prefersReduced);
  const immersive = webgl && !reduced;

  // a link like /#roscon lands on that stop (the sections only exist after render)
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="min-h-screen text-foreground">
      {webgl && (
        <Suspense fallback={null}>
          <TarsWorld />
        </Suspense>
      )}
      <Navigation />
      <MissionHud ids={immersive ? WAYPOINTS.map((w) => w.id) : PLAIN_RAIL} />
      <MiniMap webgl={webgl} />
      {immersive && <HoloOverlay />}

      <main className="relative z-10">
        <Hero />

        {immersive ? (
          STAGE.map((id) => (
            <section key={id} id={id} className="min-h-screen" aria-hidden="true">
              {/* the stack lives on the workshop board; keep the nav's Stack link landing there */}
              {id === "projects" && <span id="expertise" />}
            </section>
          ))
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
