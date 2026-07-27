import { Download, FileImage, FileText, FolderOpen, Plus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { appConfig } from "./config";
import { DxfPreview } from "./DxfPreview";
import { makeDefaultTreatments, parseDxf } from "./dxf";
import { exportElementAsPdf, exportElementAsPng } from "./reportExport";
import type { DxfModel, ReportSettings, TreatmentRow } from "./types";
import "./styles.css";

const initialSettings: ReportSettings = {
  precutId: "380726",
  title: "Relatório de Tratativas para Furos Perfilados",
  includeOpenBlast: true,
  generatedBy: "Setor Técnico de Operações",
  actionFillLabel: "ATERRAR / SUSPENDER",
  actionCancelLabel: "CANCELAR"
};

const initialRows: TreatmentRow[] = [
  { id: "26", action: "fill", fillMeters: 2, material: "", suspendHeight: "" },
  { id: "99", action: "fill", fillMeters: 3, material: "", suspendHeight: "" },
  { id: "103", action: "cancel", fillMeters: "", material: "", suspendHeight: "" }
];

function fileStem(value: string) {
  return value.trim().replace(/[^\w.-]+/g, "-").replace(/-+/g, "-") || "pre-corte";
}

function rowActionLabel(row: TreatmentRow) {
  if (row.action === "cancel") return "CANCELAR";
  if (row.action === "suspend") return row.suspendHeight ? `${row.suspendHeight}m` : "";
  return row.fillMeters ? `${row.fillMeters}m` : "";
}

export default function App() {
  const [settings, setSettings] = useState<ReportSettings>(initialSettings);
  const [rows, setRows] = useState<TreatmentRow[]>(initialRows);
  const [model, setModel] = useState<DxfModel | null>(null);
  const [status, setStatus] = useState("Carregando DXF de referencia...");
  const [busy, setBusy] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const shellRef = useRef<HTMLElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(appConfig.defaultDxfUrl)
      .then((response) => {
        if (!response.ok) throw new Error("DXF padrao indisponivel.");
        return response.text();
      })
      .then((text) => {
        const parsed = parseDxf(text, "PC.dxf");
        setModel(parsed);
        const ids = makeDefaultTreatments(parsed);
        setRows((current) => current.map((row, index) => ({ ...row, id: row.id || ids[index] || "" })));
        setStatus(`DXF PC.dxf carregado: ${parsed.segments.length} linhas, ${parsed.points.length} pontos, ${Object.keys(parsed.layers).length} camadas.`);
      })
      .catch((error: Error) => setStatus(error.message));
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const shellWidth = shellRef.current?.clientWidth ?? appConfig.report.widthPx;
      const available = Math.max(shellWidth - 32, 320);
      setPreviewScale(Math.min(1, available / appConfig.report.widthPx));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const stats = useMemo(() => {
    const fill = rows.filter((row) => row.action === "fill").length;
    const suspend = rows.filter((row) => row.action === "suspend").length;
    const cancel = rows.filter((row) => row.action === "cancel").length;
    return { fill, suspend, cancel, total: rows.length };
  }, [rows]);

  function updateRow(index: number, patch: Partial<TreatmentRow>) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
  }

  async function handleDxf(file: File) {
    const text = await file.text();
    const parsed = parseDxf(text, file.name);
    setModel(parsed);
    const ids = makeDefaultTreatments(parsed);
    setRows((current) => current.map((row, index) => ({ ...row, id: row.id || ids[index] || "" })));
    setStatus(`${file.name} importado: ${parsed.segments.length} linhas, ${parsed.points.length} pontos, ${Object.keys(parsed.layers).length} camadas.`);
  }

  async function exportReport(kind: "png" | "pdf") {
    if (!reportRef.current) return;
    setBusy(true);
    const name = `lamina-pre-corte-${fileStem(settings.precutId)}`;
    const previousTransform = reportRef.current.style.transform;
    reportRef.current.style.transform = "none";
    try {
      if (kind === "png") await exportElementAsPng(reportRef.current, `${name}.png`);
      else await exportElementAsPdf(reportRef.current, `${name}.pdf`);
    } finally {
      reportRef.current.style.transform = previousTransform;
      setBusy(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <img src={appConfig.logoWhite} alt="Enaex Brasil" />
        <div>
          <strong>{appConfig.appName}</strong>
          <span>US Vale Verde</span>
        </div>
      </header>

      <main className="workspace">
        <section className="control-panel" aria-label="Painel de configuracao">
          <div className="panel-title">
            <div>
              <span className="kicker">OPITDEV</span>
              <h1>Gerador de lâmina de pré-corte</h1>
            </div>
            <span className="status-dot">Online</span>
          </div>

          <label className="dropzone">
            <UploadCloud size={22} />
            <span>Importar DXF</span>
            <small>Use PC.dxf ou outro arquivo de perfilação</small>
            <input type="file" accept=".dxf" onChange={(event) => event.target.files?.[0] && handleDxf(event.target.files[0])} />
          </label>

          <div className="status-line">{status}</div>

          <div className="form-grid">
            <label>
              Pré-corte
              <input value={settings.precutId} onChange={(event) => setSettings({ ...settings, precutId: event.target.value })} />
            </label>
            <label>
              Título
              <input value={settings.title} onChange={(event) => setSettings({ ...settings, title: event.target.value })} />
            </label>
            <label>
              Responsável
              <input value={settings.generatedBy} onChange={(event) => setSettings({ ...settings, generatedBy: event.target.value })} />
            </label>
          </div>

          <div className="summary-strip">
            <span><b>{stats.total}</b> furos</span>
            <span><b>{stats.fill + stats.suspend}</b> aterrar/suspender</span>
            <span><b>{stats.cancel}</b> cancelar</span>
          </div>

          <div className="table-editor">
            <div className="table-editor__head">
              <h2>Tratativas</h2>
              <button type="button" onClick={() => setRows([...rows, { id: "", action: "fill", fillMeters: "", material: "", suspendHeight: "" }])}>
                <Plus size={16} /> Adicionar
              </button>
            </div>
            {rows.map((row, index) => (
              <div className="row-editor" key={index}>
                <input aria-label="ID" value={row.id} onChange={(event) => updateRow(index, { id: event.target.value })} />
                <select value={row.action} onChange={(event) => updateRow(index, { action: event.target.value as TreatmentRow["action"] })}>
                  <option value="fill">Aterrar</option>
                  <option value="suspend">Suspender</option>
                  <option value="cancel">Cancelar</option>
                </select>
                <input aria-label="Preencher metros" type="number" min="0" step="0.1" value={row.fillMeters} onChange={(event) => updateRow(index, { fillMeters: event.target.value === "" ? "" : Number(event.target.value) })} />
                <input aria-label="Material" value={row.material} onChange={(event) => updateRow(index, { material: event.target.value })} />
                <input aria-label="Altura" type="number" min="0" step="0.1" value={row.suspendHeight} onChange={(event) => updateRow(index, { suspendHeight: event.target.value === "" ? "" : Number(event.target.value) })} />
                <button type="button" className="icon-button" aria-label="Remover" onClick={() => setRows(rows.filter((_, rowIndex) => rowIndex !== index))}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="actions">
            <button type="button" onClick={() => exportReport("png")} disabled={busy}>
              <FileImage size={17} /> Baixar imagem
            </button>
            <button type="button" className="primary" onClick={() => exportReport("pdf")} disabled={busy}>
              <FileText size={17} /> Baixar PDF
            </button>
          </div>
        </section>

        <section className="report-shell" aria-label="Previa da lamina" ref={shellRef}>
          <div className="report-toolbar">
            <span><FolderOpen size={16} /> {model?.name ?? "Nenhum DXF"}</span>
            <button type="button" onClick={() => exportReport("pdf")} disabled={busy}>
              <Download size={16} /> Exportar
            </button>
          </div>

          <div className="report-stage" style={{ height: appConfig.report.heightPx * previewScale }}>
          <div className="report-page" ref={reportRef} style={{ transform: `scale(${previewScale})` }}>
            <div className="report-head">
              <div>
                <h2>{settings.title}</h2>
                <p>PRE-CORTE: {settings.precutId}</p>
              </div>
              <img src={appConfig.logoReport} alt="Enaex Stronger Bonds" />
            </div>

            <div className="legend">
              <span><i className="legend-fill" /> {settings.actionFillLabel}</span>
              <span><i className="legend-cancel" /> {settings.actionCancelLabel}</span>
            </div>

            <div className="report-grid">
              <div className="illustrations">
                <strong>ILUSTRACAO 1:</strong>
                <div className="illustration illustration--small"><DxfPreview model={model} mode="overview" /></div>
                <strong>ILUSTRACAO 2:</strong>
                <div className="illustration illustration--large"><DxfPreview model={model} mode="detail" showLabels rotationDegrees={-22} /></div>
              </div>

              <div className="treatment-report">
                <strong>TRATATIVA:</strong>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>PREENCHER (m)<br />(ATERRAR)</th>
                      <th>MATERIAL<br />(ATERRAR)</th>
                      <th>ALTURA (m)<br />(SUSPENDER)</th>
                      <th>CANCELAR FURO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={`${row.id}-${index}`} className={row.action === "cancel" ? "row-cancel" : "row-fill"}>
                        <td>{row.id}</td>
                        <td>{row.action === "fill" ? rowActionLabel(row) : ""}</td>
                        <td>{row.action === "fill" ? row.material : ""}</td>
                        <td>{row.action === "suspend" ? rowActionLabel(row) : ""}</td>
                        <td>{row.action === "cancel" ? "CANCELAR" : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="report-footer">
              <span>{appConfig.report.footer}</span>
              <span>{appConfig.report.confidentiality}</span>
            </footer>
          </div>
          </div>
        </section>
      </main>
    </>
  );
}
