import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import StyledArticleRenderer from "@/components/StyledArticleRenderer";
import ExplorationInquiryModal from "@/components/ExplorationInquiryModal";
import type { Exploration } from "@/components/ExplorationCard";
import RazorpayTestCheckout from "@/components/RazorpayTestCheckout";

const ExplorationDetails = ({ item, preview = false }: { item: Exploration; preview?: boolean }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  return <div className="min-w-0 space-y-8">
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="border border-border px-2 py-1">{item.status}</span>{item.tags?.map(tag => <span key={tag} className="px-2 py-1">#{tag}</span>)}</div>
    <section><h2 className="font-display text-2xl font-semibold mb-4">About this exploration</h2><p className="whitespace-pre-line text-muted-foreground leading-relaxed">{item.description}</p></section>
    {item.technical_content && <StyledArticleRenderer content={item.technical_content} />}
    {item.paid_parts && <section className="border-y border-border py-6 space-y-3">
      <h2 className="font-display text-2xl font-semibold">Part files</h2>
      <p className="text-muted-foreground flex items-center gap-2"><Lock size={16} /> Paid access only</p>
      {item.product_price_inr != null && <p className="font-medium">Complete bot: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.product_price_inr)}</p>}
      <p className="text-sm text-muted-foreground">Part files unlock after a ₹5 payment.</p>
      
      <RazorpayTestCheckout key={item.id} explorationId={item.id} preview={preview} />
    </section>}
    <section className="border-t border-border pt-6"><p className="text-sm text-muted-foreground mb-3">{item.contact_note || "Interested in this exploration?"}</p><Button disabled={preview} onClick={() => setInquiryOpen(true)}><Mail size={16} className="mr-2" /> Contact about this</Button></section>
    {!preview && <ExplorationInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} exploration={{ id: item.id, title: item.title }} />}
  </div>;
};
export default ExplorationDetails;