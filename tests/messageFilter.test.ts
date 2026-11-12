import { describe, expect, test } from "bun:test";
import { checkMessage } from "../src/lib/messageFilter";
describe("mind message filter", () => {
  test("allows a normal message", () => expect(checkMessage("Loved the CARTESIAN build, great work!")).toBeNull());
  test("blocks links", () => expect(checkMessage("visit http://spam.com now")).not.toBeNull());
  test("blocks suspicious words", () => expect(checkMessage("win free money casino today")).not.toBeNull());
  test("blocks too short", () => expect(checkMessage("hi")).not.toBeNull());
  test("blocks repeated characters", () => expect(checkMessage("helloooooooooo there")).not.toBeNull());
});
