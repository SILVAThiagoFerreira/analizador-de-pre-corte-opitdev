import DxfParser from "dxf-parser";
import type { DxfModel, DxfPoint, DxfSegment, DxfText, Point2D } from "./types";

const layerColors: Record<string, string> = {
  "Real Hole": "#c73e2b",
  Hole: "#233d8f",
  "Theoretical Hole": "#1e36c9",
  Number: "#24323d",
  label: "#24323d",
  Length: "#7a3b1f"
};

function pointFromEntity(entity: any, prefix = ""): Point2D | null {
  const x = entity[`${prefix}x`] ?? entity[`${prefix}X`];
  const y = entity[`${prefix}y`] ?? entity[`${prefix}Y`];
  if (Number.isFinite(x) && Number.isFinite(y)) return { x, y };
  if (entity.position && Number.isFinite(entity.position.x) && Number.isFinite(entity.position.y)) {
    return { x: entity.position.x, y: entity.position.y };
  }
  if (entity.startPoint && prefix === "start") return entity.startPoint;
  if (entity.endPoint && prefix === "end") return entity.endPoint;
  if (entity.startPoint && !prefix) return entity.startPoint;
  return null;
}

function colorFor(layer = "") {
  return layerColors[layer] ?? "#6c7378";
}

function addBounds(points: Point2D[], bounds: DxfModel["bounds"]) {
  for (const point of points) {
    bounds.minX = Math.min(bounds.minX, point.x);
    bounds.minY = Math.min(bounds.minY, point.y);
    bounds.maxX = Math.max(bounds.maxX, point.x);
    bounds.maxY = Math.max(bounds.maxY, point.y);
  }
}

function circleToPolyline(entity: any): Point2D[] {
  const center = entity.center ?? entity.position;
  const radius = Number(entity.radius ?? 0);
  if (!center || !Number.isFinite(radius) || radius <= 0) return [];
  return Array.from({ length: 48 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 48;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
}

function arcToPolyline(entity: any): Point2D[] {
  const center = entity.center ?? entity.position;
  const radius = Number(entity.radius ?? 0);
  if (!center || !Number.isFinite(radius) || radius <= 0) return [];
  const start = Number(entity.startAngle ?? 0);
  const end = Number(entity.endAngle ?? Math.PI * 2);
  const steps = 32;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = start + ((end - start) * index) / steps;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
}

export function parseDxf(source: string, name = "arquivo.dxf"): DxfModel {
  const raw = new DxfParser().parseSync(source) as any;
  const model: DxfModel = {
    name,
    segments: [],
    texts: [],
    points: [],
    bounds: {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    },
    layers: {}
  };

  const entities = Array.isArray(raw?.entities) ? raw.entities : [];
  for (const entity of entities) {
    const layer = entity.layer ?? "0";
    model.layers[layer] = (model.layers[layer] ?? 0) + 1;
    const type = String(entity.type ?? "").toUpperCase();
    let segment: DxfSegment | null = null;

    if (type === "LINE") {
      const start = pointFromEntity(entity, "start") ?? entity.vertices?.[0];
      const end = pointFromEntity(entity, "end") ?? entity.vertices?.[1];
      if (start && end) segment = { layer, color: colorFor(layer), points: [start, end] };
    } else if (type === "LWPOLYLINE" || type === "POLYLINE") {
      const points = (entity.vertices ?? entity.points ?? [])
        .map((vertex: any) => ({ x: Number(vertex.x), y: Number(vertex.y) }))
        .filter((point: Point2D) => Number.isFinite(point.x) && Number.isFinite(point.y));
      if (points.length > 1) segment = { layer, color: colorFor(layer), points, closed: Boolean(entity.closed) };
    } else if (type === "CIRCLE") {
      const points = circleToPolyline(entity);
      if (points.length) segment = { layer, color: colorFor(layer), points, closed: true };
    } else if (type === "ARC") {
      const points = arcToPolyline(entity);
      if (points.length) segment = { layer, color: colorFor(layer), points };
    } else if (type === "TEXT" || type === "MTEXT") {
      const point = pointFromEntity(entity);
      const value = String(entity.text ?? entity.string ?? entity.value ?? "").trim();
      if (point && value) {
        model.texts.push({ layer, value, point });
        addBounds([point], model.bounds);
      }
    } else if (type === "POINT") {
      const point = pointFromEntity(entity);
      if (point) {
        const dxfPoint: DxfPoint = { layer, point };
        model.points.push(dxfPoint);
        addBounds([point], model.bounds);
      }
    }

    if (segment) {
      model.segments.push(segment);
      addBounds(segment.points, model.bounds);
    }
  }

  if (!Number.isFinite(model.bounds.minX)) {
    throw new Error("DXF sem geometrias renderizaveis.");
  }

  return model;
}

export function makeDefaultTreatments(model: DxfModel): string[] {
  const numbered = model.texts
    .map((item) => item.value.match(/\d+/)?.[0])
    .filter((value): value is string => Boolean(value));
  if (numbered.length) return Array.from(new Set(numbered)).slice(0, 12);
  return model.points.map((_, index) => String(index + 1)).slice(0, 12);
}
