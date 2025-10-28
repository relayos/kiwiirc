#!/usr/bin/env node

/**
 * Theme Migration Script
 * 
 * This script migrates the CSS-based themes from static/themes to the new SCSS-based
 * theme system in src/themes. It reads the CSS files, converts them to SCSS format,
 * and saves them to the appropriate directories in src/themes.
 * 
 * Usage:
 *   node scripts/migrate-themes.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

// Paths
const staticThemesDir = path.join(__dirname, '..', 'static', 'themes');
const srcThemesDir = path.join(__dirname, '..', 'src', 'themes');
const baseVariablesPath = path.join(srcThemesDir, 'base', '_variables.scss');
const baseMixinsPath = path.join(srcThemesDir, 'base', '_mixins.scss');

/**
 * Convert CSS to SCSS
 * @param {string} css - The CSS content
 * @returns {string} - The SCSS content
 */
function convertCssToScss(css) {
  // Replace CSS imports with SCSS imports
  let scss = css.replace(/@import '(.+)';/g, "@import '$1';");
  
  // Replace CSS variables with SCSS variables
  scss = scss.replace(/var\(--([a-zA-Z0-9-]+)\)/g, '$$$1');
  
  return scss;
}

/**
 * Create a theme.scss file for a theme
 * @param {string} themeName - The name of the theme
 * @param {string} css - The CSS content
 * @returns {string} - The SCSS content
 */
function createThemeScss(themeName, css) {
  // Extract CSS variables
  const variableRegex = /:root\s*{([^}]*)}/;
  const variableMatch = css.match(variableRegex);
  let variables = '';
  
  if (variableMatch && variableMatch[1]) {
    variables = variableMatch[1]
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('--'))
      .map(line => {
        const [name, value] = line.split(':').map(part => part.trim());
        return `$${name.substring(2)}: ${value.replace(/;$/, '')};`;
      })
      .join('\n');
  }
  
  // Create the SCSS content
  return `// ${themeName} Theme
// Migrated from static/themes/${themeName}/theme.css

// Import base theme variables and mixins
@import '../base/variables';
@import '../base/mixins';

// Override variables
${variables}

// Import the original CSS (converted to SCSS)
${convertCssToScss(css)}
`;
}

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
 * Migrate a theme
 * @param {string} themeName - The name of the theme
 */
async function migrateTheme(themeName) {
  console.log(`Migrating theme: ${themeName}`);
  
  // Skip the common directory
  if (themeName === 'common') {
    return;
  }
  
  // Create the theme directory
  const themeDir = path.join(srcThemesDir, themeName);
  await ensureDir(themeDir);
  
  // Read the theme CSS
  const themeCssPath = path.join(staticThemesDir, themeName, 'theme.css');
  const themeCss = await readFile(themeCssPath, 'utf8');
  
  // Create the theme SCSS
  const themeScss = createThemeScss(themeName, themeCss);
  
  // Write the theme SCSS
  const themeScssPath = path.join(themeDir, 'theme.scss');
  await writeFile(themeScssPath, themeScss);
  
  console.log(`  Created ${themeScssPath}`);
  
  // Create the components directory
  const componentsDir = path.join(themeDir, 'components');
  await ensureDir(componentsDir);
  
  console.log(`  Created ${componentsDir}`);
}

/**
 * Migrate the common CSS
 */
async function migrateCommon() {
  console.log('Migrating common CSS');
  
  // Read the common CSS
  const commonCssPath = path.join(staticThemesDir, 'common', 'base.css');
  const commonCss = await readFile(commonCssPath, 'utf8');
  
  // Convert to SCSS
  const commonScss = convertCssToScss(commonCss);
  
  // Write the common SCSS
  const commonScssPath = path.join(srcThemesDir, 'base', '_common.scss');
  await writeFile(commonScssPath, commonScss);
  
  console.log(`  Created ${commonScssPath}`);
}

/**
 * Update the base variables
 */
async function updateBaseVariables() {
  console.log('Updating base variables');
  
  // Read the base variables
  const baseVariables = await readFile(baseVariablesPath, 'utf8');
  
  // Add a note about the migration
  const updatedBaseVariables = `// RelayOS KiwiIRC - Base Theme Variables
// Note: This file includes variables migrated from static/themes

${baseVariables}`;
  
  // Write the updated base variables
  await writeFile(baseVariablesPath, updatedBaseVariables);
  
  console.log(`  Updated ${baseVariablesPath}`);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting theme migration...');
    
    // Get the list of themes
    const themes = await readdir(staticThemesDir);
    
    // Migrate the common CSS
    await migrateCommon();
    
    // Update the base variables
    await updateBaseVariables();
    
    // Migrate each theme
    for (const theme of themes) {
      if (theme !== 'common') {
        await migrateTheme(theme);
      }
    }
    
    console.log('Theme migration completed successfully!');
  } catch (err) {
    console.error('Error during theme migration:', err);
    process.exit(1);
  }
}

// Run the main function
main();
