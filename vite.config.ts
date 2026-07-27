import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_REPOSITORY ? "/analizador-pre-corte-opitdev/" : "/",
  build: {
    target: "es2020",
    sourcemap: true
  }
});
