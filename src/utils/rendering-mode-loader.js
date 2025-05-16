/**
 * Rendering Mode CSS Loader
 *
 * This utility loads the appropriate CSS files based on the current rendering mode
 * (widget, fullscreen, inline) from the render.d directory.
 */

import Logger from '@/libs/Logger';
import GlobalApi from '@/libs/GlobalApi';
import ThemeManager from '@/libs/ThemeManager';

const log = Logger.namespace('rendering-mode-loader');

/**
 * Fetch CSS content as text
 * @param {string} url - The URL of the CSS file to fetch
 * @returns {Promise<string>} - A promise that resolves with the CSS content
 */
async function fetchCSSContent(url) {
    log.info(`Fetching CSS from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSS from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        log.error(`Error fetching CSS from ${url}:`, error);
        return ''; // Return empty string on error
    }
}

/**
 * Load the rendering mode-specific CSS file and theme CSS, then combine them
 * @param {string} cssFile - The CSS file to load (default is 'default.css')
 * @returns {Promise<void>} - A promise that resolves when the CSS is loaded
 */
export async function loadRenderingModeCSS(cssFile = 'default.css') {
    const api = GlobalApi.singleton();
    const renderingMode = api.renderingMode || 'widget'; // Default to widget if not set

    log.info(`Loading CSS for rendering mode: ${renderingMode}`);

    // Determine the base path for static resources
    // Get the full path without the hostname and protocol
    const fullPath = window.location.pathname;
    // Remove trailing slash if present
    const normalizedPath = fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;

    // Extract the application root path (e.g., /relayos-kiwiirc/)
    let baseUrl = '/';

    // Check if we're in a path that starts with /relayos-kiwiirc/
    if (normalizedPath.includes('/relayos-kiwiirc')) {
        baseUrl = '/relayos-kiwiirc/';
        log.info(`Using fixed application root path: ${baseUrl}`);
    } else {
        // For other cases, extract the first path segment
        const pathParts = normalizedPath.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
            baseUrl = '/' + pathParts[1] + '/';
            log.info(`Using detected application root path: ${baseUrl}`);
        }
    }

    try {
        // 1. Fetch the rendering mode CSS
        const renderingModeCssUrl = `${baseUrl}render.d/${renderingMode}/${cssFile}`;
        const renderingModeCSS = await fetchCSSContent(renderingModeCssUrl);

        // 2. Get the current theme from ThemeManager
        const themeMgr = ThemeManager.instance();
        const currentTheme = themeMgr.currentTheme();

        if (!currentTheme) {
            log.error('No current theme found');
            // If no theme is found, just apply the rendering mode CSS
            applyCSS(renderingModeCSS, `${renderingMode}-css`);
            return;
        }

        // 3. Fetch the theme CSS
        let themeUrl = currentTheme.url;
        if (themeUrl[themeUrl.length - 1] !== '/') {
            themeUrl += '/';
        }
        themeUrl += 'theme.css';

        const themeCSS = await fetchCSSContent(themeUrl);

        // 4. Combine the CSS with theme CSS last (for precedence)
        const combinedCSS = `/* Rendering Mode: ${renderingMode} */\n${renderingModeCSS}\n\n/* Theme: ${currentTheme.name} */\n${themeCSS}`;

        // 5. Apply the combined CSS
        applyCSS(combinedCSS, 'combined-css');

        log.info(`Successfully loaded and combined CSS for rendering mode: ${renderingMode} and theme: ${currentTheme.name}`);
    } catch (error) {
        log.error('Error loading and combining CSS:', error);
        // Fallback to the old method if there's an error
        loadCSSFallback(baseUrl, renderingMode, cssFile);
    }
}

/**
 * Apply CSS content to the document
 * @param {string} cssContent - The CSS content to apply
 * @param {string} id - The ID for the style element
 */
function applyCSS(cssContent, id) {
    // Remove any existing style element with the same ID
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
        existingStyle.remove();
    }

    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.textContent = cssContent;

    // Add the style element to the document head
    document.head.appendChild(styleElement);
}

/**
 * Fallback method to load CSS using link elements
 * @param {string} baseUrl - The base URL
 * @param {string} renderingMode - The rendering mode
 * @param {string} cssFile - The CSS file name
 */
function loadCSSFallback(baseUrl, renderingMode, cssFile) {
    // Construct the CSS URL based on the rendering mode
    const cssUrl = `${baseUrl}render.d/${renderingMode}/${cssFile}`;
    log.info(`Falling back to link element for CSS from: ${cssUrl}`);

    // Create a link element for the CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = cssUrl;

    // Set up event handlers
    linkElement.onload = () => {
        log.info(`Successfully loaded CSS for rendering mode: ${renderingMode}`);
    };

    linkElement.onerror = (error) => {
        log.error(`Failed to load CSS for rendering mode: ${renderingMode}`, error);
    };

    // Add the link element to the document head
    document.head.appendChild(linkElement);
}

export default {
    loadRenderingModeCSS,
};
