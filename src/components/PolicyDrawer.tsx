import { useState } from "react";
import { POLICY_CARDS } from "./ui/faq-drawer";

export const POLICY_UPDATED = "12 November 2026";

export default function PolicyDrawer({ onNavigate }: { onNavigate?: () => void }) {
  const [active, setActive] = useState(0);
  const card = POLICY_CARDS[active];

  return (
    <div className="space-y-5 min-w-0 pr-3">
      <header className="border-b-2 border-foreground pb-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Privacy · Terms</p>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground break-words">Privacy policy & terms of use</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last updated {POLICY_UPDATED}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)] min-w-0">
        <nav aria-label="Policy topics" role="tablist" className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 gap-1 md:border-r-2 md:border-border md:pr-3">
          {POLICY_CARDS.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 text-left px-3 py-2 text-sm border-2 transition-colors min-w-0 ${on ? "bg-foreground text-background border-foreground" : "border-border text-foreground hover:bg-secondary"}`}
              >
                <span className={`font-mono text-[10px] ${on ? "opacity-70" : "text-muted-foreground"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate font-medium">{c.tab}</span>
              </button>
            );
          })}
        </nav>

        <section role="tabpanel" className="min-w-0 border-2 border-border p-4 sm:p-5">
          <p className="font-mono text-[11px] text-muted-foreground mb-2">
            {String(active + 1).padStart(2, "0")} / {String(POLICY_CARDS.length).padStart(2, "0")} · {card.tab}
          </p>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3 break-words">{card.q}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground break-words">{card.a}</p>
          <div className="flex justify-between gap-2 mt-5">
            <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)} className="text-xs border-2 border-border px-3 py-1.5 disabled:opacity-40 hover:bg-secondary">← Previous</button>
            <button type="button" disabled={active === POLICY_CARDS.length - 1} onClick={() => setActive(active + 1)} className="text-xs border-2 border-border px-3 py-1.5 disabled:opacity-40 hover:bg-secondary">Next →</button>
          </div>
        </section>
      </div>

    </div>
  );
}
