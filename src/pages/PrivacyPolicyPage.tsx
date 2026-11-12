import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  Database,
  Files,
  Fingerprint,
  ReceiptText,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { POLICY_CARDS } from "@/components/ui/faq-drawer";
import { POLICY_UPDATED } from "@/components/PolicyDrawer";
import { cn } from "@/lib/utils";

const POLICY_ICONS: LucideIcon[] = [
  Database,
  Fingerprint,
  CreditCard,
  ReceiptText,
  Files,
  ShieldCheck,
  Scale,
];

const PrivacyPolicyPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePolicy = POLICY_CARDS[activeIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy & Terms | SS. Tharan</title>
        <meta
          name="description"
          content="Privacy, terms of use, payments, refunds, shipping, content ownership and visitor rights for SS. Tharan's portfolio and products."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-background">
        <Navigation />

        <div className="policy-liquid-background" aria-hidden="true">
          <div className="policy-liquid-orb policy-liquid-orb-one" />
          <div className="policy-liquid-orb policy-liquid-orb-two" />
          <div className="policy-liquid-orb policy-liquid-orb-three" />
          <div className="policy-liquid-grid" />
        </div>

        <main className="relative z-10 px-3 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
          <div className="container mx-auto max-w-6xl">
            <header className="mb-8 max-w-3xl sm:mb-12">
              <div className="mb-5 inline-flex items-center gap-2 border border-foreground/15 bg-background/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-foreground" />
                Legal · SS-POL-001
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                Privacy <span className="text-muted-foreground">&</span> Terms
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Clear answers about your data, purchases, files and rights—all in one place.
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                Last updated · {POLICY_UPDATED}
              </p>
            </header>

            <section
              className="policy-liquid-card grid grid-cols-[7rem_minmax(0,1fr)] border border-foreground/15 sm:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]"
              aria-label="Privacy and terms topics"
            >
              <aside className="relative z-10 border-r border-foreground/10 bg-background/25 p-2 backdrop-blur-2xl sm:p-3 lg:p-4">
                <p className="mb-3 hidden px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">
                  Browse topics
                </p>
                <div className="flex flex-col gap-1 lg:sticky lg:top-28" role="tablist" aria-label="Policy topics" aria-orientation="vertical">
                  {POLICY_CARDS.map((policy, index) => {
                    const Icon = POLICY_ICONS[index];
                    const selected = activeIndex === index;

                    return (
                      <button
                        key={policy.id}
                        id={`policy-tab-${policy.id}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`policy-panel-${policy.id}`}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "group relative flex min-w-0 flex-col items-start gap-2 border border-transparent px-2.5 py-3 text-left transition-all duration-300 sm:flex-row sm:items-center sm:gap-3 sm:px-3 lg:min-h-16",
                          selected
                            ? "border-foreground/10 bg-foreground text-background shadow-[var(--shadow-soft)]"
                            : "text-muted-foreground hover:border-foreground/10 hover:bg-background/55 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center border transition-colors",
                            selected ? "border-background/25 bg-background/10" : "border-foreground/10 bg-background/35",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className={cn("block font-mono text-[9px] tracking-wider", selected ? "text-background/60" : "text-muted-foreground")}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="block break-words text-xs font-semibold sm:text-sm">{policy.tab}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="relative z-10 flex min-h-[31rem] min-w-0 flex-col p-4 sm:min-h-[34rem] sm:p-8 lg:p-12">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.article
                    key={activePolicy.id}
                    id={`policy-panel-${activePolicy.id}`}
                    role="tabpanel"
                    aria-labelledby={`policy-tab-${activePolicy.id}`}
                    initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-1 flex-col"
                  >
                    <div className="mb-7 flex items-center gap-3 sm:mb-10">
                      <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(POLICY_CARDS.length).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-foreground/10" />
                      <span className="h-2 w-2 bg-foreground" aria-hidden="true" />
                    </div>

                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
                      {activePolicy.tab}
                    </p>
                    <h2 className="max-w-2xl font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-4xl">
                      {activePolicy.q}
                    </h2>
                    <p className="mt-6 max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-muted-foreground sm:mt-8 sm:text-base sm:leading-8">
                      {activePolicy.a}
                    </p>

                    <div className="mt-auto pt-10 sm:pt-14">
                      <div className="border-t border-foreground/10 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">
                        SS.DHARANEE DHARAN · Privacy & usage policy
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
