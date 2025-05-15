# RelayOS KiwiIRC Rendering Modes

This document explains the different rendering modes available in the RelayOS KiwiIRC client.

## App Mode

**Entry Point**: `src/main.js`

The "App" mode is the default, full-screen KiwiIRC client. This is the traditional web application that takes up the entire browser window and provides a complete IRC experience with all features available.

- **Use Case**: Dedicated IRC web client
- **Integration**: Typically accessed directly via a URL (e.g., `https://irc.example.com`)
- **Features**: Full feature set, including channel list, user list, settings, etc.
- **Build Command**: `yarn build`

## Inline Mode

**Entry Point**: `src/entry-points/inline.js`

The "Inline" mode is designed to be embedded within a webpage as a component. It can be full-width but still contained within a scrollable container on the page. This mode is ideal for integrating IRC functionality into an existing website without taking over the entire page.

- **Use Case**: Embedding IRC functionality within a webpage
- **Integration**: Can be embedded in a div, iframe, or other container element
- **Features**: Customizable UI elements (can show/hide channel list, settings, etc.)
- **Build Command**: `yarn build:inline`

Example HTML integration:

```html
<div id="chat-container" style="width: 100%; height: 500px;"></div>
<script src="https://example.com/inline/inline.js" data-relayos-inline data-auto-init="true" data-container="#chat-container"></script>
```

## Widget Mode

**Entry Point**: `src/entry-points/widget.js`

The "Widget" mode is a floating chat widget similar to customer support widgets like Intercom. It appears as a small button in the corner of the page that expands into a chat interface when clicked. This mode is ideal for providing IRC access as a supplementary feature on a website.

- **Use Case**: Adding IRC functionality to any website with minimal intrusion
- **Integration**: Added to a webpage with a simple script tag
- **Features**: Minimizable, draggable, customizable position
- **Build Command**: `yarn build:widget`

Example HTML integration:

```html
<script src="https://example.com/widget/widget.js" data-relayos-widget data-auto-init="true"></script>
```

## Comparison

| Feature | App Mode | Inline Mode | Widget Mode |
|---------|----------|-------------|------------|
| UI Footprint | Full screen | Container-bound | Floating widget |
| Default Position | Entire window | Within container | Corner of screen |
| State | Always visible | Always visible | Minimizable |
| Channel List | Always visible | Optional | Hidden when minimized |
| User List | Always visible | Optional | Hidden when minimized |
| Settings | Full access | Customizable | Limited access |
| Target Use Case | Dedicated IRC client | Embedded chat | Supplementary chat |

## Building All Modes

You can build all rendering modes at once using:

```bash
yarn build:all
```

This will create separate bundles for each mode in the `dist` directory.
