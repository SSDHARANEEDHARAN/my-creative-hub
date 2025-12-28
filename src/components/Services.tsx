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
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sky font-medium tracking-widest uppercase text-sm">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-4">
            What I Offer
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Professional services tailored to bring your vision to life
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative group bg-card/50 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-500 hover:shadow-glow ${
                service.popular
                  ? "border-sky/50 scale-105 shadow-elegant"
                  : "border-border/50 hover:border-sky/30"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-sky text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky/20 to-mint/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-sky" />
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
                    <Check className="w-5 h-5 text-mint flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={service.popular ? "mint" : "glass"}
                className="w-full"
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
              className="text-sky hover:text-mint transition-colors underline underline-offset-4"
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
