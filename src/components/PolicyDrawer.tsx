import { POLICY_CARDS } from "./ui/faq-drawer";

export const POLICY_UPDATED = "12 November 2026";

export default function PolicyDrawer(_props: { onNavigate?: () => void }) {
  const jump = (id: string) => document.getElementById(`policy-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="pr-3"><div className="min-w-0 border-2 border-foreground">
      <header className="grid grid-cols-[1fr_auto] border-b-2 border-foreground">
        <div className="p-4 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Document · SS-POL-001</p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground break-words">Privacy & Terms</h2>
        </div>
        <div className="border-l-2 border-foreground p-4 font-mono text-[10px] sm:text-xs text-muted-foreground flex flex-col justify-center">
          <span>REV</span>
          <span className="text-foreground">{POLICY_UPDATED}</span>
        </div>
      </header>

      <nav aria-label="Clauses" className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 border-b-2 border-border font-mono text-xs">
        {POLICY_CARDS.map((c, i) => (
          <button key={c.id} type="button" onClick={() => jump(c.id)} className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
            {String(i + 1).padStart(2, "0")} {c.tab}
          </button>
        ))}
      </nav>

      <ol className="divide-y-2 divide-border">
        {POLICY_CARDS.map((c, i) => (
          <li key={c.id} id={`policy-${c.id}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)] scroll-mt-2">
            <span className="border-r-2 border-border p-3 font-mono text-sm font-bold text-foreground">{String(i + 1).padStart(2, "0")}</span>
            <div className="p-3 sm:p-4 min-w-0">
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground break-words">{c.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground break-words">{c.a}</p>
            </div>
          </li>
        ))}
      </ol>
    </div></div>
  );
}
