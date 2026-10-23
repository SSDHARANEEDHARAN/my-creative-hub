import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassFolder from "@/components/ui/glass-folder-cards";
import { LORA_KEYCHAIN_ID, loraBuildSteps, loraDesignFiles, loraWiringChecklist } from "@/data/loraBuildGuide";
import { supabase } from "@/integrations/supabase/client";

export default function LoraBuildGuidePage() {
  const [photo, setPhoto] = useState<string>();
  useEffect(() => { let active = true; void supabase.from("explorations").select("images").eq("id", LORA_KEYCHAIN_ID).maybeSingle().then(({ data }) => { if (active) setPhoto(data?.images?.[0]); }); return () => { active = false; }; }, []);
  return <main className="container mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-16 min-h-screen">
    <Helmet><title>LoRa Smart Keychain Build Guide | Tharanee</title><meta name="description" content="LoRa Smart Keychain mechanical assembly, wiring checks and purchased program-file setup." /></Helmet>
    <div className="flex flex-wrap gap-3 mb-6"><Button asChild variant="outline"><Link to="/buyer/dashboard"><ArrowLeft size={16} className="mr-2" />My purchases</Link></Button><Button asChild variant="ghost"><Link to={`/explorations/${LORA_KEYCHAIN_ID}`}>Keychain details</Link></Button></div>
    <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">LoRa Smart Keychain Build Guide</h1>
    <p className="text-muted-foreground mb-6">Preliminary reference — seller review required. Your exact board’s approved wiring, power specifications and matching program instructions take precedence.</p>
    {photo && <img src={photo} alt="LoRa Smart Keychain enclosure and electronics" className="w-full max-h-80 object-contain bg-muted mb-8" />}
    <section className="border-y border-border py-6 mb-8 grid gap-6 sm:grid-cols-[18rem_1fr]"><GlassFolder label="Esp32-wifi.zip" locked files={loraDesignFiles.map(name => ({ name }))} /><div className="min-w-0 self-center"><h2 className="font-display text-xl font-semibold mb-3">Supplied design archive</h2><p className="text-muted-foreground leading-relaxed">14 files: SOLIDWORKS parts and assemblies, plus two STL enclosure files. Attached to the ₹6,999 keychain product purchase. File contents remain private until that purchase is confirmed.</p><p className="text-sm text-muted-foreground mt-3">No wiring diagram or program files are included in this archive.</p></div></section>
    <section className="mb-8"><h2 className="font-display text-xl font-semibold mb-4">Wiring checklist</h2><dl className="divide-y divide-border border-y border-border">{loraWiringChecklist.map(([name, text]) => <div key={name} className="grid gap-2 sm:grid-cols-[10rem_1fr] py-4"><dt className="font-medium">{name}</dt><dd className="text-muted-foreground">{text}</dd></div>)}</dl></section>
    <ol>{loraBuildSteps.map((step, index) => <li key={step.title} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-3 sm:gap-5 border-b border-border py-6"><span className="font-display text-2xl text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0"><h2 className="font-display text-xl font-semibold mb-3">{step.title}</h2><p className="text-muted-foreground leading-relaxed">{step.text}</p><p className="text-sm mt-4"><strong>Check:</strong> {step.check}</p></div></li>)}</ol>
  </main>;
}