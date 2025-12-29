import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Expertise } from "@/components/Expertise";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <div className="bg-wireframe"></div> {/* 3D Background */}

      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Expertise />
      <Projects />
      <Contact />

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">© 2024 Ishan Sehgal. Built with React, Vite & ROS2 passion.</p>
          <a href="mailto:sehgalishan26@gmail.com" className="text-xs text-muted-foreground/50 mt-2 hover:text-primary transition-colors"> sehgalishan26@gmail.com </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
