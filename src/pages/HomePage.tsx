import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Alex Chen | Creative Developer & Designer</title>
        <meta name="description" content="I build beautiful web experiences while exploring the world. Passionate about clean code, stunning design, and finding the best coffee shops in every city." />
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
