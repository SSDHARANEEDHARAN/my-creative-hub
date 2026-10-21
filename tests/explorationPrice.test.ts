import { expect, test } from "bun:test";
import { parseExplorationPrice } from "../src/lib/explorationPrice";

test("CARTIZION aluminium purchase price is INR 89000", () => expect(parseExplorationPrice("89000")).toBe(89000));
test("admin can revise the purchase price", () => expect(parseExplorationPrice("60000")).toBe(60000));
test("admin can clear the listed price", () => expect(parseExplorationPrice("")).toBeNull());
test("invalid prices cannot be saved", () => expect(() => parseExplorationPrice("-1")).toThrow());