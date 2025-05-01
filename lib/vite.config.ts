import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import { defineConfig } from "vite";
import { plugin as markdownPlugin, Mode } from "vite-plugin-markdown";
import dtsPlugin from "vite-plugin-dts";
import copy from "rollup-plugin-copy";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [markdownPlugin({ mode: [Mode.MARKDOWN] }), dtsPlugin()],
  build: {
    outDir: path.join(__dirname, "../dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ApptSamples",
      fileName: "appt-samples",
    },
    rollupOptions: {
      plugins: [
        copy({
          targets: [{ src: "../data/**/*.md", dest: "../dist" }],
          hook: "writeBundle",
          flatten: false,
        }),
      ],
    },
  },
});
