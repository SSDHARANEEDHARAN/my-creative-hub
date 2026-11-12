import { Link } from "react-router-dom";
import { Home, Mail, Shield } from "lucide-react";

export const POLICY_UPDATED = "12 November 2026";

const CARDS = [
  { tab: "Data", q: "What information do we collect?", a: "Account details (name, email) when you sign up; likes, comments, views and downloads; messages you send through Contact, New page and exploration inquiries; and IP addresses for security, visit analytics and abuse prevention." },
  { tab: "Use", q: "How is your data used?", a: "Only to run this portfolio: sign-in, notifications, newsletter emails to subscribers, purchase confirmations, download access and admin analytics. We never sell or rent your personal information." },
  { tab: "Payments", q: "How are purchases handled?", a: "Payments for CARTESIAN, LoRa Smart Keychain and their files are processed securely by Razorpay. We never store card or UPI details. A purchase is confirmed only after Razorpay verifies a captured payment, and files unlock only for the option you bought." },
  { tab: "Refunds", q: "Delivery, refunds and cancellations", a: "Digital files are delivered instantly after confirmation via short-lived download links in My purchases, so they are non-refundable once downloaded. For physical products, delivery timelines and refunds for damaged or failed items are agreed by email before dispatch." },
  { tab: "Content", q: "Who owns the content?", a: "All projects, blog posts, photos, videos, CAD, STL, firmware and documents remain the intellectual property of SS.DHARANEE DHARAN. Purchased files are licensed for personal use only — no resale, redistribution or commercial reproduction without written consent." },
  { tab: "Conduct", q: "What is not allowed?", a: "Unauthorised access, scraping, reverse engineering, spam or abusive messages, and sharing paid files. Suspicious messages are blocked automatically, and violations may lead to IP blocking and account removal." },
  { tab: "Industrial", q: "Industrial project access", a: "Industrial projects are shown only to signed-in, approved users. Associated disclaimers, including Janatics-related materials, must be respected; content is shared for portfolio reference only." },
  { tab: "Rights", q: "Your rights and cookies", a: "Only essential cookies and storage keep you signed in — no advertising trackers. You can request access, correction or deletion of your data anytime by email. Continued use after an update means you accept the revised terms." },
];

export default function PolicyDrawer({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <section aria-labelledby="policy-title" className="space-y-5">
      <header>
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">Privacy · Terms</p>
        <h2 id="policy-title" className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield size={20} /> Filed before you browse.
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Pull a card to read it. Last updated {POLICY_UPDATED}.</p>
      </header>

      <div className="border-2 border-border bg-secondary/60 p-2 sm:p-3 space-y-1.5">
        {CARDS.map((c, i) => (
          <details key={c.tab} name="policy-drawer" open={i === 0}
            className="group bg-background border border-border transition-all duration-300 open:-translate-y-0.5 open:shadow-md"
            style={{ marginInline: `${Math.min(i, 4) * 2}px` }}>
            <summary className="cursor-pointer list-none flex items-center gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-foreground text-background px-2 py-0.5 shrink-0"
                style={{ marginLeft: `${(i % 4) * 6}px` }}>{c.tab}</span>
              <span className="font-mono text-xs sm:text-sm text-foreground flex-1">{c.q}</span>
              <span className="font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-3 pb-3 pt-1 font-mono text-xs leading-6 text-muted-foreground border-t border-dashed border-border"
              style={{ backgroundImage: "repeating-linear-gradient(transparent 0 23px, hsl(var(--border)) 23px 24px)" }}>
              {c.a}
            </p>
          </details>
        ))}
        <div className="flex items-center justify-between pt-2 px-1">
          <span className="font-mono text-[10px] uppercase tracking-widest border border-border bg-background px-2 py-0.5 text-muted-foreground">SS · Policy A–Z</span>
          <span className="w-10 h-2 border-2 border-border bg-background" aria-hidden />
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t-2 border-border pt-4">
        <p className="text-xs text-muted-foreground">Not in the drawer? Write to us — a person answers.</p>
        <div className="flex gap-2">
          <Link to="/" onClick={onNavigate} className="inline-flex items-center justify-center gap-2 border-2 border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
            <Home size={14} /> Back to Home
          </Link>
          <a href="mailto:tharaneetharanss@gmail.com" className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
            <Mail size={14} /> tharaneetharanss@gmail.com
          </a>
        </div>
      </footer>
    </section>
  );
}
