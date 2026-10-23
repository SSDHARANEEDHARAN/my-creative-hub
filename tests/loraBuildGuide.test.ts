import { expect, test } from "bun:test";
import { loraDesignFiles } from "../src/data/loraBuildGuide";

test("supplied keychain archive inventories 14 CAD files and no firmware", () => {
  expect(loraDesignFiles.length).toBe(14);
  expect(loraDesignFiles.filter(name => name.endsWith(".STL"))).toEqual(["BACK CASE.STL", "BASE TOP PLATE.STL"]);
  expect(loraDesignFiles.some(name => /\.(ino|bin|cpp|h)$/i.test(name))).toBe(false);
});