export const appConfig = {
  appName: "ANALIZADOR DE FUROS - OPITDEV",
  analysisTypes: ["PRÉ-CORTE", "FACE"],
  labels: {
    analysisType: "Tipo de análise",
    analysisId: "Identificação",
    panelTitle: "Gerador de lâmina de furos",
    loadOnlyMeters: "CARREGAR SOMENTE (m)",
    customStemmingMeters: "TAMPÃO PERSONALIZADO (m)"
  },
  defaultDxfUrl: `${import.meta.env.BASE_URL}examples/PC.dxf`,
  logoDark: `${import.meta.env.BASE_URL}assets/enaex-brasil.png`,
  logoWhite: `${import.meta.env.BASE_URL}assets/enaex-brasil-white.png`,
  logoReport: `${import.meta.env.BASE_URL}assets/enaex-brasil.png`,
  openBlastLogo: `${import.meta.env.BASE_URL}assets/openblast-logo.png`,
  colors: {
    ink: "#24323d",
    red: "#ed1c24",
    green: "#1f5f3a",
    line: "#d9dee2",
    muted: "#647282",
    gold: "#b28a19",
    fillSuspend: "#dfeee9",
    fillCancel: "#fbefef"
  },
  report: {
    widthPx: 1588,
    heightPx: 1080,
    footer: "Setor Técnico de Operações - Enaex Brasil - US Vale Verde.",
    confidentiality: "STRICTLY PRIVATE AND CONFIDENTIAL"
  }
} as const;
