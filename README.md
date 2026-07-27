# ANALIZADOR DE PRE-CORTE - OPITDEV

Sistema web estatico para importar DXF de pre-corte, configurar tratativas por furo e gerar uma lamina operacional em imagem ou PDF.

## Uso

1. Abra o site no GitHub Pages.
2. Importe um arquivo `.dxf` ou use o `PC.dxf` de referencia carregado automaticamente.
3. Ajuste o numero do pre-corte, responsavel e linhas de tratativa.
4. Exporte a lamina em PNG ou PDF.

Todo o processamento ocorre no navegador. Nenhum arquivo operacional e enviado para servidor.

## Desenvolvimento

```powershell
npm install
npm run dev
npm run validate
```

## Publicacao

O GitHub Pages e publicado pela branch `gh-pages`, contendo o `dist` gerado por `npm run build`.

## Configuracao

Os caminhos de assets, cores e dimensoes do relatorio ficam em `src/config.ts`. O Vite usa base automatica para GitHub Pages quando `GITHUB_REPOSITORY` esta definido.
