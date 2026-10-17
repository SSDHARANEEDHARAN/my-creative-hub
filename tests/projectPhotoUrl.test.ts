import { describe, expect, test } from "bun:test";
import { resolveProjectPhotoUrl } from "../src/lib/projectPhotoUrl";

describe("industrial project photo portability", () => {
  test("uses a public host independent of the computer or preview origin", () => {
    expect(resolveProjectPhotoUrl("/__l5e/assets-v1/photo-id/axis-mms-photo-02.jpg"))
      .toBe("https://story-and-more.lovable.app/__l5e/assets-v1/photo-id/axis-mms-photo-02.jpg");
  });

  test("preserves distinct photos and their order", () => {
    const photos = ["/__l5e/assets-v1/one/amr-cobot-photo-001.jpg", "/__l5e/assets-v1/two/amr-cobot-photo-002.jpg"];
    expect(photos.map(resolveProjectPhotoUrl)).toEqual([
      "https://story-and-more.lovable.app/__l5e/assets-v1/one/amr-cobot-photo-001.jpg",
      "https://story-and-more.lovable.app/__l5e/assets-v1/two/amr-cobot-photo-002.jpg",
    ]);
  });

  test("leaves other media and intentionally cleared fields unchanged", () => {
    for (const src of ["", "/assets/cobot-trainer-2.jpg", "https://example.com/photo.jpg"]) {
      expect(resolveProjectPhotoUrl(src)).toBe(src);
    }
  });
});