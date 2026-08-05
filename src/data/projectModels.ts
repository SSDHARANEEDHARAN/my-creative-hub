import dispensingModel from "@/assets/compact-dispensing-module.glb.asset.json";

/**
 * 3D model files (GLB) available for Industrial projects only.
 * Key = project id.
 */
export const projectModels: Record<number, { url: string; filename: string }> = {
  128: {
    url: dispensingModel.url,
    filename: "LA9598_AA_Compact_dispensing_module.glb",
  },
};

export const getProjectModel = (id: number | string | undefined) =>
  id === undefined ? undefined : projectModels[Number(id)];

/** Warm the browser cache for a project's GLB + the viewer bundle (mobile-friendly). */
let viewerPrefetched = false;
const prefetchedUrls = new Set<string>();

export const preloadProjectModel = (id: number | string | undefined) => {
  const model = getProjectModel(id);
  if (!model) return;
  if (!viewerPrefetched) {
    viewerPrefetched = true;
    import("@/components/model3d/Model3DScene").catch(() => {
      viewerPrefetched = false;
    });
  }
  if (prefetchedUrls.has(model.url)) return;
  prefetchedUrls.add(model.url);
  const conn = (navigator as any).connection;
  if (conn?.saveData || /2g/.test(conn?.effectiveType || "")) return;
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "fetch";
  link.crossOrigin = "anonymous";
  link.href = model.url;
  document.head.appendChild(link);
};
