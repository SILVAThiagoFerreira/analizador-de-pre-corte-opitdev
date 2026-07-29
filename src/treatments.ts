import type { TreatmentRow } from "./types";

export function createTreatmentRow(): TreatmentRow {
  return {
    id: "",
    action: "fill",
    fillMeters: "",
    material: "",
    suspendHeight: "",
    loadOnlyMeters: "",
    customStemmingMeters: ""
  };
}

export function formatMeters(value: number | ""): string {
  return value === "" ? "" : `${value} m`;
}
