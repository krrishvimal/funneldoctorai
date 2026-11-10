import { defineConfig } from "tsup";

export default defineConfig([
  // 1. Library build (ESM + CJS + Types)
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    target: "es2022",
  },
  // 2. Standalone Browser Drop-in Script (<2KB IIFE)
  {
    entry: { "funneldoctor": "src/browser.ts" },
    format: ["iife"],
    globalName: "FunnelDoctor",
    minify: true,
    clean: false,
    target: "es2020",
    sourcemap: false,
  }
]);
