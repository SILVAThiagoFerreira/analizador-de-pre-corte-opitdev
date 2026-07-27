/// <reference types="vite/client" />

declare module "dxf-parser" {
  export default class DxfParser {
    parseSync(source: string): unknown;
  }
}
