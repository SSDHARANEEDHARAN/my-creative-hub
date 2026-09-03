import { Code, Palette, Rocket, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
            <span className="section-badge-dot-sharp" />
            <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4">
            What I Offer
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Professional services tailored to bring your vision to life
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative group sharp-card p-8 transition-all duration-500 hover:shadow-lg ${
                service.popular
                  ? "border-primary/50 scale-105 shadow-elegant"
                  : "hover:border-primary/30"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                {service.description}
              </p>

              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">{service.price}</span>
                <span className="text-muted-foreground ml-2 text-xs sm:text-sm">{service.period}</span>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={service.popular ? "accent" : "glass"}
                className="w-full rounded-none"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need something custom?{" "}
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              Let's discuss your project
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;