import type { DxfModel } from "./types";

interface Props {
  model: DxfModel | null;
  mode: "overview" | "detail";
  showLabels?: boolean;
  rotationDegrees?: number;
}

export function DxfPreview({ model, mode, showLabels = false, rotationDegrees = 0 }: Props) {
  if (!model) {
    return <div className="preview-empty">Importe o DXF para visualizar a malha.</div>;
  }

  const { minX, minY, maxX, maxY } = model.bounds;
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const labelLimit = mode === "overview" ? 40 : 90;
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  const displayCenterY = minY + maxY - centerY;
  const viewRotation = rotationDegrees ? `rotate(${rotationDegrees} ${centerX} ${displayCenterY})` : undefined;
  const angle = (rotationDegrees * Math.PI) / 180;
  // Limites reais do desenho (em coordenadas de exibição, já espelhadas em Y),
  // girados em torno do centro quando há rotação.
  const rotatePoint = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - displayCenterY;
    return { x: centerX + dx * Math.cos(angle) - dy * Math.sin(angle), y: displayCenterY + dx * Math.sin(angle) + dy * Math.cos(angle) };
  };
  const drawnPoints = [
    ...model.segments.flatMap((segment) => segment.points),
    ...model.points.map((item) => item.point)
  ].map((point) => rotatePoint(point.x, minY + maxY - point.y));
  const pointsX = drawnPoints.length ? drawnPoints.map((point) => point.x) : [minX, maxX];
  const pointsY = drawnPoints.length ? drawnPoints.map((point) => point.y) : [minY, maxY];
  const viewMinX = Math.min(...pointsX);
  const viewMaxX = Math.max(...pointsX);
  const viewMinY = Math.min(...pointsY);
  const viewMaxY = Math.max(...pointsY);
  const viewWidth = Math.max(viewMaxX - viewMinX, 1);
  const viewHeight = Math.max(viewMaxY - viewMinY, 1);
  // Margem pequena: o desenho ocupa a moldura inteira, sem vazios em volta.
  const padX = viewWidth * 0.03;
  const padY = viewHeight * 0.03;
  const viewBox = `${viewMinX - padX} ${viewMinY - padY} ${viewWidth + padX * 2} ${viewHeight + padY * 2}`;

  return (
    <svg className={`dxf-svg dxf-svg--${mode}`} viewBox={viewBox} role="img" aria-label={`Visualizacao ${mode} do DXF`}>
      <g transform={viewRotation}>
      <g transform={`translate(0 ${minY + maxY}) scale(1 -1)`}>
        {model.segments.map((segment, index) => (
          <polyline
            key={`${segment.layer}-${index}`}
            points={segment.points.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="none"
            stroke={segment.color}
            strokeWidth={Math.max(width, height) * (segment.layer.includes("Real") ? 0.0018 : 0.0012)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={segment.layer.includes("Length") ? 0.45 : 0.9}
          />
        ))}
        {model.points.map((item, index) => (
          <circle key={`${item.layer}-pt-${index}`} cx={item.point.x} cy={item.point.y} r={Math.max(width, height) * 0.0035} fill={item.layer.includes("Real") ? "#b5121b" : "#3d4148"} />
        ))}
      </g>
      {showLabels &&
        model.texts.slice(0, labelLimit).map((text, index) => (
          <text
            key={`${text.value}-${index}`}
            x={text.point.x}
            y={minY + maxY - text.point.y}
            fontSize={Math.max(width, height) * 0.012}
            fill="#3d4148"
            textAnchor="middle"
          >
            {text.value}
          </text>
        ))}
      </g>
    </svg>
  );
}
