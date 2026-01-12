import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Code, Cog, Brain, Rocket, Check, MessageSquare, Cpu } from "lucide-react";
import { useState } from "react";

const itServices = [
  {
    id: 1,
    icon: Code,
    title: "Web Development",
    description: "Modern, responsive web applications built with cutting-edge technologies",
    price: "₹15,000",
    period: "starting",
    features: [
      "React/Next.js Applications",
      "TypeScript Codebase",
      "Responsive Design",
      "API Integration",
      "Database Design",
      "Cloud Deployment",
    ],
    popular: false,
  },
  {
    id: 2,
    icon: Cpu,
    title: "Software Development",
    description: "Custom software solutions for desktop, mobile, and embedded systems",
    price: "₹25,000",
    period: "starting",
    features: [
      "Desktop Applications",
      "Mobile Apps (React Native)",
      "Embedded Systems (Arduino/RPi)",
      "IoT Solutions",
      "Python Automation",
      "Cross-Platform Support",
    ],
    popular: true,
  },
  {
    id: 3,
    icon: Brain,
    title: "AI Solutions",
    description: "Intelligent systems with machine learning and data analytics",
    price: "₹35,000",
    period: "starting",
    features: [
      "Machine Learning Models",
      "Data Analytics Dashboard",
      "Predictive Analysis",
      "Computer Vision",
      "NLP Integration",
      "AI-Powered Automation",
    ],
    popular: false,
  },
  {
    id: 4,
    icon: MessageSquare,
    title: "Special Queries",
    description: "Custom IT solutions tailored to your specific requirements",
    price: "Custom",
    period: "quote",
    features: [
      "Custom Integration",
      "Legacy System Migration",
      "Technical Consulting",
      "Code Review & Audit",
      "Performance Optimization",
      "Dedicated Support",
    ],
    popular: false,
  },
];

const engineeringServices = [
  {
    id: 5,
    icon: Cog,
    title: "CAD Design & Modeling",
    description: "Professional 3D CAD design using SolidWorks, NX, and Creo",
    price: "₹10,000",
    period: "starting",
    features: [
      "3D Part Modeling",
      "Assembly Design",
      "Technical Drawings",
      "GD&T Application",
      "Design for Manufacturing",
      "Reverse Engineering",
    ],
    popular: false,
  },
  {
    id: 6,
    icon: Rocket,
    title: "Engineering Projects",
    description: "Complete engineering solutions from concept to production",
    price: "₹30,000",
    period: "starting",
    features: [
      "Product Development",
      "FEA/CFD Analysis",
      "Prototype Design",
      "Manufacturing Support",
      "Tool & Fixture Design",
      "Documentation Package",
    ],
    popular: true,
  },
  {
    id: 7,
    icon: Brain,
    title: "Simulation & Analysis",
    description: "FlexSim simulation and process optimization",
    price: "₹20,000",
    period: "starting",
    features: [
      "FlexSim Modeling",
      "Production Line Simulation",
      "Bottleneck Analysis",
      "Warehouse Optimization",
      "Throughput Analysis",
      "Process Improvement",
    ],
    popular: false,
  },
  {
    id: 8,
    icon: MessageSquare,
    title: "Special Queries",
    description: "Custom engineering solutions for unique requirements",
    price: "Custom",
    period: "quote",
    features: [
      "PLM Implementation",
      "Windchill Configuration",
      "Custom Automation",
      "Technical Consulting",
      "Training & Support",
      "On-site Assistance",
    ],
    popular: false,
  },
];

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState<"it" | "engineering">("it");
  const services = activeTab === "it" ? itServices : engineeringServices;

  return (
    <>
      <Helmet>
        <title>Services | Tharanee Tharan S.S - Full Stack Developer & CAD Engineer</title>
        <meta name="description" content="Professional IT and Engineering services including web development, software development, AI solutions, CAD design, and manufacturing simulation." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-12 sm:py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-10 sm:mb-16">
                  <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
                    <span className="section-badge-dot-sharp" />
                    <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Services</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4">
                    What I Offer
                  </h1>
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                    Professional services spanning IT development and Engineering design
                  </p>

                  {/* Category Tabs - Sharp Design */}
                  <div className="inline-flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-secondary mt-6 sm:mt-8">
                    <button
                      onClick={() => setActiveTab("it")}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 font-medium transition-all duration-300 w-full sm:w-auto text-sm sm:text-base ${
                        activeTab === "it" 
                          ? "bg-foreground text-background shadow-md" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Code size={16} />
                      IT Services
                    </button>
                    <button
                      onClick={() => setActiveTab("engineering")}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 font-medium transition-all duration-300 w-full sm:w-auto text-sm sm:text-base ${
                        activeTab === "engineering" 
                          ? "bg-foreground text-background shadow-md" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Cog size={16} />
                      Engineering
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                {services.map((service, index) => (
                  <ScrollReveal key={service.id} delay={index * 100}>
                    <div
                      className={`relative group bg-card border-2 p-4 sm:p-6 transition-all duration-500 hover:shadow-lg h-full flex flex-col ${
                        service.popular
                          ? "border-foreground shadow-lg"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {service.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-foreground text-background text-xs font-semibold px-3 py-1 shadow-lg whitespace-nowrap">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary border-2 border-border flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-foreground group-hover:border-foreground transition-all">
                        <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-background transition-colors" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-5">
                        {service.description}
                      </p>

                      <div className="mb-4 sm:mb-5">
                        <span className="text-2xl sm:text-3xl font-bold text-foreground">{service.price}</span>
                        <span className="text-muted-foreground ml-2 text-xs sm:text-sm">{service.period}</span>
                      </div>

                      <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-6 flex-grow">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-xs sm:text-sm">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-foreground" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to="/contact" className="mt-auto">
                        <Button
                          variant={service.popular ? "hero" : "outline"}
                          className="w-full"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={400}>
                <div className="mt-12 sm:mt-16 text-center">
                  <div className="bg-card border-2 border-border p-6 sm:p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Need Something Custom?</h3>
                    <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                      Have a unique project in mind? Let's discuss your specific requirements and create a tailored solution.
                    </p>
                    <Link to="/contact">
                      <Button variant="hero" size="lg">
                        Let's Discuss Your Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;