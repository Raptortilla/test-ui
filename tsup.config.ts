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
  external: ["react", "react-dom", "tailwindcss", "postcss"],

  // After build copy CSS theme assets to dist
  onSuccess: async () => {
    const { execSync } = await import("child_process");

    // Build all themes using Tailwind CSS
    console.log("Building themes...");
    execSync("npm run themes:build", { stdio: "inherit" });

    console.log("All themes built successfully!");
  },
});
