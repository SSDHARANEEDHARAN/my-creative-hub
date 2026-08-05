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
