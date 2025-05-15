# Host-specific Configuration Directory

This directory contains host-specific configurations for the RelayOS KiwiIRC client. Each subdirectory corresponds to a hostname, and contains a `config.json` file with the configuration for that hostname.

## Directory Structure

```
config.json.d/
├── default/
│   └── config.json       # Default configuration used when no host-specific configuration is found
├── localhost/
│   └── config.json       # Configuration for localhost
├── example.com/
│   └── config.json       # Configuration for example.com
└── README.md             # This file
```

## Adding a New Host Configuration

To add a configuration for a new hostname:

1. Create a new directory with the hostname as the name (e.g., `mysite.com`)
2. Create a `config.json` file in the new directory
3. Add the host-specific configuration to the `config.json` file

Example:

```
mkdir -p config.json.d/mysite.com
touch config.json.d/mysite.com/config.json
```

Then edit `config.json.d/mysite.com/config.json` with your host-specific configuration.

## Configuration Format

The configuration file should be a valid JSON object with the following structure:

```json
{
    "theme": "RelayOS",
    "kiwiServer": "wss://mysite.com/webirc/websocket/",
    "startupOptions": {
        "server": "irc.mysite.com",
        "port": 6697,
        "tls": true,
        "direct": false,
        "channel": "#mysite",
        "nick": "mysite-user-?"
    },
    "logo": "/static/mysite.com/img/logo.png",
    "autoConnect": true,
    "bypassAuth": false,
    "defaultChannels": ["#mysite", "#help"],
    "showConnectionStatus": true,
    "debugMode": false,
    "windowTitle": "RelayOS IRC - MySite.com",
    "startupScreen": "personal",
    "restricted": false,
    "embedly": {
        "key": ""
    },
    "plugins": [
        { "name": "customise", "url": "static/plugins/customise.html" }
    ],
    "features": {
        "fileUploads": true,
        "notifications": true,
        "sounds": true,
        "embeds": true,
        "enableTabUnderOnClick": false
    },
    "ui": {
        "showUserList": true,
        "showHeader": true,
        "showChannelList": true
    },
    "buffers": {
        "messageLayout": "modern",
        "show_joinparts": false
    }
}
```

## How It Works

The RelayOS KiwiIRC client detects the current hostname and loads the appropriate configuration file from this directory. If no matching configuration is found, it falls back to the default configuration.

The configuration loading process is as follows:

1. Try to load the host-specific configuration from `config.json.d/<hostname>/config.json`
2. If not found, try to load the fallback configuration from `config.json.d/<hostname>.json` (legacy format)
3. If not found, try to load the default configuration from `config.json.d/default/config.json`
4. If not found, use the hardcoded default configuration

This allows for a flexible configuration system that can be easily extended to support new hostnames.
