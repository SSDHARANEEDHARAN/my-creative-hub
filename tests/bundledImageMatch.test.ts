import { expect, test } from "bun:test";
import { matchBundledImage } from "../src/lib/bundledImageMatch";

test("MMS cover with underscore hash resolves to original", () => {
  expect(matchBundledImage("/assets/mms-1-LgzJB_q6.jpg", ["/src/assets/projects/mms-1.jpg", "/src/assets/projects/mms-10.jpg"])).toBe("/src/assets/projects/mms-1.jpg");
});
test("conveyor cover with underscore hash resolves to original", () => {
  expect(matchBundledImage("/assets/cobot-conveyor-1-Cjt8pE_w.jpg", ["/src/assets/projects/cobot-conveyor-1.jpg"])).toBe("/src/assets/projects/cobot-conveyor-1.jpg");
});
test("hyphenated Vite hashes preserve the specific gallery photo", () => {
  const originals = ["/src/assets/projects/cobot-conveyor-1.jpg", "/src/assets/projects/cobot-conveyor-10.jpg", "/src/assets/projects/cobot-conveyor-22.jpg"];
  expect(matchBundledImage("/assets/cobot-conveyor-10-C-e-H5Qd.jpg", originals)).toBe(originals[1]);
  expect(matchBundledImage("/assets/cobot-conveyor-22-B-0PO-6d.jpg", originals)).toBe(originals[2]);
});
test("custom and intentionally empty images do not get substituted", () => {
  expect(matchBundledImage("", ["/src/assets/projects/mms-1.jpg"])).toBeUndefined();
  expect(matchBundledImage("https://example.com/mms-1-LgzJB_q6.jpg", ["/src/assets/projects/mms-1.jpg"])).toBeUndefined();
});