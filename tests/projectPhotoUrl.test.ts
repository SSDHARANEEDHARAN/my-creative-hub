import { describe, expect, it } from "bun:test";
import { resolveProjectPhotoUrl } from "../src/lib/projectPhotoUrl";

describe("resolveProjectPhotoUrl", () => {
  it("points Lovable-only media paths at the public host so other hosts like Vercel can load them", () => {
    expect(resolveProjectPhotoUrl("/__l5e/assets-v1/abc/video.mp4")).toBe(
      "https://story-and-more.lovable.app/__l5e/assets-v1/abc/video.mp4",
    );
  });
  it("leaves site files and external links unchanged", () => {
    expect(resolveProjectPhotoUrl("/models/new-page-robot.splinecode")).toBe("/models/new-page-robot.splinecode");
    expect(resolveProjectPhotoUrl("https://drive.google.com/x")).toBe("https://drive.google.com/x");
  });
});
