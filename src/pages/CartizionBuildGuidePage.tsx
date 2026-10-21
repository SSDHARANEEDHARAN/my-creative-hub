import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cartizionBuildSteps } from "@/data/cartizionBuildGuide";
import { cartizionSpecifications } from "@/data/cartizionSpecifications";
import { CARTIZION_ID } from "@/lib/buyerPurchases";
import { supabase } from "@/integrations/supabase/client";

export default function CartizionBuildGuidePage() {
  const [photo, setPhoto] = useState<string>();
  useEffect(() => {
    let active = true;
    void supabase.from("explorations").select("images").eq("id", CARTIZION_ID).maybeSingle().then(({ data }) => { if (active) setPhoto(data?.images?.[0]); });
    return () => { active = false; };
  }, []);
  return <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16 min-h-screen max-w-5xl">
    <Helmet><title>CARTIZION Build Guide | Tharanee</title><meta name="description" content="CARTIZION assembly sequence, component checklist and first-motion checks." /></Helmet>
    <div className="flex flex-wrap gap-3 mb-6">
      <Button asChild variant="outline"><Link to="/buyer/dashboard"><ArrowLeft size={16} className="mr-2" />My purchases</Link></Button>
      <Button asChild variant="ghost"><Link to={`/explorations/${CARTIZION_ID}`}>CARTIZION details</Link></Button>
    </div>
    <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">CARTIZION Build Guide</h1>
    <p className="text-muted-foreground mb-6">Preliminary assembly sequence — seller review required. Your purchased variant’s approved drawings, wiring and configuration take precedence.</p>
    {photo && <img src={photo} alt="CARTIZION assembled carriage and frame" className="w-full max-h-80 object-contain bg-muted mb-8" />}
    <section className="border-y border-border py-6 mb-8">
      <h2 className="font-display text-xl font-semibold mb-3">Component checklist</h2>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm">{[...cartizionSpecifications.hardware, ...cartizionSpecifications.electronics].map(([quantity, part]) => <li key={part}>{quantity} × {part}</li>)}</ul>
      <p className="text-sm text-muted-foreground mt-4">This is the supplied reference BOM, not a guarantee of what every purchase includes.</p>
    </section>
    <ol className="space-y-0">{cartizionBuildSteps.map((step, index) => <li key={step.title} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-3 sm:gap-5 border-b border-border py-6">
      <span className="font-display text-2xl text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0"><h2 className="font-display text-xl font-semibold mb-3">{step.title}</h2><p className="text-muted-foreground leading-relaxed">{step.text}</p><p className="text-sm mt-4"><strong>Check:</strong> {step.check}</p></div>
    </li>)}</ol>
    <Button asChild variant="outline" className="mt-8 h-auto whitespace-normal"><a href="https://corexy.com/theory.html" target="_blank" rel="noopener noreferrer"><BookOpen size={16} className="mr-2 shrink-0" />CoreXY motion reference</a></Button>
  </main>;
}