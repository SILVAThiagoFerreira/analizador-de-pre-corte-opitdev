import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parseDxf } from "../src/dxf";

describe("parseDxf", () => {
  it("extracts renderable geometry, layers and bounds from PC.dxf", () => {
    const dxf = readFileSync("public/examples/PC.dxf", "utf8");
    const model = parseDxf(dxf, "inline.dxf");
    expect(model.segments.length).toBeGreaterThanOrEqual(60);
    expect(model.points).toHaveLength(48);
    expect(model.texts.some((item) => item.value === "26")).toBe(true);
    expect(model.layers.Hole).toBe(48);
    expect(model.layers["Real Hole"]).toBe(20);
    expect(model.bounds.maxX).toBeGreaterThan(model.bounds.minX);
    expect(model.bounds.maxY).toBeGreaterThan(model.bounds.minY);
  });
});
