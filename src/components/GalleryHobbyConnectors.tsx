import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotchedProjectCover from "@/components/NotchedProjectCover";

interface HobbyMedia {
  name: string;
  src: string;
}

interface HobbyConnector {
  name: string;
  description: string;
  status: "ready" | "updating";
  media: HobbyMedia[];
}

const hobbyModules = import.meta.glob(
  "../assets/gallery/HOBBY Connectors/**/*.{mp4,webm,mov,jpg,jpeg,png,webp,gif}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const getMedia = (folder: string): HobbyMedia[] =>
  Object.entries(hobbyModules)
    .filter(([path]) => path.toLowerCase().includes(`/hobby connectors/${folder.toLowerCase()}/`))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([path, src]) => ({ name: decodeURIComponent(path.split("/").pop() ?? path), src }));

const hobbyConnectors: HobbyConnector[] = [
  {
    name: "New Product",
    description: "Techy connectors and product media in progress.",
    status: "ready",
    media: getMedia("ai module"),
  },
  {
    name: "RC Car",
    description: "Remote-control vehicle build and testing media.",
    status: "ready",
    media: getMedia("rc car"),
  },
  {
    name: "Raspberry Pi",
    description: "Hardware and experiments will be added here soon.",
    status: "updating",
    media: [],
  },
];

const isVideo = (name: string) => /\.(mp4|webm|mov)$/i.test(name);

const GalleryHobbyConnectors = () => {
  const [selected, setSelected] = useState<HobbyConnector | null>(null);
  const cards = useMemo(() => hobbyConnectors, []);

  return (
    <section className="gallery-hobby" aria-labelledby="hobby-connectors-title">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
        {!selected ? (
          <>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-primary text-xs font-medium uppercase tracking-widest sm:text-sm">
                Hobby Connectors
              </span>
              <h2 id="hobby-connectors-title" className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                New Builds &amp; Experiments
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Open a card to explore the latest product and hobby media.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              {cards.map((card) => {
                const cover = card.media[0];
                return (
                  <article
                    key={card.name}
                    className="group/project-card relative bg-background transition-all duration-300 select-none flex flex-col h-full min-w-0 break-words"
                  >
                    <NotchedProjectCover
                      onOpen={() => setSelected(card)}
                      badge={card.status === "updating" ? "We are updating" : "Ready"}
                      label={`Open ${card.name}`}
                    >
                      {cover && isVideo(cover.name) ? (
                        <video
                          src={cover.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover/project-card:scale-[1.03]"
                        />
                      ) : cover ? (
                        <img
                          src={cover.src}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover/project-card:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
                          <Sparkles size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </NotchedProjectCover>

                    <div className="p-6 flex flex-col flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-3 group-hover/project-card:text-primary transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{card.description}</p>
                      <div className="mb-3 text-xs md:text-sm text-muted-foreground">
                        {card.status === "ready" ? `${card.media.length} media files` : "Coming soon"}
                      </div>
                      <div className="mt-auto flex items-center">
                        <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelected(card)}>
                          Open <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="gallery-hobby-detail">
            <button type="button" className="gallery-hobby-back" onClick={() => setSelected(null)}>
              <ArrowLeft className="h-4 w-4" /> Back to hobby connectors
            </button>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-primary text-xs font-medium uppercase tracking-widest">Hobby Connector</span>
                <h2 className="font-display mt-2 text-3xl font-bold text-foreground">{selected.name}</h2>
                <p className="mt-2 text-muted-foreground">{selected.description}</p>
              </div>
              {selected.status === "ready" && <Play className="h-8 w-8 text-primary" aria-hidden="true" />}
            </div>
            {selected.status === "updating" ? (
              <div className="gallery-hobby-empty">We are updating this connector. Media will appear here soon.</div>
            ) : (
              <div className="gallery-hobby-grid">
                {selected.media.map((media) => (
                  <div key={media.src} className="gallery-hobby-tile">
                    {isVideo(media.name) ? (
                      <video src={media.src} controls playsInline preload="metadata" />
                    ) : (
                      <img src={media.src} alt={media.name} />
                    )}
                    <span>{media.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryHobbyConnectors;
