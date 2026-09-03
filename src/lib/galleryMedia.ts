// Bundled gallery media (the files committed under src/assets/gallery) plus their
// titles/descriptions. Shared by the public Gallery page (fallback) and the admin
// "import into database" action.

const mediaModules = import.meta.glob(
  "../assets/gallery/*.{jpg,jpeg,png,webp,avif,gif,mp4,webm,mov,JPG,JPEG,PNG,WEBP,AVIF,GIF,MP4,WEBM,MOV}",
  { eager: true, import: "default", query: "?url" }
) as Record<string, string>;

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov"];

export const MEDIA_INFO: Record<string, { title: string; description?: string }> = {
  // Videos
  "1-nova": { title: "Personal AI – Assistance" },
  "2-nova": {
    title: "AI NOVA – Personal & Task Assistive",
    description: "Presented by Claw Talks — our upcoming project, waiting to launch.",
  },
  "3-car": {
    title: "Our Milestone – Load Carrying Car",
    description:
      "Developed initially as our milestone — the achievement that pushed me to build technology.",
  },
  "4-fanuc": { title: "FANUC Robot Cell" },
  "5-farino": { title: "FARINO Cobot Trainer Kit with ATC" },
  "6-humanoid-robot": {
    title: "Humanoid Robot – Expo CODISSIA",
    description: "Presented by Unitree.",
  },
  // Images
  "01.1": { title: "FANUC Robot Cell" },
  "01.2": { title: "FANUC Robot Cell" },
  "02.1": { title: "Sensor Trainer Kit" },
  "02.2": { title: "Sensor Trainer Kit" },
  "02.3": { title: "Sensor Trainer Kit" },
  "03.1": { title: "Multi-Directional Conveyor" },
  "03.2": { title: "Corrugated Packing Machine" },
  "04.1": { title: "FARINO Cobot Trainer Kit with ATC" },
  "04.2": { title: "FARINO Cobot Trainer Kit with ATC" },
  "04.3": { title: "FARINO Cobot Trainer Kit with ATC" },
  "04.4": { title: "FARINO Cobot Trainer Kit with ATC" },
  CAR: {
    title: "Load Carrying Car",
    description: "Our own design, fabrication and electrical powertrain.",
  },
};

const fileNameToTitle = (base: string) =>
  base
    .replace(/^\d+(\.\d+)*[-_.\s]+/, "")
    .replace(/[-_]+/g, " ")
    .trim();

export interface BundledMedia {
  src: string;
  base: string;
  ext: string;
  type: "image" | "video";
  title: string;
  description?: string;
}

export const BUNDLED_MEDIA: BundledMedia[] = (() => {
  const all = Object.entries(mediaModules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, src]) => {
      const ext = (path.split(".").pop() ?? "").toLowerCase();
      const isVideo = VIDEO_EXTENSIONS.includes(ext);
      const base = (path.split("/").pop() ?? path).replace(/\.[^.]+$/, "");
      return { src, ext, base, isVideo, info: MEDIA_INFO[base] };
    });

  const videos = all.filter((m) => m.isVideo);
  const images = all.filter((m) => !m.isVideo);

  return [
    ...videos.map((m) => ({
      src: m.src,
      base: m.base,
      ext: m.ext,
      type: "video" as const,
      title: m.info?.title ?? fileNameToTitle(m.base).toUpperCase() ?? "VIDEO",
      description: m.info?.description,
    })),
    ...images.map((m, i) => ({
      src: m.src,
      base: m.base,
      ext: m.ext,
      type: "image" as const,
      title: m.info?.title ?? String(i + 1).padStart(2, "0"),
      description: m.info?.description,
    })),
  ];
})();
