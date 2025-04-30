import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { plugin as markdownPlugin, Mode } from "vite-plugin-markdown";
import dtsPlugin from "vite-plugin-dts";
import copy from "rollup-plugin-copy";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [markdownPlugin({ mode: [Mode.MARKDOWN] }), dtsPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ApptSamples",
      fileName: "appt-samples",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled into your library
      external: [],
      plugins: [
        copy({
          targets: [{ src: "src/data/**/*.md", dest: "dist/data" }],
          hook: "writeBundle", // Execute after bundle has been written
        }),
      ],
    },
  },
});
