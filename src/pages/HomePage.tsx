import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Tharaneetharan SS | Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Full Stack Developer & CAD Engineer skilled in React, Python, Embedded Systems, SolidWorks, FlexSim, NX, Creo, and PTC Windchill." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main>
          <Hero />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
