import { expect, test } from "bun:test";
import { parseExplorationPrice } from "../src/lib/explorationPrice";

test("CARTIZION purchase price is INR 59000", () => expect(parseExplorationPrice("59000")).toBe(59000));
test("admin can revise the purchase price", () => expect(parseExplorationPrice("60000")).toBe(60000));
test("admin can clear the listed price", () => expect(parseExplorationPrice("")).toBeNull());
test("invalid prices cannot be saved", () => expect(() => parseExplorationPrice("-1")).toThrow());