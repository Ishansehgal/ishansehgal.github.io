import { Navigation } from "@/components/Navigation";
import { MissionHud } from "@/components/MissionHud";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Journey } from "@/components/Journey";
import { CaseStudy } from "@/components/CaseStudy";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <MissionHud />
      <Hero />
      <About />
      <Journey />
      <CaseStudy />
      <Projects />
      <Expertise />
      <Contact />
    </div>
  );
};

export default Index;
