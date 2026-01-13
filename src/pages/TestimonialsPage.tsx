import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Exceptional work! The attention to detail and creative approach exceeded our expectations. Delivered on time with outstanding quality.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager, InnovateCo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "A true professional who understands both design and functionality. Our project was transformed into something amazing.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Founder, DesignHub",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Incredibly talented and easy to work with. The final product was beyond what we imagined. Highly recommended!",
  },
  {
    id: 4,
    name: "David Park",
    role: "CTO, FutureTech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Outstanding technical skills combined with creative vision. A rare combination that delivered exceptional results.",
  },
];

const TestimonialsPage = () => {
  return (
    <>
      <Helmet>
        <title>Testimonials | Tharaneetharan SS - Client Reviews</title>
        <meta name="description" content="Read what clients say about working with Tharaneetharan SS. Exceptional web development and engineering services." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="text-accent font-medium tracking-widest uppercase text-sm">
                    Testimonials
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mt-4">
                    Client Reviews
                  </h1>
                  <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                    What my clients say about working together
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <ScrollReveal key={testimonial.id} delay={index * 100}>
                    <div className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-lg">
                      <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
                      
                      <div className="flex items-center gap-4 mb-6">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-accent text-accent"
                          />
                        ))}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TestimonialsPage;
