import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Creative Developer & Designer</title>
        <meta name="description" content="I transform ideas into stunning, functional web experiences. Specializing in modern web technologies with a passion for beautiful, user-centric design." />
        <meta name="keywords" content="web developer, designer, portfolio, react, typescript, frontend developer" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Projects />
          <Blog />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
