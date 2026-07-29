# ANALIZADOR DE FUROS - OPITDEV

Sistema web estático para importar DXF de furos, selecionar a análise de **PRÉ-CORTE** ou **FACE**, configurar tratativas e gerar uma lâmina operacional em imagem ou PDF.

## Uso

1. Abra o site no GitHub Pages.
2. Importe um arquivo `.dxf` ou use o `PC.dxf` de referência carregado automaticamente.
3. Selecione o tipo de análise (**PRÉ-CORTE** ou **FACE**), informe a identificação, o responsável e as linhas de tratativa.
4. Preencha, quando aplicável, **CARREGAR SOMENTE (m)** e **TAMPÃO PERSONALIZADO (m)**. As metragens são mostradas em metros na lâmina.
5. Exporte a lâmina em PNG ou PDF.

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

Os caminhos de assets, cores, dimensões e rótulos operacionais ficam em `src/config.ts`. O Vite usa base automática para GitHub Pages quando `GITHUB_REPOSITORY` está definido.
