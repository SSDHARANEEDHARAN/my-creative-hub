// Use the public asset host rather than relying on the current preview's origin.
// These URLs contain no Google Photos session, local file path or expiring token.
const PROJECT_PHOTO_ORIGIN = "https://story-and-more.lovable.app";

export const resolveProjectPhotoUrl = (src: string): string => {
  if (src.startsWith("/__l5e/assets-v1/")) {
    return `${PROJECT_PHOTO_ORIGIN}${src}`;
  }
  return src;
};