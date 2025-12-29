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
    { icon: <Mail size={20} />, label: "Email", value: "hello@alexchen.dev", link: "mailto:hello@alexchen.dev" },
    { icon: <Phone size={20} />, label: "Phone", value: "+1 (555) 123-4567", link: "tel:+15551234567" },
    { icon: <MapPin size={20} />, label: "Location", value: "San Francisco, CA", link: null },
  ];

  const benefits = [
    { icon: <CheckCircle size={18} />, text: "Quick response within 24 hours" },
    { icon: <Clock size={18} />, text: "Flexible scheduling" },
    { icon: <MessageSquare size={18} />, text: "Clear communication" },
  ];

  return (
    <>
      <Helmet>
        <title>Contact | Alex Chen - Get In Touch</title>
        <meta name="description" content="Get in touch with Alex Chen for web development and design projects. Let's create something amazing together." />
      </Helmet>
      
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navigation />
        <main className="pt-20">
          <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2/3 h-full bg-secondary/30 rounded-r-[200px] -z-10" />
            
            <div className="container mx-auto px-6">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
                    <Mail className="text-primary" size={16} />
                    <span className="text-secondary-foreground font-medium text-sm">Get In Touch</span>
                  </div>
                  
                  <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                    Let's Create Something <span className="text-gradient">Amazing</span>
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Have a project in mind or just want to chat? I'd love to hear from you. 
                    Drop me a message and let's bring your ideas to life.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-8">
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      {contactInfo.map((info) => (
                        <div key={info.label} className="flex items-start gap-4 group">
                          <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shrink-0 shadow-sm">
                            {info.icon}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                            {info.link ? (
                              <a href={info.link} className="font-medium hover:text-primary transition-colors">
                                {info.value}
                              </a>
                            ) : (
                              <p className="font-medium">{info.value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={200}>
                    <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                      <h4 className="font-display text-xl font-semibold mb-4">
                        Why Work With Me?
                      </h4>
                      <div className="space-y-3">
                        {benefits.map((benefit) => (
                          <div key={benefit.text} className="flex items-center gap-3 text-muted-foreground">
                            <span className="text-accent">{benefit.icon}</span>
                            <span className="text-sm">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={300}>
                    <div className="p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                        <h4 className="font-display text-lg font-semibold text-primary">
                          Currently Available
                        </h4>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        I'm open for freelance projects and full-time positions. 
                        Let's discuss how I can help bring your vision to life.
                      </p>
                      <h4 className="font-display text-sm font-semibold mb-2">Follow Me</h4>
                      <SocialLinks />
                    </div>
                  </ScrollReveal>
                </div>

                {/* Contact Form */}
                <ScrollReveal delay={400} className="lg:col-span-3">
                  <form onSubmit={handleSubmit} className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-lg space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Your Name <span className="text-primary">*</span>
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          required
                          className="bg-secondary/50 border-border focus:border-primary h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Your Email <span className="text-primary">*</span>
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                          className="bg-secondary/50 border-border focus:border-primary h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Subject <span className="text-primary">*</span>
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Project Inquiry / Collaboration / General Question"
                        required
                        className="bg-secondary/50 border-border focus:border-primary h-12 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Message <span className="text-primary">*</span>
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project, goals, and how I can help..."
                        required
                        rows={6}
                        className="bg-secondary/50 border-border focus:border-primary resize-none rounded-xl"
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
                          <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending Message...
                        </span>
                      ) : (
                        <>
                          Send Message <Send size={18} />
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
