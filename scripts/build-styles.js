#!/usr/bin/env node

/**
 * Build Styles Script
 * 
 * This script compiles SCSS files to CSS for both themes and rendering modes.
 * It uses node-sass to compile the SCSS files and creates the necessary output directories.
 */

const path = require('path');
const sass = require('sass');
const fs = require('fs-extra');
const glob = require('glob');

// Paths
const STYLES_DIR = path.resolve(__dirname, '../src/styles');
const THEMES_DIR = path.resolve(STYLES_DIR, 'themes');
const RENDER_MODES_DIR = path.resolve(STYLES_DIR, 'render-modes');
const DIST_DIR = path.resolve(__dirname, '../dist');
const STATIC_DIR = path.resolve(__dirname, '../static');

// Ensure output directories exist
fs.ensureDirSync(path.resolve(DIST_DIR, 'styles/themes'));
fs.ensureDirSync(path.resolve(DIST_DIR, 'styles/render-modes'));
fs.ensureDirSync(path.resolve(STATIC_DIR, 'styles/themes'));
fs.ensureDirSync(path.resolve(STATIC_DIR, 'styles/render-modes'));

/**
 * Compile SCSS file to CSS
 * @param {string} file - Path to SCSS file
 * @param {string} outFile - Path to output CSS file
 */
function compileSass(file, outFile) {
  try {
    const result = sass.compile(file, {
      style: 'compressed',
      sourceMap: true,
    });

    fs.writeFileSync(outFile, result.css);
    console.log(`Compiled ${file} to ${outFile}`);
    return true;
  } catch (error) {
    console.error(`Error compiling ${file}:`, error.message);
    throw error; // Re-throw the error so it can be caught by the caller
  }
}

/**
 * Build themes
 */
function buildThemes() {
  const themeFiles = glob.sync(`${THEMES_DIR}/*/theme.scss`);
  
  themeFiles.forEach(file => {
    const themeName = path.basename(path.dirname(file));
    const distOutFile = path.resolve(DIST_DIR, `styles/themes/${themeName}/theme.css`);
    const staticOutFile = path.resolve(STATIC_DIR, `styles/themes/${themeName}/theme.css`);
    
    // Create theme directory if it doesn't exist
    fs.ensureDirSync(path.dirname(distOutFile));
    fs.ensureDirSync(path.dirname(staticOutFile));
    
    try {
      // Compile SCSS to CSS
      compileSass(file, distOutFile);
      
      // Copy to static directory if the file was created
      if (fs.existsSync(distOutFile)) {
        fs.copyFileSync(distOutFile, staticOutFile);
      } else {
        console.error(`Compiled file not found: ${distOutFile}`);
      }
    } catch (error) {
      console.error(`Error processing theme ${themeName}:`, error.message);
    }
  });
}

/**
 * Build rendering modes
 */
function buildRenderModes() {
  const renderModeFiles = glob.sync(`${RENDER_MODES_DIR}/*.scss`);
  
  renderModeFiles.forEach(file => {
    const renderModeName = path.basename(file, '.scss');
    const distOutFile = path.resolve(DIST_DIR, `styles/render-modes/${renderModeName}.css`);
    const staticOutFile = path.resolve(STATIC_DIR, `styles/render-modes/${renderModeName}.css`);
    
    // Create rendering mode directory if it doesn't exist
    fs.ensureDirSync(path.dirname(distOutFile));
    fs.ensureDirSync(path.dirname(staticOutFile));
    
    try {
      // Compile SCSS to CSS
      compileSass(file, distOutFile);
      
      // Copy to static directory if the file was created
      if (fs.existsSync(distOutFile)) {
        fs.copyFileSync(distOutFile, staticOutFile);
      } else {
        console.error(`Compiled file not found: ${distOutFile}`);
      }
    } catch (error) {
      console.error(`Error processing rendering mode ${renderModeName}:`, error.message);
    }
  });
}

// Build themes and rendering modes
buildThemes();
buildRenderModes();

console.log('Styles build complete!');
