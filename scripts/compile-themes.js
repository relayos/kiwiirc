#!/usr/bin/env node

/**
 * Theme Compilation Script
 * 
 * This script compiles the SCSS-based themes in src/themes to CSS files in static/themes.
 * It reads the SCSS files, compiles them to CSS, and saves them to the appropriate
 * directories in static/themes.
 * 
 * Usage:
 *   node scripts/compile-themes.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sass = require('sass');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

// Paths
const srcThemesDir = path.join(__dirname, '..', 'src', 'themes');
const staticThemesDir = path.join(__dirname, '..', 'static', 'themes');

/**
 * Ensure a directory exists
 * @param {string} dir - The directory path
 */
async function ensureDir(dir) {
  try {
    await stat(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(dir, { recursive: true });
    } else {
      throw err;
    }
  }
}

/**
 * Compile a theme
 * @param {string} themeName - The name of the theme
 */
async function compileTheme(themeName) {
  console.log(`Compiling theme: ${themeName}`);
  
  // Skip the base directory
  if (themeName === 'base') {
    return;
  }
  
  // Check if theme.scss exists
  const themeScssPath = path.join(srcThemesDir, themeName, 'theme.scss');
  try {
    await stat(themeScssPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`  Skipping ${themeName}: theme.scss not found`);
      return;
    }
    throw err;
  }
  
  // Create the output directory
  const outputDir = path.join(staticThemesDir, themeName);
  await ensureDir(outputDir);
  
  // Compile the theme
  const result = sass.renderSync({
    file: themeScssPath,
    outputStyle: 'compressed',
    includePaths: [srcThemesDir],
  });
  
  // Write the compiled CSS
  const themeCssPath = path.join(outputDir, 'theme.css');
  await writeFile(themeCssPath, result.css);
  
  console.log(`  Created ${themeCssPath}`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting theme compilation...');
    
    // Get the list of themes
    const themes = await readdir(srcThemesDir);

    // Compile each theme
    for (const theme of themes) {
      // Skip the base directory and any files (only process directories)
      const themePath = path.join(srcThemesDir, theme);
      const stats = await stat(themePath);
      if (theme !== 'base' && stats.isDirectory()) {
        await compileTheme(theme);
      }
    }
    
    console.log('Theme compilation completed successfully!');
  } catch (err) {
    console.error('Error during theme compilation:', err);
    process.exit(1);
  }
}

// Run the main function
main();
