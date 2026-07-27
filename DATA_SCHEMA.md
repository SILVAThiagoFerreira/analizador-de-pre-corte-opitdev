# DATA_SCHEMA

## DxfModel

- `name`: nome do arquivo importado.
- `segments`: polilinhas renderizaveis com `layer`, `color`, `points` e `closed`.
- `texts`: textos DXF com `layer`, `value` e coordenada.
- `points`: pontos DXF com `layer` e coordenada.
- `bounds`: limites `minX`, `minY`, `maxX`, `maxY`.
- `layers`: contagem de entidades por camada.

## TreatmentRow

- `id`: identificador do furo.
- `action`: `fill`, `suspend` ou `cancel`.
- `fillMeters`: metragem para aterro.
- `material`: material de aterro.
- `suspendHeight`: altura de suspensao.

## ReportSettings

- `precutId`: identificador do pre-corte.
- `title`: titulo da lamina.
- `includeOpenBlast`: reservado para exibicao de marca complementar.
- `generatedBy`: responsavel exibido no painel.
- `actionFillLabel`: texto de legenda para aterrar/suspender.
- `actionCancelLabel`: texto de legenda para cancelar.
