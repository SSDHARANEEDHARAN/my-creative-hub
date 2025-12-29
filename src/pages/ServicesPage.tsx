import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Code, Palette, Rocket, Check } from "lucide-react";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users",
    price: "$500",
    period: "starting",
    features: [
      "Custom Design System",
      "Responsive Layouts",
      "Interactive Prototypes",
      "User Research",
    ],
    popular: false,
  },
  {
    id: 2,
    icon: Code,
    title: "Web Development",
    description: "Modern, performant web applications built to scale",
    price: "$1,200",
    period: "starting",
    features: [
      "React/Next.js Apps",
      "TypeScript Codebase",
      "API Integration",
      "Database Design",
      "Cloud Deployment",
    ],
    popular: true,
  },
  {
    id: 3,
    icon: Rocket,
    title: "Full Package",
    description: "Complete solution from design to deployment",
    price: "$2,500",
    period: "starting",
    features: [
      "Everything in Design",
      "Everything in Development",
      "SEO Optimization",
      "Analytics Setup",
      "3 Months Support",
    ],
    popular: false,
  },
];

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Services | Alex Chen - Creative Developer</title>
        <meta name="description" content="Professional web development and UI/UX design services. From design to deployment, get your project built with excellence." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="text-primary font-medium tracking-widest uppercase text-sm">
                    Services
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-4">
                    What I Offer
                  </h1>
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                    Professional services tailored to bring your vision to life
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {services.map((service, index) => (
                  <ScrollReveal key={service.id} delay={index * 100}>
                    <div
                      className={`relative group bg-card/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 hover:shadow-lg h-full ${
                        service.popular
                          ? "border-primary/50 scale-105 shadow-lg"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                    >
                      {service.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <service.icon className="w-7 h-7 text-primary" />
                      </div>

                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {service.description}
                      </p>

                      <div className="mb-6">
                        <span className="text-4xl font-bold text-foreground">{service.price}</span>
                        <span className="text-muted-foreground ml-2">{service.period}</span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-muted-foreground">
                            <Check className="w-5 h-5 text-accent flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to="/contact">
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
                <div className="mt-16 text-center">
                  <p className="text-muted-foreground">
                    Need something custom?{" "}
                    <Link
                      to="/contact"
                      className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                    >
                      Let's discuss your project
                    </Link>
                  </p>
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
