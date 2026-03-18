import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";


const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Dharaneedharan SS | Mechatronics Design Engineer</title>
        <meta name="description" content="Mechatronics Design Engineer skilled in Robotics, Automation, Embedded Systems, SolidWorks, FlexSim, NX, siemens nx, and PTC Windchill." />
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
