import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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

const ExplorationSection = () => {
  const [items, setItems] = useState<Exploration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("explorations")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (!active) return;
      setItems((data as unknown as Exploration[]) || []);
      setLoading(false);
    };
    load();
    const channel = supabase
      .channel("public-explorations")
      .on("postgres_changes", { event: "*", schema: "public", table: "explorations" }, () => load())
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Compass className="w-5 h-5 text-foreground" />
          <h2 className="font-display text-xl sm:text-2xl font-semibold">New Exploration</h2>
          <span className="text-xs text-muted-foreground">What I'm working on right now</span>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="bg-card border border-border p-5 flex flex-col h-full"
            >
              {item.images && item.images.length > 0 && (
                <div className="-mx-5 -mt-5 mb-4">
                  <img src={item.images[0]} alt={item.title} loading="lazy" className="w-full aspect-video object-cover" />
                  {item.images.length > 1 && (
                    <div className="flex gap-1 p-1 overflow-x-auto">
                      {item.images.slice(1).map((u) => (
                        <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" loading="lazy" className="w-16 h-12 object-cover flex-shrink-0" /></a>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <span className="self-start px-2 py-1 text-[11px] uppercase tracking-wide bg-muted text-muted-foreground mb-3">
                {item.status}
              </span>
              <h3 className="font-display text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground flex-1 whitespace-pre-line">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-1 border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  {item.contact_note || "Interested in this work? Get in touch and let's talk about it."}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
                >
                  <Mail size={14} /> Contact about this <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorationSection;
