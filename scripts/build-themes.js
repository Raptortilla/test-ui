#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const THEMES_DIR = "./src/themes";
const OUTPUT_DIR = "./dist/themes";

function buildThemes() {
  console.log("🎨 Building all theme CSS files...\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all CSS files in themes directory
  const themeFiles = fs
    .readdirSync(THEMES_DIR)
    .filter((file) => file.endsWith(".css"))
    .map((file) => path.parse(file).name);

  if (themeFiles.length === 0) {
    console.log("❌ No theme CSS files found in", THEMES_DIR);
    return;
  }

  console.log(
    `📁 Found ${themeFiles.length} theme(s): ${themeFiles.join(", ")}\n`
  );

  let successCount = 0;
  let failedThemes = [];

  for (const themeName of themeFiles) {
    const inputFile = path.join(THEMES_DIR, `${themeName}.css`);
    const outputFile = path.join(OUTPUT_DIR, `${themeName}.css`);
    const configFile = path.join(THEMES_DIR, `tailwind.themes.config.js`);

    // Check if config file exists
    if (!fs.existsSync(configFile)) {
      console.log(
        `⚠️  Warning: Config file not found for theme '${themeName}' at ${configFile}`
      );
      console.log(`   Skipping theme '${themeName}'\n`);
      failedThemes.push(themeName);
      continue;
    }

    try {
      console.log(`🔨 Building theme: ${themeName}`);
      console.log(`   Input:  ${inputFile}`);
      console.log(`   Output: ${outputFile}`);
      console.log(`   Config: ${configFile}`);

      const command = `npx tailwindcss -i "${inputFile}" -o "${outputFile}" --minify --config "${configFile}"`;

      execSync(command, {
        stdio: ["inherit", "pipe", "pipe"],
        encoding: "utf8",
      });

      console.log(`✅ Successfully built theme: ${themeName}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to build theme: ${themeName}`);
      console.error(`   Error: ${error.message}\n`);
      failedThemes.push(themeName);
    }
  }

  // Summary
  console.log("📊 Build Summary:");
  console.log(
    `   ✅ Successfully built: ${successCount}/${themeFiles.length} themes`
  );

  if (failedThemes.length > 0) {
    console.log(`   ❌ Failed themes: ${failedThemes.join(", ")}`);
    process.exit(1);
  } else {
    console.log("   🎉 All themes built successfully!");
  }
}

// Run the build process
buildThemes();
