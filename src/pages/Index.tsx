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
        <title>Alex Chen | Creative Developer & Designer</title>
        <meta name="description" content="I build beautiful web experiences while exploring the world. Passionate about clean code, stunning design, and finding the best coffee shops in every city." />
        <meta name="keywords" content="web developer, designer, portfolio, react, typescript, frontend developer, freelance" />
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
