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
        <title>Dharaneedharan SS | Mechatronics Design Engineer & Full Stack Developer</title>
        <meta name="description" content="Mechatronics Design Engineer & Full Stack Developer skilled in Industry 4.0, Robotics, PLC, React, Python, and Embedded Systems." />
        <meta name="keywords" content="web developer, CAD engineer, portfolio, react, python, SolidWorks, FlexSim, full stack developer" />
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
