/**
 * Host-specific Configuration Loader
 *
 * This utility detects the current hostname and loads the appropriate configuration file
 * from the config.json.d directory. If no matching configuration is found, it falls back
 * to the default configuration.
 */

import JSON5 from 'json5';
import Logger from '@/libs/Logger';

const log = Logger.namespace('host-config-loader');

/**
 * Load the host-specific configuration
 * @param {Object} defaultConfig - The default configuration object
 * @returns {Promise<Object>} - The merged configuration object
 */
export async function loadHostConfig(defaultConfig) {
    const hostname = window.location.hostname;
    log.info(`Detected hostname: ${hostname}`);

    // Determine the base path for static resources
    // Get the full path without the hostname and protocol
    const fullPath = window.location.pathname;
    // Remove trailing slash if present
    const normalizedPath = fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;

    // Extract the application root path (e.g., /relayos-kiwiirc/)
    // This assumes the application is always mounted at a path like /relayos-kiwiirc/
    // and not at the root of the domain
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

    // Log the detected base URL for debugging
    log.info(`Using base URL: ${baseUrl} (original path: ${normalizedPath})`);

    try {
        // Try to load the host-specific configuration from the directory structure
        const configUrl = `${baseUrl}config.json.d/${hostname}/config.json`;
        log.info(`Fetching config from: ${configUrl}`);
        const response = await fetch(configUrl);

        if (response.ok) {
            const hostConfig = await response.json();
            log.info(`Loaded host-specific configuration for ${hostname}`);

            // Add the base path to the configuration
            if (baseUrl && !hostConfig.baseUrl) {
                hostConfig.baseUrl = baseUrl;
            }

            // Return the host-specific configuration directly without merging
            return hostConfig;
        } else {
            log.info(`No host-specific configuration found for ${hostname}, trying fallback`);

            // Try the old-style flat file as a fallback
            try {
                const fallbackUrl = `${baseUrl}config.json.d/${hostname}.json`;
                log.info(`Fetching config from: ${fallbackUrl}`);
                const fallbackResponse = await fetch(fallbackUrl);

                if (fallbackResponse.ok) {
                    const fallbackConfig = await fallbackResponse.json();
                    log.info(`Loaded fallback configuration for ${hostname}`);

                    // Add the base path to the configuration
                    if (baseUrl && !fallbackConfig.baseUrl) {
                        fallbackConfig.baseUrl = baseUrl;
                    }

                    return fallbackConfig;
                } else {
                    log.info(`No fallback configuration found for ${hostname}, trying default config`);
                    return loadDefaultConfig(defaultConfig, baseUrl);
                }
            } catch (fallbackError) {
                log.info(`No fallback configuration found for ${hostname}, trying default config`);
                return loadDefaultConfig(defaultConfig, baseUrl);
            }
        }
    } catch (error) {
        log.error(`Error loading host-specific configuration: ${error.message}`);
        log.info('Trying default config due to error');
        return loadDefaultConfig(defaultConfig, baseUrl);
    }
}

/**
 * Load the host-specific configuration from a script tag
 * @param {Object} defaultConfig - The default configuration object
 * @returns {Object} - The merged configuration object
 */
export function loadHostConfigFromScript(defaultConfig) {
    const hostname = window.location.hostname;
    log.info(`Detected hostname: ${hostname}`);

    // Look for a script tag with the host-specific configuration
    const scriptTag = document.querySelector(`script[name="kiwiconfig-${hostname}"]`);

    if (scriptTag) {
        try {
            const hostConfig = JSON5.parse(scriptTag.innerHTML);
            log.info(`Loaded host-specific configuration for ${hostname} from script tag`);

            // Return the host-specific configuration directly without merging
            return hostConfig;
        } catch (error) {
            log.error(`Error parsing host-specific configuration from script tag: ${error.message}`);
            log.info('Trying default config due to script tag error');
            return loadDefaultConfig(defaultConfig);
        }
    } else {
        log.info(`No host-specific configuration found for ${hostname} in script tags, trying default config`);
        return loadDefaultConfig(defaultConfig);
    }
}

/**
 * Load the default configuration
 * @param {Object} defaultConfig - The default configuration object
 * @param {string} baseUrl - The base URL path
 * @returns {Promise<Object>} - The merged configuration object
 */
async function loadDefaultConfig(defaultConfig, baseUrl = '') {
    try {
        // Try to load the default configuration
        const defaultConfigUrl = `${baseUrl}config.json.d/default/config.json`;
        log.info(`Fetching config from: ${defaultConfigUrl}`);
        const response = await fetch(defaultConfigUrl);

        if (response.ok) {
            const defaultHostConfig = await response.json();
            log.info('Loaded default configuration');

            // Add the base path to the configuration
            if (baseUrl && !defaultHostConfig.baseUrl) {
                defaultHostConfig.baseUrl = baseUrl;
            }

            // Return the default host configuration directly without merging
            return defaultHostConfig;
        } else {
            log.info('No default configuration found, using provided default');

            // Add the base path to the default configuration
            if (baseUrl && !defaultConfig.baseUrl) {
                const configCopy = JSON.parse(JSON.stringify(defaultConfig));
                configCopy.baseUrl = baseUrl;
                return configCopy;
            }

            return defaultConfig;
        }
    } catch (error) {
        log.error(`Error loading default configuration: ${error.message}`);

        // Add the base path to the default configuration
        if (baseUrl && !defaultConfig.baseUrl) {
            const configCopy = JSON.parse(JSON.stringify(defaultConfig));
            configCopy.baseUrl = baseUrl;
            return configCopy;
        }

        return defaultConfig;
    }
}

export default {
    loadHostConfig,
    loadHostConfigFromScript,
    loadDefaultConfig,
};
