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
  const corners = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY }
  ].map((point) => {
    const dx = point.x - centerX;
    const dy = point.y - displayCenterY;
    return {
      x: centerX + dx * Math.cos(angle) - dy * Math.sin(angle),
      y: displayCenterY + dx * Math.sin(angle) + dy * Math.cos(angle)
    };
  });
  const rotatedMinX = Math.min(...corners.map((point) => point.x));
  const rotatedMaxX = Math.max(...corners.map((point) => point.x));
  const rotatedMinY = Math.min(...corners.map((point) => point.y));
  const rotatedMaxY = Math.max(...corners.map((point) => point.y));
  const viewMinX = rotationDegrees ? rotatedMinX : minX;
  const viewMaxX = rotationDegrees ? rotatedMaxX : maxX;
  const viewMinY = rotationDegrees ? rotatedMinY : minY;
  const viewMaxY = rotationDegrees ? rotatedMaxY : maxY;
  const viewWidth = Math.max(viewMaxX - viewMinX, 1);
  const viewHeight = Math.max(viewMaxY - viewMinY, 1);
  const padX = viewWidth * (mode === "overview" ? 0.08 : 0.10);
  const padY = viewHeight * (mode === "overview" ? 0.12 : 0.12);
  const viewBox = `${viewMinX - padX} ${viewMinY - padY} ${viewWidth + padX * 2} ${viewHeight + padY * 2}`;

  return (
    <svg className={`dxf-svg dxf-svg--${mode}`} viewBox={viewBox} role="img" aria-label={`Visualizacao ${mode} do DXF`}>
      <defs>
        <pattern id={`grid-${mode}`} width={width / 12} height={height / 8} patternUnits="userSpaceOnUse">
          <path d={`M ${width / 12} 0 L 0 0 0 ${height / 8}`} fill="none" stroke="#e9edf0" strokeWidth={Math.max(width, height) * 0.0006} />
        </pattern>
      </defs>
      <rect x={viewMinX - padX} y={viewMinY - padY} width={viewWidth + padX * 2} height={viewHeight + padY * 2} fill={`url(#grid-${mode})`} />
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
          <circle key={`${item.layer}-pt-${index}`} cx={item.point.x} cy={item.point.y} r={Math.max(width, height) * 0.0035} fill={item.layer.includes("Real") ? "#c73e2b" : "#1e36c9"} />
        ))}
      </g>
      {showLabels &&
        model.texts.slice(0, labelLimit).map((text, index) => (
          <text
            key={`${text.value}-${index}`}
            x={text.point.x}
            y={minY + maxY - text.point.y}
            fontSize={Math.max(width, height) * 0.012}
            fill="#24323d"
            textAnchor="middle"
          >
            {text.value}
          </text>
        ))}
      </g>
    </svg>
  );
}
