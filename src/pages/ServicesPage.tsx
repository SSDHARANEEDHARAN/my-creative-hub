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
          <section className="py-24">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <div className="section-badge-sharp mb-6 inline-flex">
                    <span className="section-badge-dot-sharp" />
                    <span className="text-secondary-foreground font-medium text-sm">Services</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-4">
                    What I Offer
                  </h1>
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                    Professional services spanning IT development and Engineering design
                  </p>

                  {/* Category Tabs - Sharp Design */}
                  <div className="inline-flex items-center gap-2 p-1.5 bg-secondary mt-8">
                    <button
                      onClick={() => setActiveTab("it")}
                      className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-all duration-300 ${
                        activeTab === "it" 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Code size={18} />
                      IT Services
                    </button>
                    <button
                      onClick={() => setActiveTab("engineering")}
                      className={`flex items-center gap-2 px-5 py-2.5 font-medium transition-all duration-300 ${
                        activeTab === "engineering" 
                          ? "bg-accent text-accent-foreground shadow-md" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Cog size={18} />
                      Engineering Services
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {services.map((service, index) => (
                  <ScrollReveal key={service.id} delay={index * 100}>
                    <div
                      className={`relative group sharp-card p-6 transition-all duration-500 hover:shadow-lg h-full flex flex-col ${
                        service.popular
                          ? "border-primary/50 shadow-lg ring-2 ring-primary/20"
                          : "hover:border-primary/30"
                      }`}
                    >
                      {service.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 shadow-lg">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className={`w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${
                        activeTab === "it" 
                          ? "bg-gradient-to-br from-primary/20 to-accent/20" 
                          : "bg-gradient-to-br from-secondary/30 to-accent/20"
                      }`}>
                        <service.icon className={`w-6 h-6 ${activeTab === "it" ? "text-primary" : "text-accent"}`} />
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-5">
                        {service.description}
                      </p>

                      <div className="mb-5">
                        <span className="text-3xl font-bold text-foreground">{service.price}</span>
                        <span className="text-muted-foreground ml-2 text-sm">{service.period}</span>
                      </div>

                      <ul className="space-y-2.5 mb-6 flex-grow">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${activeTab === "it" ? "text-primary" : "text-accent"}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to="/contact" className="mt-auto">
                        <Button
                          variant={service.popular ? "hero" : "outline"}
                          className="w-full rounded-none"
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={400}>
                <div className="mt-16 text-center">
                  <div className="sharp-card p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-foreground mb-3">Need Something Custom?</h3>
                    <p className="text-muted-foreground mb-6">
                      Have a unique project in mind? Let's discuss your specific requirements and create a tailored solution.
                    </p>
                    <Link to="/contact">
                      <Button variant="hero" size="lg" className="rounded-none">
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