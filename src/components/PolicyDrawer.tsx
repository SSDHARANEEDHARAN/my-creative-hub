import { Link } from "react-router-dom";
import { Home, Mail } from "lucide-react";
import FaqDrawer from "./ui/faq-drawer";

export const POLICY_UPDATED = "12 November 2026";

export default function PolicyDrawer({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-4">
      <FaqDrawer
        label="Privacy · Terms"
        title="Filed before you browse."
        lead={`Privacy policy and terms of use for this portfolio, filed where you can find them. Pull a card to read it. Last updated ${POLICY_UPDATED}.`}
        drawer="SS · Policy A–Z"
        count={7}
        open="1"
        single
        askNote="Not in the drawer? Write to tharaneetharanss@gmail.com and a person answers."
        askLabel="Email us"
        askHref="mailto:tharaneetharanss@gmail.com"
      />
      <div className="flex flex-col sm:flex-row gap-2 justify-center border-t-2 border-border pt-4">
        <Link to="/" onClick={onNavigate} className="inline-flex items-center justify-center gap-2 border-2 border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
          <Home size={16} /> Back to Home
        </Link>
        <a href="mailto:tharaneetharanss@gmail.com" className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          <Mail size={16} /> tharaneetharanss@gmail.com
        </a>
      </div>
    </div>
  );
}
