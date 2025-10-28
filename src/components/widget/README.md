# Widget Components

This directory contains components for the RelayOS KiwiIRC widget mode. The widget mode is a floating "Intercom-style" chat widget that can be embedded in any website.

## Components

- **WidgetContainer.vue**: The main container component for the widget. It handles the minimized and expanded states of the widget, as well as positioning.

## Usage

The widget components are used by the widget entry point (`src/entry-points/widget.js`) to create the widget interface. The widget can be embedded in any website using a simple script tag:

```html
<script src="https://example.com/widget/widget.js" data-relayos-widget data-auto-init="true"></script>
```

Or it can be initialized programmatically:

```html
<script src="https://example.com/widget/widget.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new RelayOSWidget({
      title: 'Chat with us',
      position: 'bottom-right',
      initialState: 'minimized',
      server: 'irc.example.com',
      channel: '#help',
      theme: 'RelayOS'
    });
  });
</script>
```

## Configuration

The widget can be configured using data attributes on the script tag or by passing options to the constructor:

- **title**: The title of the widget (default: 'Chat with us')
- **position**: The position of the widget (default: 'bottom-right', options: 'bottom-right', 'bottom-left', 'top-right', 'top-left')
- **initialState**: The initial state of the widget (default: 'minimized', options: 'minimized', 'expanded')
- **server**: The IRC server to connect to (default: null)
- **channel**: The IRC channel to join (default: null)
- **theme**: The theme to use (default: null)
- **container**: The container element to mount the widget in (default: null, creates a new container)
- **onStateChange**: A callback function that is called when the widget state changes (default: null)
- **onConnect**: A callback function that is called when the widget connects to the IRC server (default: null)
- **onDisconnect**: A callback function that is called when the widget disconnects from the IRC server (default: null)
- **onMessage**: A callback function that is called when a message is received (default: null)

## API

The widget exposes the following API methods:

- **connect()**: Connect to the IRC server
- **disconnect()**: Disconnect from the IRC server
- **minimize()**: Minimize the widget
- **expand()**: Expand the widget
- **sendMessage(message)**: Send a message to the current channel
- **joinChannel(channel)**: Join a channel
- **leaveChannel(channel)**: Leave a channel
- **setTheme(theme)**: Set the theme
- **getTheme()**: Get the current theme
- **getAvailableThemes()**: Get the available themes

## Styling

The widget can be styled using CSS variables. The following variables are available:

```css
:root {
  --widget-primary-color: #2196F3;
  --widget-primary-text-color: #FFFFFF;
  --widget-background-color: #FFFFFF;
  --widget-text-color: rgba(0, 0, 0, 0.87);
  --widget-border-radius: 8px;
  --widget-box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  --widget-font-family: Arial, sans-serif;
}
```

## Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>RelayOS KiwiIRC Widget Example</title>
  <style>
    :root {
      --widget-primary-color: #FF4081;
      --widget-primary-text-color: #FFFFFF;
      --widget-background-color: #FFFFFF;
      --widget-text-color: rgba(0, 0, 0, 0.87);
      --widget-border-radius: 8px;
      --widget-box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      --widget-font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <h1>RelayOS KiwiIRC Widget Example</h1>
  <p>This page demonstrates the RelayOS KiwiIRC widget.</p>
  
  <script src="https://example.com/widget/widget.js" data-relayos-widget data-auto-init="true" data-title="Chat with us" data-position="bottom-right" data-initial-state="minimized"></script>
</body>
</html>
