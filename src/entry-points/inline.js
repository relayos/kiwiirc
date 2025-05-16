// RelayOS KiwiIRC - Inline Entry Point

import Vue from 'vue';
import _ from 'lodash';
import JSON5 from 'json5';
import Logger from '@/libs/Logger';
import ConfigLoader from '@/libs/ConfigLoader';
import getState from '@/libs/state';
import ThemeManager from '@/libs/ThemeManager';
import GlobalApi from '@/libs/GlobalApi';
import * as Misc from '@/helpers/Misc';
import { loadHostConfig } from '@/utils/host-config-loader';

// Import inline components
import InlineContainer from '@/components/inline/InlineContainer';
import MessageList from '@/components/MessageList';
import ControlInput from '@/components/ControlInput';
import StateBrowser from '@/components/StateBrowser';

// Import global styles
import 'font-awesome/css/font-awesome.css';

// Set up logging
let logLevelMatch = window.location.href.match(/kiwi-loglevel=(\d)/);
if (logLevelMatch && logLevelMatch[1]) {
    let newLevel = parseInt(logLevelMatch[1], 10);
    Logger.setLevel(newLevel);
    Logger('Logging level set to', newLevel);
}

let log = Logger.namespace('inline');

// Create the global API
let api = window.kiwi = GlobalApi.singleton();

// Set the rendering mode in the global API
api.setRenderingMode('inline');

/**
 * RelayOS KiwiIRC Inline Chat
 *
 * This class provides the API for embedding the RelayOS KiwiIRC inline chat in any website.
 */
class RelayOSInline {
    /**
     * Create a new RelayOS KiwiIRC inline chat
     * @param {Object} options - Inline chat configuration options
     */
    constructor(options = {}) {
        this.options = {
            title: options.title || 'RelayOS IRC',
            container: options.container || null,
            server: options.server || null,
            channel: options.channel || null,
            theme: options.theme || null,
            showSettings: options.showSettings !== undefined ? options.showSettings : true,
            showChannelList: options.showChannelList !== undefined ? options.showChannelList : true,
            onConnect: options.onConnect || null,
            onDisconnect: options.onDisconnect || null,
            onMessage: options.onMessage || null,
        };

        this.app = null;
        this.state = getState();
        this.initialized = false;

        // Initialize the inline chat
        this.init();
    }

    /**
     * Initialize the inline chat
     * @private
     */
    async init() {
        try {
            // Load configuration
            await this.loadConfig();

            // Create the container
            this.createContainer();

            // Initialize the theme
            this.initTheme();

            // Mount the Vue app
            this.mountApp();

            // Connect to the IRC server
            if (this.options.server) {
                this.connect();
            }

            this.initialized = true;
            log.info('Inline chat initialized');
        } catch (error) {
            log.error('Error initializing inline chat:', error);
        }
    }

    /**
     * Load the inline chat configuration
     * @private
     */
    async loadConfig() {
        let configFile = 'static/inline-config.json';
        let configObj = null;

        // Check for a meta tag with configuration
        if (document.querySelector('meta[name="kiwiconfig"]')) {
            configFile = document.querySelector('meta[name="kiwiconfig"]').content;
        }

        // Check for a script tag with configuration
        if (document.querySelector('script[name="kiwiconfig"]')) {
            try {
                configObj = JSON5.parse(document.querySelector('script[name="kiwiconfig"]').innerHTML);
            } catch (error) {
                log.error('Error parsing config from script tag:', error);
            }
        }

        // Create a config loader
        let configLoader = new ConfigLoader();
        configLoader
            .addValueReplacement('protocol', window.location.protocol)
            .addValueReplacement('wsprotocol', window.location.protocol === 'https:' ? 'wss:' : 'ws:')
            .addValueReplacement('tls', window.location.protocol === 'https:')
            .addValueReplacement('hostname', window.location.hostname)
            .addValueReplacement('host', window.location.host)
            .addValueReplacement('port', window.location.port || (
                window.location.protocol === 'https:' ?
                    443 :
                    80
            ))
            .addValueReplacement('hash', (window.location.hash || '').substr(1))
            .addValueReplacement('query', (window.location.search || '').substr(1))
            .addValueReplacement('referrer', window.document.referrer);

        // Load the configuration
        let config = configObj ?
            await configLoader.loadFromObj(configObj) :
            await configLoader.loadFromUrl(configFile);

        // Load host-specific configuration
        config = await loadHostConfig(config);

        // Apply the configuration to the state
        Misc.dedotObject(config);
        this.applyConfig(config);

        // Override with options passed to the constructor
        if (this.options.server) {
            this.state.settings.startupOptions.server = this.options.server;
        }

        if (this.options.channel) {
            this.state.settings.startupOptions.channel = this.options.channel;
        }

        if (this.options.theme) {
            this.state.settings.theme = this.options.theme;
        }
    }

