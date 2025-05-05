import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import copy from "rollup-plugin-copy";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dtsPlugin({
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: path.join(__dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            {
              src: "../data/**/*.md",
              dest: "dist",
              rename: (name, extension, fullPath) => {
                const [locale, sampleId, filename] = fullPath
                  .split("/")
                  .slice(-3);

                const newFilename = `${locale}.${sampleId}.${filename}`;
                return path.join("./code-samples", newFilename);
              },
            },
          ],
          hook: "writeBundle",
          flatten: true,
        }),
      ],
    },
  },
});
