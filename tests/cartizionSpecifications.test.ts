import { describe, expect, test } from "bun:test";
import { cartizionSpecifications as s } from "../src/data/cartizionSpecifications";

describe("Supplied CARTIZION specifications", () => {
  test("current", () => expect(s.current).toBe("1.2 A/Phase"));
  test("holding torque", () => expect(s.holdingTorque).toBe("4.2 kg-cm"));
  test("maximum detent torque", () => expect(s.detentTorque).toBe("2.2 N.cm (Maximum)"));
  test("lead wires", () => expect(s.leadWires).toBe(4));
  test("shaft diameter", () => expect(s.shaftDiameter).toBe("5 mm"));
  test("step angle", () => expect(s.stepAngle).toBe("1.8°"));
  test("aluminium XYZ costs ₹89,000", () => expect(s.productPricesInr.aluminium).toBe(89000));
  test("3D printed with servo Z costs ₹12,500", () => expect(s.productPricesInr.printedServoZ).toBe(12500));
  test("hybrid Z-axis type costs ₹29,000", () => expect(s.productPricesInr.hybridZ).toBe(29000));
  test("design files cost ₹10,000", () => expect(s.designFilesPriceInr).toBe(10000));
  test("configuration files cost ₹7,000", () => expect(s.configurationFilesPriceInr).toBe(7000));
  for (const [quantity, part] of [[2, "Nema 17 Stepper Motors"], [2, "M8 × 450 mm linear bearing rods — X axis"], [2, "M8 × 350 mm linear bearing rods — Y axis"], [2, "M3 × 80 mm linear rods — Z axis"], [1, "M8 × 480 mm threaded rod"], [8, "LM8UU linear bearings"], [1, "SG90 servo"], [2, "GT2 pulleys, 16 teeth"], [1, "2000 mm GT2 belt"], [4, "M8 nuts"]] as const) {
    test(part, () => expect(s.hardware.find(row => row[1] === part)?.[0]).toBe(quantity));
  }
  test("Arduino Nano", () => expect(s.electronics[0]).toEqual([1, "Arduino Nano"]));
  test("two A4988 drivers", () => expect(s.electronics[1]).toEqual([2, "A4988 stepper drivers"]));
  test("12 V 2 A adapter", () => expect(s.electronics[2]).toEqual([1, "12 V 2 A wall power adapter"]));
  test("USB cable", () => expect(s.electronics[3]).toEqual([1, "USB cable"]));
});