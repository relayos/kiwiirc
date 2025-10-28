# Entry Points

This directory contains the entry points for the different rendering modes of the RelayOS KiwiIRC client.

## Entry Points

- **widget.js**: Entry point for the widget mode (floating "Intercom-style" chat widget)
- **inline.js**: Entry point for the inline mode (embedded chat interface)

## Widget Mode

The widget mode is a floating "Intercom-style" chat widget that can be embedded in any website. It provides a minimized state that shows a chat icon, and an expanded state that shows the full chat interface.

### Usage

```html
<script src="https://example.com/widget/widget.js" data-relayos-widget data-auto-init="true"></script>
```

See the [Widget Components README](../components/widget/README.md) for more information.

## Inline Mode

The inline mode is an embedded chat interface that can be placed within a container on any webpage. It provides a full chat interface with optional channel list and settings.

### Usage

```html
<div id="relayos-chat-container" style="width: 100%; height: 500px;"></div>
<script src="https://example.com/inline/inline.js" data-relayos-inline data-auto-init="true" data-container="#relayos-chat-container"></script>
```

See the [Inline Components README](../components/inline/README.md) for more information.

## Host-specific Configuration

Both entry points support host-specific configuration. The configuration is loaded from the `config.json.d` directory based on the current hostname. See the [Config JSON.D README](../config/config.json.d/README.md) for more information.

## Build Process

The entry points are built using webpack. The build process is configured in the `vue.config.js` file in the root of the project. The build process creates separate bundles for each entry point, which can be served by a web server.

### Building the Entry Points

```bash
# Build all entry points
yarn build

# Build a specific entry point
yarn build --entry widget
yarn build --entry inline
```

## Deployment

The built entry points are deployed to the `dist` directory. The files can be served by a web server such as nginx. The following files are created:

- `dist/widget/widget.js`: The widget entry point
- `dist/inline/inline.js`: The inline entry point

## Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    # Serve the widget entry point
    location /widget/ {
        alias /path/to/dist/widget/;
        try_files $uri $uri/ =404;
    }

    # Serve the inline entry point
    location /inline/ {
        alias /path/to/dist/inline/;
        try_files $uri $uri/ =404;
    }

    # Serve the static files
    location /static/ {
        alias /path/to/dist/static/;
        try_files $uri $uri/ =404;
    }

    # Serve the config.json.d directory
    location /static/config.json.d/ {
        alias /path/to/dist/static/config.json.d/;
        try_files $uri $uri/ =404;
    }

    # Proxy WebSocket connections to the WebIRC Gateway
    location /webirc/websocket/ {
        proxy_pass http://webircgateway:7778/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400; # 24 hours
    }
}
