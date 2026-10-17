import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import ExplorationInquiryModal from "./ExplorationInquiryModal";

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
  <article className="group relative bg-card border border-border flex flex-col h-full min-w-0 break-words transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_0_0_hsl(var(--foreground))]">
    {/* corner ticks */}
    <span aria-hidden className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-foreground z-10" />
    <span aria-hidden className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-foreground z-10" />
    <span aria-hidden className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-foreground z-10" />
    <span aria-hidden className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-foreground z-10" />

    {item.images && item.images.length > 0 && (
      <div className="relative border-b border-border">
        <div className="overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            loading={preview ? "eager" : "lazy"}
            className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <span className="absolute top-2 left-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-background/90 text-foreground border border-border">
          EXP-{String(item.sort_order + 1).padStart(2, "0")}
        </span>
        {item.images.length > 1 && (
          <div className="flex gap-1 p-1 overflow-x-auto bg-muted/40">
            {item.images.slice(1).map((url, index) => (
              <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="shrink-0" onClick={preview ? (event) => event.preventDefault() : undefined}>
                <img src={url} alt={`${item.title} — photo ${index + 2}`} loading={preview ? "eager" : "lazy"} className="w-16 h-12 object-cover border border-border hover:opacity-80 transition-opacity" />
              </a>
            ))}
          </div>
        )}
      </div>
    )}

    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 bg-foreground animate-pulse" aria-hidden />
        <span className="px-2 py-1 text-[11px] font-mono uppercase tracking-widest bg-muted text-muted-foreground max-w-full">{item.status}</span>
      </div>
      <h3 className="font-display text-base sm:text-lg font-semibold mb-2 group-hover:underline underline-offset-4 decoration-2">{item.title}</h3>
      <p className="text-sm text-muted-foreground flex-1 whitespace-pre-line">{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="text-[11px] font-mono px-2 py-1 border border-border text-muted-foreground max-w-full">#{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-dashed border-border">
        <p className="text-xs text-muted-foreground mb-3">{item.contact_note || "Interested in this work? Get in touch and let's talk about it."}</p>
        <Link to="/contact" tabIndex={preview ? -1 : undefined} onClick={preview ? (event) => event.preventDefault() : undefined} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all">
          <Mail size={14} /> Contact about this <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </article>
);

export default ExplorationCard;
