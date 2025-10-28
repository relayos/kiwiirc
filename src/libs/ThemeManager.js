'kiwi public';

import _ from 'lodash';
import Vue from 'vue';

import Logger from '@/libs/Logger';

const log = Logger.namespace('ThemeManager');

let createdInstance = null;

export default class ThemeManager {
    constructor(state, argTheme) {
        this.state = state;

        this.activeTheme = null;
        this.previousTheme = null;

        this.varsElement = null;
        this.currentElement = null;
        this.loadingElement = null;
        this.renderingMode = null;

        Vue.observable(this);

        const initialTheme = this.findTheme(argTheme)
            || this.findTheme(state.setting('theme'))
            || this.availableThemes()[0];

        this.setTheme(initialTheme);
    }

    static themeUrl(theme) {
    // Check if this is a new-style theme from the styles directory
        if (theme.isNewStyle) {
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
            } else {
                // For other cases, extract the first path segment
                const pathParts = normalizedPath.split('/');
                if (pathParts.length > 1 && pathParts[1]) {
                    baseUrl = '/' + pathParts[1] + '/';
                }
            }

            return `${baseUrl}styles/themes/${theme.name.toLowerCase()}/theme.css`;
        }

        // Legacy theme URL handling
        let [url, qs] = theme.url.split('?');
        if (url[url.length - 1] !== '/') {
            url += '/';
        }
        return url + 'theme.css' + (qs ? '?' + qs : '');
    }

    static renderingModeUrl(mode) {
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
        } else {
            // For other cases, extract the first path segment
            const pathParts = normalizedPath.split('/');
            if (pathParts.length > 1 && pathParts[1]) {
                baseUrl = '/' + pathParts[1] + '/';
            }
        }

        return `${baseUrl}styles/render-modes/${mode}.css`;
    }

    availableThemes() {
        const themes = this.state.getSetting('settings.themes');

        // Add new-style themes if they're not already in the list
        const newStyleThemes = [
            { name: 'Default', isNewStyle: true },
            { name: 'RelayOS', isNewStyle: true },
        ];

        newStyleThemes.forEach((newTheme) => {
            const exists = _.find(
                themes,
                (t) => t.name.toLowerCase() === newTheme.name.toLowerCase()
            );
            if (!exists) {
                themes.push(newTheme);
            } else if (!exists.isNewStyle) {
                // Update existing theme to use new style
                exists.isNewStyle = true;
            }
        });

        log.debug('Available themes:', themes);
        return themes;
    }

    findTheme(name) {
        if (!name) {
            return null;
        }
        log.debug('Finding theme:', name);
        const theme =
            _.find(this.availableThemes(), (t) => t.name.toLowerCase() === name.toLowerCase());
        log.debug('Found theme:', theme);
        return theme;
    }

    setRenderingMode(mode) {
        if (this.renderingMode === mode) {
            return;
        }

        this.renderingMode = mode;
        log.debug('Setting rendering mode:', mode);

        // Reload the theme to apply the rendering mode
        this.reload();
    }

    currentTheme() {
        const theme = this.activeTheme || this.availableThemes()[0];
        return this.findTheme(theme.name);
    }

    setTheme(theme) {
        const nextTheme = Object.assign(
            Object.create(null),
            (typeof theme === 'string')
                ? this.findTheme(theme)
                : theme,
        );

        if (!nextTheme) {
            // Tried to set an invalid theme, abort
            // reset the theme setting name to current if its not valid
            if (this.activeTheme && this.activeTheme.name !== this.state.setting('theme')) {
                this.state.setting('theme', this.activeTheme.name);
            }
            log.error('Invalid theme', nextTheme);
            return;
        }

        // For new-style themes, we don't need a URL
        if (!nextTheme.isNewStyle && !nextTheme.url) {
            // Tried to set an invalid legacy theme, abort
            if (this.activeTheme && this.activeTheme.name !== this.state.setting('theme')) {
                this.state.setting('theme', this.activeTheme.name);
            }
            log.error('Invalid legacy theme (missing URL)', nextTheme);
            return;
        }

        if (this.loadingElement) {
            // There is already a loading theme
            // remove it as we are about to load another
            document.head.removeChild(this.loadingElement);
            this.loadingElement = null;
        }

        if (this.activeTheme && this.activeTheme.name === nextTheme.name) {
            // Theme did not change, abort
            return;
        }

        const nextNameLower = nextTheme.name.toLowerCase();
        const themeElement = document.createElement('link');

        if (this.previousTheme) {
            // If previousTheme is not set then this is the initial theme
            // do not check its loading/error state so there is always an
            // active and previous theme set
            themeElement.onload = () => {
                // New theme loaded successfully
                this.previousTheme = this.activeTheme;
                this.activeTheme = nextTheme;

                if (this.currentElement) {
                    // Remove the old theme from the DOM
                    document.head.removeChild(this.currentElement);
                }

                // Move our loaded element into current position
                this.currentElement = this.loadingElement;
                this.loadingElement = null;

                if (nextTheme.name !== this.state.setting('theme')) {
                    // Reset the theme setting name to current if its not valid
                    this.state.setting('theme', nextTheme.name);
                }

                this.state.$emit('theme.change', nextTheme, this.previousTheme);

                // If we have a rendering mode, load it now
                if (this.renderingMode) {
                    this.loadRenderingMode(this.renderingMode);
                }
            };

            themeElement.onerror = () => {
                // New theme failed to load, remove its loading element
                document.head.removeChild(this.loadingElement);
                this.loadingElement = null;

                if (nextNameLower === 'custom' &&
                    !nextTheme.isNewStyle &&
                    !/\/theme\.css(\?|$)/.test(nextTheme.url)) {
                    // For custom themes try appending /theme.css
                    this.setCustomThemeUrl(ThemeManager.themeUrl(nextTheme));
                    return;
                }

                this.state.$emit('theme.failed', nextTheme, this.activeTheme);
            };

            this.loadingElement = themeElement;
        } else {
            // This is our initial theme set by url param or config
            this.activeTheme = nextTheme;
            this.previousTheme = nextTheme;
            this.currentElement = themeElement;
        }

        themeElement.rel = 'stylesheet';
        themeElement.type = 'text/css';

        if (nextTheme.isNewStyle) {
            themeElement.href = ThemeManager.themeUrl(nextTheme);
        } else if (nextNameLower !== 'custom') {
            themeElement.href = ThemeManager.themeUrl(nextTheme);
        } else {
            themeElement.href = nextTheme.url;
        }

        document.head.appendChild(themeElement);
    }

    loadRenderingMode(mode) {
        // Remove any existing rendering mode stylesheet
        const existingElement = document.getElementById('rendering-mode-stylesheet');
        if (existingElement) {
            document.head.removeChild(existingElement);
        }

        // Create a new link element for the rendering mode
        const renderingModeElement = document.createElement('link');
        renderingModeElement.rel = 'stylesheet';
        renderingModeElement.type = 'text/css';
        renderingModeElement.id = 'rendering-mode-stylesheet';
        renderingModeElement.href = ThemeManager.renderingModeUrl(mode);

        renderingModeElement.onload = () => {
            log.debug(`Rendering mode ${mode} loaded successfully`);
        };

        renderingModeElement.onerror = () => {
            log.error(`Failed to load rendering mode ${mode}`);
        };

        document.head.appendChild(renderingModeElement);
    }

    setCustomThemeUrl(url) {
        const theme = this.findTheme('custom');
        if (!theme) {
            return;
        }

        theme.url = url;
        this.setTheme(theme);
    }

    reload() {
        const theme = this.currentTheme();
        if (!theme) {
            return;
        }

        if (theme.isNewStyle) {
            // For new-style themes, just re-apply the theme
            this.setTheme(theme.name);
            return;
        }

        // Legacy theme URL handling
        let url = theme.url;
        if (url.indexOf('cb=') > -1) {
            url = url.replace(/cb=[0-9]+/, () => 'cb=' + Date.now());
        } else if (url.indexOf('?') > -1) {
            url += '&cb=' + Date.now();
        } else {
            url += '?cb=' + Date.now();
        }

        theme.url = url;
        this.setTheme(theme.name);
    }

    themeVar(varName) {
        if (!this.varsElement) {
            this.varsElement = document.querySelector('.kiwi-wrap');
        }

        const styles = window.getComputedStyle(this.varsElement);
        const value = styles.getPropertyValue('--kiwi-' + varName);
        return (value || '').trim();
    }
}

ThemeManager.instance = (...args) => {
    if (!createdInstance) {
        createdInstance = new ThemeManager(...args);
    }

    return createdInstance;
};
