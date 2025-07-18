import { defineConfig } from "tsup";
import { cp } from "node:fs/promises";

export default defineConfig({
  entry: ["src/components/index.ts"],
  format: ["esm", "cjs"],

  dts: {
    compilerOptions: {
      incremental: true,
      tsBuildInfoFile: ".tsbuildinfo", // any writable path inside the repo
    },
  },
  clean: true,
  // external: ["tailwindcss"], // don't bundle peer deps

  // After build copy CSS theme assets to dist
  onSuccess: async () => {
    // Copy theme CSS files to dist for package distribution
    await cp("src/themes", "dist/themes", { recursive: true });
  },
});
