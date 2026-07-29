import { describe, expect, it } from "vitest";
import { appConfig } from "../src/config";
import { createTreatmentRow, formatMeters } from "../src/treatments";

describe("treatment report settings", () => {
  it("offers PRÉ-CORTE and FACE as analysis types", () => {
    expect(appConfig.analysisTypes).toEqual(["PRÉ-CORTE", "FACE"]);
  });

  it("creates treatment rows with the two optional meter fields", () => {
    expect(createTreatmentRow()).toMatchObject({
      loadOnlyMeters: "",
      customStemmingMeters: ""
    });
  });

  it("formats populated treatment meter values with the m unit", () => {
    expect(formatMeters(2.5)).toBe("2.5 m");
    expect(formatMeters("")).toBe("");
  });
});
