import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
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
    { icon: <Mail size={20} />, label: "Email", value: "tharaneetharanss@gmail.com", link: "mailto:tharaneetharanss@gmail.com" },
    { icon: <Phone size={20} />, label: "Phone", value: "+91 8870086023", link: "tel:+918870086023" },
    { icon: <MapPin size={20} />, label: "Location", value: "Namakkal, India", link: null },
  ];

  const benefits = [
    { icon: <CheckCircle size={18} />, text: "Quick response within 24 hours" },
    { icon: <Clock size={18} />, text: "Flexible scheduling" },
    { icon: <MessageSquare size={18} />, text: "Clear communication" },
  ];

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background decoration - Sharp edge */}
      <div className="absolute top-0 left-0 w-2/3 h-full bg-secondary/30 -z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }} />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-badge-sharp mb-6 inline-flex">
            <span className="section-badge-dot-sharp" />
            <span className="text-secondary-foreground font-medium text-sm">Get In Touch</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Let's Create Something <span className="text-gradient">Amazing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you. 
            Drop me a message and let's bring your ideas to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-card border-2 border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shrink-0 shadow-sm">
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

            {/* Benefits Card */}
            <div className="sharp-card p-6">
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

            {/* Availability Card */}
            <div className="p-6 border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-accent animate-pulse" />
                <h4 className="font-display text-lg font-semibold text-primary">
                  Currently Available
                </h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                I'm open for freelance projects and full-time positions. 
                Let's discuss how I can help bring your vision to life.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="sharp-card p-8 md:p-10 shadow-lg space-y-6">
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
                    className="input-sharp h-12"
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
                    className="input-sharp h-12"
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
                  className="input-sharp h-12"
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
                  className="input-sharp resize-none"
                />
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;