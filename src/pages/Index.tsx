import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Expertise } from "@/components/Expertise";
import { Projects } from "@/components/Projects";
import { VideoSection } from "@/components/VideoSection";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <VideoSection />
      <Contact />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Ishan Sehgal. Built with passion for robotics and autonomous systems.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
