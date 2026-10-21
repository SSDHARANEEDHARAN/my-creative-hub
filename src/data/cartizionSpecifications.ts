export const cartizionSpecifications = {
  current: "1.2 A/Phase",
  holdingTorque: "4.2 kg-cm",
  detentTorque: "2.2 N.cm (Maximum)",
  leadWires: 4,
  shaftDiameter: "5 mm",
  stepAngle: "1.8°",
  hardware: [
    [2, "Nema 17 Stepper Motors"],
    [2, "M8 × 450 mm linear bearing rods — X axis"],
    [2, "M8 × 350 mm linear bearing rods — Y axis"],
    [2, "M3 × 80 mm linear rods — Z axis"],
    [1, "M8 × 480 mm threaded rod"],
    [8, "LM8UU linear bearings"],
    [1, "SG90 servo"],
    [2, "GT2 pulleys, 16 teeth"],
    [1, "2000 mm GT2 belt"],
    [4, "M8 nuts"],
  ] as const,
  electronics: [[1, "Arduino Nano"], [2, "A4988 stepper drivers"], [1, "12 V 2 A wall power adapter"], [1, "USB cable"]] as const,
  productPricesInr: { aluminium: 89000, printedServoZ: 12500, hybridZ: 29000 },
  designFilesPriceInr: 10000,
  configurationFilesPriceInr: 7000,
};

const s = cartizionSpecifications;
export const cartizionTechnicalContent = `## Product dimensions
Overall enclosure dimensions and working area are not yet specified.

- X-axis rods: M8 × 450 mm
- Y-axis rods: M8 × 350 mm
- Z-axis rods: M3 × 80 mm
- Threaded rod: M8 × 480 mm

## Stepper motor specifications
- Current: ${s.current}
- Holding torque: ${s.holdingTorque}
- Detent torque: ${s.detentTorque}
- Lead wires: ${s.leadWires}
- Shaft diameter: ${s.shaftDiameter}
- Step angle: ${s.stepAngle}

## Hardware BOM
${s.hardware.map(([quantity, part]) => `- ${quantity} × ${part}`).join("\n")}

## Electronics BOM
${s.electronics.map(([quantity, part]) => `- ${quantity} × ${part}`).join("\n")}

## Motion reference
[CoreXY — theory and motion principles](https://corexy.com/theory.html)
`;