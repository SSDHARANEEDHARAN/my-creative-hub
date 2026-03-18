import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dharaneedharan SS | Mechatronics Design Engineer</title>
        <meta name="description" content="Mechatronics Design Engineer skilled in Industry 4.0, Robotics, PLC, Automation, and Embedded Systems." />
        <meta name="keywords" content="Mechatronics Engineer, CAD engineer, robotics portfolio, automation, SolidWorks, FlexSim, siemens nx, Industry 4.0" />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Skills />
          <Services />
          <Gallery />
          <Projects />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
