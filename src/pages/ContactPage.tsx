import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SocialLinks from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MapPin, Phone, Send, CheckCircle, Clock, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out. I'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail size={18} />, label: "Email", value: "tharaneetharanss@gmail.com", link: "mailto:tharaneetharanss@gmail.com" },
    { icon: <Phone size={18} />, label: "Phone", value: "+91 8870086023", link: "tel:+918870086023" },
    { icon: <MapPin size={18} />, label: "Location", value: "Tamil Nadu, India", link: null },
  ];

  const benefits = [
    { icon: <CheckCircle size={16} />, text: "Quick response within 24 hours" },
    { icon: <Clock size={16} />, text: "Flexible scheduling" },
    { icon: <MessageSquare size={16} />, text: "Clear communication" },
  ];

  return (
    <>
      <Helmet>
        <title>Contact | Tharaneetharan SS - Get In Touch</title>
        <meta name="description" content="Get in touch with Tharaneetharan SS for IT development and Engineering design projects. Let's create something amazing together." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2/3 h-full bg-secondary/30 -z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }} />
            
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal>
                <div className="text-center mb-10 sm:mb-16">
                  <div className="section-badge-sharp mb-4 sm:mb-6 inline-flex">
                    <span className="section-badge-dot-sharp" />
                    <span className="text-secondary-foreground font-medium text-xs sm:text-sm">Get In Touch</span>
                  </div>
                  
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
                    Let's Create Something <span className="text-gradient">Amazing</span>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                    Have a project in mind or just want to chat? I'd love to hear from you. 
                    Drop me a message and let's bring your ideas to life.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 max-w-6xl mx-auto">
                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  <ScrollReveal delay={100}>
                    <div className="space-y-4 sm:space-y-6">
                      {contactInfo.map((info) => (
                        <div key={info.label} className="flex items-start gap-3 sm:gap-4 group">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card border-2 border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300 shrink-0">
                            {info.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">{info.label}</p>
                            {info.link ? (
                              <a href={info.link} className="font-medium hover:text-muted-foreground transition-colors text-sm sm:text-base break-all">
                                {info.value}
                              </a>
                            ) : (
                              <p className="font-medium text-sm sm:text-base">{info.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={200}>
                    <div className="bg-card border-2 border-border p-4 sm:p-6">
                      <h4 className="font-display text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                        Why Work With Me?
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        {benefits.map((benefit) => (
                          <div key={benefit.text} className="flex items-center gap-2 sm:gap-3 text-muted-foreground">
                            <span className="text-foreground">{benefit.icon}</span>
                            <span className="text-xs sm:text-sm">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={300}>
                    <div className="p-4 sm:p-6 border-2 border-dashed border-foreground/30 bg-secondary/50">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-foreground animate-pulse" />
                        <h4 className="font-display text-base sm:text-lg font-semibold">
                          Currently Available
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
                        I'm open for freelance projects and full-time positions. 
                        Let's discuss how I can help bring your vision to life.
                      </p>
                      <h4 className="font-display text-xs sm:text-sm font-semibold mb-2">Follow Me</h4>
                      <SocialLinks />
                    </div>
                  </ScrollReveal>
                </div>

                {/* Contact Form */}
                <ScrollReveal delay={400} className="lg:col-span-3">
                  <form onSubmit={handleSubmit} className="bg-card border-2 border-border p-6 sm:p-8 md:p-10 shadow-lg space-y-4 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block">
                          Your Name <span className="text-foreground">*</span>
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="input-sharp h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block">
                          Your Email <span className="text-foreground">*</span>
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                          className="input-sharp h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">
                        Subject <span className="text-foreground">*</span>
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Project Inquiry / Collaboration"
                        required
                        className="input-sharp h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">
                        Message <span className="text-foreground">*</span>
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        required
                        rows={5}
                        className="input-sharp resize-none text-sm sm:text-base"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-background/30 border-t-background animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          Send Message <Send size={16} />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground">
                      By submitting this form, you agree to receive a response via email.
                    </p>
                  </form>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;