export type TreatmentAction = "fill" | "suspend" | "cancel";
export type AnalysisType = "PRÉ-CORTE" | "FACE";

export interface TreatmentRow {
  id: string;
  action: TreatmentAction;
  fillMeters: number | "";
  material: string;
  suspendHeight: number | "";
  loadOnlyMeters: number | "";
  customStemmingMeters: number | "";
}

export interface ReportSettings {
  analysisType: AnalysisType;
  analysisId: string;
  title: string;
  includeOpenBlast: boolean;
  generatedBy: string;
  actionFillLabel: string;
  actionCancelLabel: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface DxfSegment {
  layer: string;
  color: string;
  points: Point2D[];
  closed?: boolean;
}

export interface DxfText {
  layer: string;
  value: string;
  point: Point2D;
}

export interface DxfPoint {
  layer: string;
  point: Point2D;
}

export interface DxfModel {
  name: string;
  segments: DxfSegment[];
  texts: DxfText[];
  points: DxfPoint[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  layers: Record<string, number>;
}
