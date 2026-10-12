import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ExplorationCard, { type Exploration } from "@/components/ExplorationCard";
export type { Exploration } from "@/components/ExplorationCard";

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
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="min-w-0 h-full"
            >
              <ExplorationCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorationSection;
