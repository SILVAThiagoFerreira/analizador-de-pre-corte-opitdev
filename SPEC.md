# SPEC

## Objetivo

Gerar uma lamina de tratativas para furos perfilados a partir de um DXF importado pelo usuario, seguindo identidade visual Enaex/OpenBlast e o formato de referencia fornecido.

## Requisitos funcionais

- Carregar automaticamente `public/examples/PC.dxf`.
- Permitir importacao manual de DXF no navegador.
- Renderizar geometrias DXF comuns: `LINE`, `POLYLINE`, `LWPOLYLINE`, `CIRCLE`, `ARC`, `POINT`, `TEXT` e `MTEXT`.
- Permitir configurar pre-corte, titulo, responsavel e tratativas.
- Gerar previa de lamina em formato paisagem com duas ilustracoes e tabela.
- Exportar PNG e PDF a partir da lamina visivel.

## Requisitos nao funcionais

- Aplicacao 100% estatica para GitHub Pages.
- Processamento local, sem backend.
- Erros de DXF invalido devem aparecer ao usuario.
- O front-end deve manter o manifesto implicito de assets em `public/assets` e o DXF exemplo em `public/examples/PC.dxf`.
