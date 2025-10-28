/**
 * Rendering Mode CSS Loader
 *
 * This utility loads the appropriate CSS files based on the current rendering mode
 * (widget, fullscreen, inline) from the render.d directory.
 */

import Logger from '@/libs/Logger';
import GlobalApi from '@/libs/GlobalApi';

const log = Logger.namespace('rendering-mode-loader');

/**
 * Load the rendering mode-specific CSS file
 * @param {string} cssFile - The CSS file to load (default is 'default.css')
 * @returns {Promise<void>} - A promise that resolves when the CSS is loaded
 */
export async function loadRenderingModeCSS(cssFile = 'default.css') {
    const api = GlobalApi.singleton();
    const renderingMode = api.renderingMode || 'widget'; // Default to widget if not set

    log.info(`Loading CSS for rendering mode: ${renderingMode}`);

    // Get the ThemeManager instance
    const themeManager = api.themes || window.kiwi.themes;

    if (themeManager && typeof themeManager.setRenderingMode === 'function') {
        // Use the ThemeManager to load the rendering mode
        themeManager.setRenderingMode(renderingMode);
        log.info(`Using ThemeManager to load rendering mode: ${renderingMode}`);
        return Promise.resolve();
    } else {
        log.info('ThemeManager not available, falling back to legacy mode');

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

        // Construct the CSS URL based on the rendering mode
        const cssUrl = `${baseUrl}render.d/${renderingMode}/${cssFile}`;
        log.info(`Loading CSS from: ${cssUrl}`);

        return new Promise((resolve, reject) => {
            // Create a link element for the CSS
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.type = 'text/css';
            linkElement.href = cssUrl;

            // Set up event handlers
            linkElement.onload = () => {
                log.info(`Successfully loaded CSS for rendering mode: ${renderingMode}`);
                resolve();
            };

            linkElement.onerror = (error) => {
                log.error(`Failed to load CSS for rendering mode: ${renderingMode}`, error);
                reject(error);
            };

            // Add the link element to the document head
            document.head.appendChild(linkElement);
        });
    }
}

// This function is kept for reference but not used directly
// eslint-disable-next-line no-unused-vars
function loadCSSFallback(baseUrl, renderingMode, cssFile) {
    // Construct the CSS URL based on the rendering mode
    const cssUrl = `${baseUrl}render.d/${renderingMode}/${cssFile}`;
    log.info(`Falling back to legacy CSS from: ${cssUrl}`);

    // Create a link element for the CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = cssUrl;

    // Set up event handlers
    linkElement.onload = () => {
        log.info(`Successfully loaded legacy CSS for rendering mode: ${renderingMode}`);
    };

    linkElement.onerror = (error) => {
        log.error(`Failed to load legacy CSS for rendering mode: ${renderingMode}`, error);
    };

    // Add the link element to the document head
    document.head.appendChild(linkElement);
}

export default {
    loadRenderingModeCSS,
};
