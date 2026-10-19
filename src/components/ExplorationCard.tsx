import { useState } from "react";
import { ArrowRight, Heart, Eye, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ImageLightbox from "./ImageLightbox";
import LoginPopupModal from "./LoginPopupModal";
import { useExplorationLike } from "@/hooks/useExplorationLike";

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
  technical_content?: string;
  product_price_inr?: number | null;
  paid_parts?: boolean;
}

const ExplorationCard = ({ item, preview = false }: { item: Exploration; preview?: boolean }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { count, liked, busy, toggle, user } = useExplorationLike(item.id, preview);
  const images = (item.images || []).map(src => ({ src, alt: item.title }));
  return <article className="group bg-card border border-border flex flex-col h-full min-w-0 break-words">
    <header className="p-5 min-h-24 flex items-center"><h3 className="font-display text-lg font-semibold">{item.title}</h3></header>
    <div className="relative border-y border-border overflow-hidden bg-muted">
      {images[0] ? <img src={images[0].src} alt={item.title} loading={preview ? "eager" : "lazy"} className="w-full aspect-[4/3] object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105" /> : <div className="aspect-[4/3] flex items-center justify-center"><Image size={32} className="text-muted-foreground" /></div>}
      <span className="absolute bottom-3 left-3 px-2 py-1 text-xs bg-background text-foreground border border-border">{images.length} photos</span>
    </div>
    <div className="flex flex-wrap items-center gap-1 p-3 mt-auto">
      <Button variant="ghost" size="sm" title={liked ? "Unlike" : "Like"} aria-label={liked ? `Unlike ${item.title}` : `Like ${item.title}`} aria-pressed={liked} disabled={preview || busy} onClick={() => { if (!user) setLoginOpen(true); else toggle(); }}><Heart size={16} className={liked ? "fill-current" : ""} /><span className="ml-2">{count}</span></Button>
      <Button variant="ghost" size="sm" disabled={preview || !images.length} onClick={() => setLightboxOpen(true)}><Eye size={16} className="mr-2" /> View</Button>
      <Button asChild variant="ghost" size="sm" className="ml-auto"><Link to={`/explorations/${item.id}`} tabIndex={preview ? -1 : undefined} onClick={preview ? e => e.preventDefault() : undefined}>Read more <ArrowRight size={16} className="ml-2" /></Link></Button>
    </div>
    {!preview && <><ImageLightbox images={images} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} /><LoginPopupModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} description="Sign in to like this exploration" /></>}
  </article>;
};
export default ExplorationCard;
