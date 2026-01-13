import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number;
    title: string;
    description: string;
    price: string;
  };
  category: "IT Services" | "Engineering Services";
}

const budgetOptions = [
  "Under ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1,00,000",
  "Above ₹1,00,000",
  "Flexible / Let's Discuss",
];

const timelineOptions = [
  "ASAP (Within 1 week)",
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "2-3 months",
  "Flexible / No Rush",
];

const ServiceRequestModal = ({ isOpen, onClose, service, category }: ServiceRequestModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    timeline: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: `Service Request: ${service.title}`,
          message: formData.requirements || "No additional requirements specified.",
          serviceType: service.title,
          serviceCategory: category,
          budget: formData.budget,
          timeline: formData.timeline,
          requirements: formData.requirements,
        },
      });

      if (error) throw error;

      toast({
        title: "Request Submitted Successfully! 🎉",
        description: "Thank you for your interest. I'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", budget: "", timeline: "", requirements: "" });
      onClose();
    } catch (error: any) {
      console.error("Error sending request:", error);
      toast({
        title: "Error Sending Request",
        description: "Please try again or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-card border-2 border-border w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b-2 border-border p-4 sm:p-6 flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {category}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-1">
              {service.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-foreground">{service.price}</span>
              <span className="text-muted-foreground text-sm ml-1">starting</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border-2 border-border hover:bg-secondary hover:border-foreground transition-all shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Name <span className="text-foreground">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
                className="input-sharp h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Email <span className="text-foreground">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                className="input-sharp h-11"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Budget Range <span className="text-foreground">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {budgetOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: option })}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium transition-all border-2 text-left ${
                    formData.budget === option
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Timeline <span className="text-foreground">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timelineOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeline: option })}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium transition-all border-2 text-left ${
                    formData.timeline === option
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Requirements
            </label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Describe your project, goals, specific features needed, and any other relevant details..."
              rows={4}
              className="input-sharp resize-none"
            />
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting || !formData.budget || !formData.timeline}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Sending Request...
              </span>
            ) : (
              <>
                Submit Request <Send size={16} />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting, you agree to receive a response via email within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;
