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
    const basePath = window.location.pathname.split('/')[1] || '';
    const baseUrl = basePath ? `/${basePath}` : '';

    try {
        // Try to load the host-specific configuration from the directory structure
        const response = await fetch(`${baseUrl}/static/config.json.d/${hostname}/config.json`);

        if (response.ok) {
            const hostConfig = await response.json();
            log.info(`Loaded host-specific configuration for ${hostname}`);

            // Add the base path to the configuration
            if (basePath && !hostConfig.baseUrl) {
                hostConfig.baseUrl = baseUrl;
            }

            // Merge the host-specific configuration with the default configuration
            return mergeConfigs(defaultConfig, hostConfig);
        } else {
            log.info(`No host-specific configuration found for ${hostname}, trying fallback`);

            // Try the old-style flat file as a fallback
            try {
                const fallbackResponse = await fetch(`${baseUrl}/static/config.json.d/${hostname}.json`);

                if (fallbackResponse.ok) {
                    const fallbackConfig = await fallbackResponse.json();
                    log.info(`Loaded fallback configuration for ${hostname}`);

                    // Add the base path to the configuration
                    if (basePath && !fallbackConfig.baseUrl) {
                        fallbackConfig.baseUrl = baseUrl;
                    }

                    return mergeConfigs(defaultConfig, fallbackConfig);
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

            // Merge the host-specific configuration with the default configuration
            return mergeConfigs(defaultConfig, hostConfig);
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
        const response = await fetch(`${baseUrl}/static/config.json.d/default/config.json`);

        if (response.ok) {
            const defaultHostConfig = await response.json();
            log.info('Loaded default configuration');

            // Add the base path to the configuration
            if (baseUrl && !defaultHostConfig.baseUrl) {
                defaultHostConfig.baseUrl = baseUrl;
            }

            // Merge the default host configuration with the default configuration
            return mergeConfigs(defaultConfig, defaultHostConfig);
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

/**
 * Merge two configuration objects
 * @param {Object} defaultConfig - The default configuration object
 * @param {Object} hostConfig - The host-specific configuration object
 * @returns {Object} - The merged configuration object
 */
function mergeConfigs(defaultConfig, hostConfig) {
    // Create a deep copy of the default configuration
    const mergedConfig = JSON.parse(JSON.stringify(defaultConfig));

    // Recursively merge the host-specific configuration into the default configuration
    function recursiveMerge(target, source) {
        Object.keys(source).forEach((key) => {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                // If the key doesn't exist in the target or is not an object, create it
                if (!target[key] || typeof target[key] !== 'object') {
                    target[key] = {};
                }
                recursiveMerge(target[key], source[key]);
            } else {
                // Otherwise, just copy the value
                target[key] = source[key];
            }
        });
    }

    recursiveMerge(mergedConfig, hostConfig);
    return mergedConfig;
}

export default {
    loadHostConfig,
    loadHostConfigFromScript,
    loadDefaultConfig,
};
