# RelayOS KiwiIRC Integration

This document provides an overview of the RelayOS KiwiIRC integration, including what has been implemented and what still needs to be done.

## Implemented Features

### Host-specific Configuration System

- Created a directory-based configuration system in `src/config/config.json.d/`
- Added host-specific configuration files for `localhost`, `example.com`, and a `default` fallback
- Implemented a host-config-loader utility to load the appropriate configuration based on the hostname

### Multiple Rendering Modes

- Created entry points for different rendering modes in `src/entry-points/`
  - `widget.js`: Entry point for the widget mode (floating "Intercom-style" chat widget)
  - `inline.js`: Entry point for the inline mode (embedded chat interface)
- Created components for different rendering modes:
  - `src/components/widget/WidgetContainer.vue`: Container component for the widget mode
  - `src/components/inline/InlineContainer.vue`: Container component for the inline mode
- Added comprehensive documentation in `RENDERING-MODES.md` explaining each mode and its use cases

### Theme System

- Implemented a migration path from CSS-based themes to SCSS-based themes:
  - Created a script to migrate existing CSS themes to SCSS format (`scripts/migrate-themes.js`)
  - Created a script to compile SCSS themes to CSS (`scripts/compile-themes.js`)
  - Added npm scripts for theme migration and compilation
- Enhanced the theme system with a more structured SCSS-based approach in `src/themes/`:
  - `base/_variables.scss`: Base theme variables
  - `base/_mixins.scss`: Theme mixins
  - `relayos/theme.scss`: RelayOS theme
- The compiled CSS themes are still served from `static/themes/` for backward compatibility
- Themes are now maintained in SCSS format in `src/themes/` and compiled to CSS during the build process

### Build System

- Updated `vue.config.js` to support multiple entry points
- Added scripts to `package.json` for building different entry points:
  - `build`: Build the main app
  - `build:widget`: Build the widget entry point
  - `build:inline`: Build the inline entry point
  - `build:all`: Build all entry points

### Documentation

- Added comprehensive documentation:
  - `src/config/config.json.d/README.md`: Documentation for the host-specific configuration system
  - `src/components/widget/README.md`: Documentation for the widget components
  - `src/components/inline/README.md`: Documentation for the inline components
  - `src/entry-points/README.md`: Documentation for the entry points
  - `src/themes/README.md`: Documentation for the theme system

## Remaining Tasks

### Core Implementation

- Implement the actual client code in the RelayOS KiwiIRC submodule
- Connect the widget and inline modes to the IRC server
- Implement the message sending and receiving functionality
- Implement the channel joining and leaving functionality
- Implement the user list functionality

### Theme System

- Create component-specific styles for the RelayOS theme
- Implement theme switching functionality
- Create additional themes (dark, light, etc.)

### Testing

- Test the widget mode on different websites
- Test the inline mode in different containers
- Test the host-specific configuration system with different hostnames
- Test the theme system with different themes

### Deployment

- Create a Docker image for the RelayOS KiwiIRC client
- Update the Docker Compose configuration to use the new image
- Configure Nginx to serve the static files and proxy WebSocket connections

## How to Build

To build the RelayOS KiwiIRC client, run the following commands:

```bash
# Install dependencies
yarn install

# Build all entry points
yarn build:all

# Or build specific entry points
yarn build        # Build the main app
yarn build:widget # Build the widget entry point
yarn build:inline # Build the inline entry point
```

## How to Run

To run the RelayOS KiwiIRC client in development mode, run the following commands:

```bash
# Run the main app
yarn dev

# Run the widget entry point
yarn dev:widget

# Run the inline entry point
yarn dev:inline
```

## How to Deploy

To deploy the RelayOS KiwiIRC client, follow these steps:

1. Build the client:
   ```bash
   yarn build:all
   ```

2. Copy the built files to the Nginx static files directory:
   ```bash
   cp -r dist/* /path/to/nginx/html/
   ```

3. Configure Nginx to serve the static files and proxy WebSocket connections:
   ```nginx
   server {
       listen 80;
       server_name example.com;

       # Serve the widget entry point
       location /widget/ {
           alias /path/to/nginx/html/widget/;
           try_files $uri $uri/ =404;
       }

       # Serve the inline entry point
       location /inline/ {
           alias /path/to/nginx/html/inline/;
           try_files $uri $uri/ =404;
       }

       # Serve the static files
       location /static/ {
           alias /path/to/nginx/html/static/;
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
   ```

4. Restart Nginx:
   ```bash
   nginx -s reload
   ```

## Conclusion

The RelayOS KiwiIRC integration provides a flexible and extensible IRC client with multiple rendering modes, host-specific theming, and improved embedding capabilities. The implementation is based on the original KiwiIRC client, enhanced with features from the fcz-widget project.

The next steps are to implement the actual client code, connect to the IRC server, and test the different rendering modes. Once these tasks are completed, the RelayOS KiwiIRC client will be ready for deployment.
