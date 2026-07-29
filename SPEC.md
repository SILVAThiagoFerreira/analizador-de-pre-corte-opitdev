# SPEC

## Objetivo

Gerar uma lamina de tratativas para furos perfilados a partir de um DXF importado pelo usuario, seguindo identidade visual Enaex/OpenBlast e o formato de referencia fornecido.

## Requisitos funcionais

- Carregar automaticamente `public/examples/PC.dxf`.
- Permitir importacao manual de DXF no navegador.
- Renderizar geometrias DXF comuns: `LINE`, `POLYLINE`, `LWPOLYLINE`, `CIRCLE`, `ARC`, `POINT`, `TEXT` e `MTEXT`.
- Permitir selecionar o tipo de análise entre `PRÉ-CORTE` e `FACE`, configurar sua identificação, título, responsável e tratativas.
- Manter, para cada tratativa, as metragens opcionais `CARREGAR SOMENTE (m)` e `TAMPÃO PERSONALIZADO (m)` como números não negativos; as células da lâmina devem exibir valores preenchidos com o sufixo `m`.
- Gerar prévia de lâmina em formato paisagem com duas ilustrações e tabela.
- Exportar PNG e PDF a partir da lâmina visível.

## Requisitos nao funcionais

- Aplicacao 100% estatica para GitHub Pages.
- Processamento local, sem backend.
- Erros de DXF invalido devem aparecer ao usuario.
- O front-end deve manter o manifesto implicito de assets em `public/assets` e o DXF exemplo em `public/examples/PC.dxf`.
