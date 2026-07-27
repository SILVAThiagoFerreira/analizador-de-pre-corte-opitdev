import type { DxfModel } from "./types";

interface Props {
  model: DxfModel | null;
  mode: "overview" | "detail";
  showLabels?: boolean;
}

export function DxfPreview({ model, mode, showLabels = false }: Props) {
  if (!model) {
    return <div className="preview-empty">Importe o DXF para visualizar a malha.</div>;
  }

  const { minX, minY, maxX, maxY } = model.bounds;
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const padX = width * (mode === "overview" ? 0.08 : 0.02);
  const padY = height * (mode === "overview" ? 0.12 : 0.04);
  const viewBox = `${minX - padX} ${minY - padY} ${width + padX * 2} ${height + padY * 2}`;
  const labelLimit = mode === "overview" ? 40 : 90;

  return (
    <svg className={`dxf-svg dxf-svg--${mode}`} viewBox={viewBox} role="img" aria-label={`Visualizacao ${mode} do DXF`}>
      <defs>
        <pattern id={`grid-${mode}`} width={width / 12} height={height / 8} patternUnits="userSpaceOnUse">
          <path d={`M ${width / 12} 0 L 0 0 0 ${height / 8}`} fill="none" stroke="#e9edf0" strokeWidth={Math.max(width, height) * 0.0006} />
        </pattern>
      </defs>
      <rect x={minX - padX} y={minY - padY} width={width + padX * 2} height={height + padY * 2} fill={`url(#grid-${mode})`} />
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
    </svg>
  );
}
