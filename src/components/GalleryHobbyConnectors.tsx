import { useMemo, useState } from "react";
import { ArrowLeft, FolderOpen, Play, Sparkles } from "lucide-react";

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
            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
              {cards.map((card) => {
                const cover = card.media[0];
                return (
                  <button
                    key={card.name}
                    type="button"
                    onClick={() => setSelected(card)}
                    className="gallery-hobby-card group text-left"
                    aria-label={`Open ${card.name}`}
                  >
                    <div className="gallery-hobby-card__media">
                      {cover && isVideo(cover.name) ? (
                        <video src={cover.src} autoPlay muted loop playsInline preload="metadata" />
                      ) : cover ? (
                        <img src={cover.src} alt="" />
                      ) : (
                        <div className="gallery-hobby-card__placeholder"><Sparkles aria-hidden="true" /></div>
                      )}
                      <span className="gallery-hobby-card__scrim" />
                      <span className="gallery-hobby-card__label">{card.name}</span>
                      {card.status === "updating" && <span className="gallery-hobby-card__status">We are updating</span>}
                    </div>
                    <span className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      {card.status === "ready" ? `${card.media.length} media files` : "Coming soon"}
                    </span>
                  </button>
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
