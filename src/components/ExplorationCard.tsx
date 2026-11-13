import { useState } from "react";
import { ArrowRight, Heart, Eye, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotchedProjectCover from "@/components/NotchedProjectCover";
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
  technical_document_url?: string | null;
  technical_document_name?: string | null;
  technical_documents?: { name: string; url: string }[] | null;
  drive_videos?: { name: string; url: string }[] | null;
}

export const explorationDocuments = (item: Exploration): { name: string; url: string }[] => {
  const docs = Array.isArray(item.technical_documents) ? item.technical_documents.filter((d) => d?.url) : [];
  if (docs.length) return docs;
  return item.technical_document_url ? [{ name: item.technical_document_name || "Product technical document", url: item.technical_document_url }] : [];
};

const ExplorationCard = ({ item, preview = false }: { item: Exploration; preview?: boolean }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { count, liked, busy, toggle, user } = useExplorationLike(item.id, preview);
  const images = (item.images || []).map((src) => ({ src, alt: item.title }));
  const href = `/explorations/${item.id}`;

  return (
    <article className="group/project-card relative bg-background transition-all duration-300 select-none flex flex-col h-full min-w-0 break-words">
      <NotchedProjectCover
        href={href}
        disabled={preview}
        badge={item.status || "In progress"}
        label={`Open ${item.title}`}
      >
        {images[0] ? (
          <img
            src={images[0].src}
            alt={item.title}
            loading={preview ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover/project-card:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
            <ImageIcon size={32} className="text-muted-foreground" />
          </div>
        )}
      </NotchedProjectCover>

      <div className="p-6 flex flex-col flex-1 min-w-0">
        <h3 className="text-xl font-bold mb-3 group-hover/project-card:text-primary transition-colors">{item.title}</h3>
        {item.description && <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>}

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-3 text-xs md:text-sm text-muted-foreground">{images.length} photos</div>

        <div className="flex flex-wrap items-center gap-1 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            title={liked ? "Unlike" : "Like"}
            aria-label={liked ? `Unlike ${item.title}` : `Like ${item.title}`}
            aria-pressed={liked}
            disabled={preview || busy}
            onClick={() => {
              if (!user) setLoginOpen(true);
              else toggle();
            }}
          >
            <Heart size={16} className={liked ? "fill-current" : ""} />
            <span className="ml-2">{count}</span>
          </Button>
          <Button variant="ghost" size="sm" disabled={preview || !images.length} onClick={() => setLightboxOpen(true)}>
            <Eye size={16} className="mr-2" /> View
          </Button>
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link to={href} tabIndex={preview ? -1 : undefined} onClick={preview ? (e) => e.preventDefault() : undefined}>
              Read more <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {!preview && (
        <>
          <ImageLightbox images={images} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
          <LoginPopupModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} description="Sign in to like this exploration" />
        </>
      )}
    </article>
  );
};
export default ExplorationCard;
