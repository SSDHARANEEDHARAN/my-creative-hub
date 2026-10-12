import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export interface Exploration {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[] | null;
  contact_note: string | null;
  is_visible: boolean;
  sort_order: number;
  images?: string[] | null;
}

const ExplorationCard = ({ item, preview = false }: { item: Exploration; preview?: boolean }) => (
  <article className="bg-card border border-border p-5 flex flex-col h-full min-w-0 break-words">
    {item.images && item.images.length > 0 && (
      <div className="-mx-5 -mt-5 mb-4">
        <img src={item.images[0]} alt={item.title} loading={preview ? "eager" : "lazy"} className="w-full aspect-video object-cover" />
        {item.images.length > 1 && (
          <div className="flex gap-1 p-1 overflow-x-auto">
            {item.images.slice(1).map((url, index) => (
              <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="shrink-0" onClick={preview ? (event) => event.preventDefault() : undefined}>
                <img src={url} alt={`${item.title} — photo ${index + 2}`} loading={preview ? "eager" : "lazy"} className="w-16 h-12 object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>
    )}
    <span className="self-start px-2 py-1 text-[11px] uppercase tracking-wide bg-muted text-muted-foreground mb-3 max-w-full">{item.status}</span>
    <h3 className="font-display text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
    <p className="text-sm text-muted-foreground flex-1 whitespace-pre-line">{item.description}</p>
    {item.tags && item.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {item.tags.map((tag, index) => <span key={`${tag}-${index}`} className="text-[11px] px-2 py-1 border border-border text-muted-foreground max-w-full">{tag}</span>)}
      </div>
    )}
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground mb-3">{item.contact_note || "Interested in this work? Get in touch and let's talk about it."}</p>
      <Link to="/contact" tabIndex={preview ? -1 : undefined} onClick={preview ? (event) => event.preventDefault() : undefined} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
        <Mail size={14} /> Contact about this <ArrowRight size={14} />
      </Link>
    </div>
  </article>
);

export default ExplorationCard;