    /**
     * Apply the configuration to the state
     * @param {Object} config - The configuration object
     * @private
     */
    applyConfig(config) {
        // Recursively merge an object onto another via Vue.$set
        function applyConfigObj(obj, target) {
            _.each(obj, (val, key) => {
                if (typeof val === 'object') {
                    if (typeof target[key] !== 'object') {
                        Vue.set(target, key, _.isArray(val) ? [] : {});
                    }
                    applyConfigObj(val, target[key]);
                } else {
                    Vue.set(target, key, val);
                }
            });
        }

        applyConfigObj(config, this.state.settings);
    }

    /**
     * Create the container
     * @private
     */
    createContainer() {
        // If a container is specified, use it
        if (this.options.container) {
            if (typeof this.options.container === 'string') {
                this.container = document.querySelector(this.options.container);
            } else {
                this.container = this.options.container;
            }

            if (!this.container) {
                throw new Error(`Container not found: ${this.options.container}`);
            }
        } else {
            // Create a new container
            this.container = document.createElement('div');
            this.container.id = 'relayos-inline-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Initialize the theme
     * @private
     */
    initTheme() {
        let themeMgr = ThemeManager.instance(this.state);
        api.setThemeManager(themeMgr);
    }

    /**
     * Mount the Vue app
     * @private
     */
    mountApp() {
        const self = this;

        // Create the Vue app
        this.app = new Vue({
            el: this.container,
            data() {
                return {
                    title: self.options.title,
                    showSettings: self.options.showSettings,
                    showChannelList: self.options.showChannelList,
                };
            },
            computed: {
                $state() {
                    return getState();
                },
            },
            methods: {
                onToggleSettings(isOpen) {
                    log.info('Settings toggled:', isOpen);
                },
            },
            render(h) {
                return h(InlineContainer, {
                    props: {
                        title: this.title,
                        showSettings: this.showSettings,
                    },
                    on: {
                        'toggle-settings': this.onToggleSettings,
                    },
                }, [
                    h('div', { class: 'kiwi-inline-layout' }, [
                        this.showChannelList ? h('div', { class: 'kiwi-inline-sidebar' }, [
                            h(StateBrowser),
                        ]) : null,
                        h('div', { class: 'kiwi-inline-main' }, [
                            h(MessageList),
                            h(ControlInput),
                        ]),
                    ]),
                ]);
            },
        });

        // Make the app instance available via the API
        api.setVueInstance(this.app);

        // Add inline-specific styles
        this.addInlineStyles();
    }

    /**
     * Add inline-specific styles
     * @private
     */
    addInlineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .kiwi-inline-layout {
                display: flex;
                height: 100%;
                width: 100%;
            }

            .kiwi-inline-sidebar {
                width: 200px;
                border-right: 1px solid #e0e0e0;
                overflow-y: auto;
            }

            .kiwi-inline-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Connect to the IRC server
     * @public
     */
    connect() {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet, connection deferred');
            return;
        }

        // TODO: Implement connection logic
        log.info('Connecting to IRC server');

        if (this.options.onConnect) {
            this.options.onConnect();
        }
    }

    /**
     * Disconnect from the IRC server
     * @public
     */
    disconnect() {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return;
        }

        // TODO: Implement disconnection logic
        log.info('Disconnecting from IRC server');

        if (this.options.onDisconnect) {
            this.options.onDisconnect();
        }
    }

    /**
     * Send a message to the current channel
     * @param {string} message - The message to send
     * @public
     */
    sendMessage(message) {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return;
        }

        // TODO: Implement message sending logic
        log.info('Sending message:', message);
    }

    /**
     * Join a channel
     * @param {string} channel - The channel to join
     * @public
     */
    joinChannel(channel) {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return;
        }

        // TODO: Implement channel joining logic
        log.info('Joining channel:', channel);
    }

    /**
     * Leave a channel
     * @param {string} channel - The channel to leave
     * @public
     */
    leaveChannel(channel) {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return;
        }

        // TODO: Implement channel leaving logic
        log.info('Leaving channel:', channel);
    }

    /**
     * Set the theme
     * @param {string} theme - The theme name
     * @public
     */
    setTheme(theme) {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return;
        }

        api.getThemeManager().setTheme(theme);
    }

    /**
     * Get the current theme
     * @returns {string} - The current theme name
     * @public
     */
    getTheme() {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return null;
        }

        return api.getThemeManager().getCurrentTheme();
    }

    /**
     * Get the available themes
     * @returns {Array} - The available themes
     * @public
     */
    getAvailableThemes() {
        if (!this.initialized) {
            log.warn('Inline chat not initialized yet');
            return [];
        }

        return api.getThemeManager().getAvailableThemes();
    }
}

// Create a global RelayOSInline constructor
window.RelayOSInline = RelayOSInline;

// Auto-initialize if the data-auto-init attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const scriptTag = document.querySelector('script[data-relayos-inline]');
    if (scriptTag && scriptTag.getAttribute('data-auto-init') !== 'false') {
        // Parse options from data attributes
        const options = {};
        Array.from(scriptTag.attributes).forEach((attr) => {
            if (attr.name.startsWith('data-')) {
                const optionName = attr.name.replace('data-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                if (optionName !== 'relayosInline' && optionName !== 'autoInit') {
                    options[optionName] = attr.value;
                }
            }
        });

        // Create the inline chat
        return new RelayOSInline(options);
    }
    return null;
});

export default RelayOSInline;
