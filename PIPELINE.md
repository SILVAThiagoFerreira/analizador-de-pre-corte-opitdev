# PIPELINE

1. Usuario abre a SPA no GitHub Pages.
2. Aplicacao carrega `public/examples/PC.dxf`.
3. `src/dxf.ts` valida e converte entidades DXF em segmentos, textos, pontos, camadas e limites.
4. `src/App.tsx` popula painel de tratativas e renderiza a lamina.
5. `src/DxfPreview.tsx` desenha a geometria em SVG.
6. `src/reportExport.ts` captura a lamina com `html2canvas` e exporta PNG ou PDF com `jspdf`.
7. `npm run validate` executa testes e build.
8. O artefato `dist` e publicado na branch `gh-pages`.
