# Inline Components

This directory contains components for the RelayOS KiwiIRC inline mode. The inline mode is an embedded chat interface that can be placed within a container on any webpage.

## Components

- **InlineContainer.vue**: The main container component for the inline chat. It provides a header with a title and settings button, and a content area for the chat interface.

## Usage

The inline components are used by the inline entry point (`src/entry-points/inline.js`) to create the inline chat interface. The inline chat can be embedded in any website using a simple script tag:

```html
<div id="relayos-chat-container" style="width: 100%; height: 500px;"></div>
<script src="https://example.com/inline/inline.js" data-relayos-inline data-auto-init="true" data-container="#relayos-chat-container"></script>
```

Or it can be initialized programmatically:

```html
<div id="relayos-chat-container" style="width: 100%; height: 500px;"></div>
<script src="https://example.com/inline/inline.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new RelayOSInline({
      title: 'RelayOS IRC',
      container: '#relayos-chat-container',
      server: 'irc.example.com',
      channel: '#general',
      theme: 'RelayOS',
      showSettings: true,
      showChannelList: true
    });
  });
</script>
```

## Configuration

The inline chat can be configured using data attributes on the script tag or by passing options to the constructor:

- **title**: The title of the inline chat (default: 'RelayOS IRC')
- **container**: The container element to mount the inline chat in (required, can be a CSS selector or DOM element)
- **server**: The IRC server to connect to (default: null)
- **channel**: The IRC channel to join (default: null)
- **theme**: The theme to use (default: null)
- **showSettings**: Whether to show the settings button (default: true)
- **showChannelList**: Whether to show the channel list (default: true)
- **onConnect**: A callback function that is called when the inline chat connects to the IRC server (default: null)
- **onDisconnect**: A callback function that is called when the inline chat disconnects from the IRC server (default: null)
- **onMessage**: A callback function that is called when a message is received (default: null)

## API

The inline chat exposes the following API methods:

- **connect()**: Connect to the IRC server
- **disconnect()**: Disconnect from the IRC server
- **sendMessage(message)**: Send a message to the current channel
- **joinChannel(channel)**: Join a channel
- **leaveChannel(channel)**: Leave a channel
- **setTheme(theme)**: Set the theme
- **getTheme()**: Get the current theme
- **getAvailableThemes()**: Get the available themes

## Styling

The inline chat can be styled using CSS variables. The following variables are available:

```css
:root {
  --inline-primary-color: #2196F3;
  --inline-primary-text-color: #FFFFFF;
  --inline-background-color: #FFFFFF;
  --inline-text-color: rgba(0, 0, 0, 0.87);
  --inline-border-color: #e0e0e0;
  --inline-border-radius: 4px;
  --inline-font-family: Arial, sans-serif;
}
```

## Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>RelayOS KiwiIRC Inline Example</title>
  <style>
    :root {
      --inline-primary-color: #4CAF50;
      --inline-primary-text-color: #FFFFFF;
      --inline-background-color: #FFFFFF;
      --inline-text-color: rgba(0, 0, 0, 0.87);
      --inline-border-color: #e0e0e0;
      --inline-border-radius: 4px;
      --inline-font-family: Arial, sans-serif;
    }
    
    #chat-container {
      width: 100%;
      height: 500px;
      margin: 20px 0;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>RelayOS KiwiIRC Inline Example</h1>
  <p>This page demonstrates the RelayOS KiwiIRC inline chat.</p>
  
  <div id="chat-container"></div>
  
  <script src="https://example.com/inline/inline.js" data-relayos-inline data-auto-init="true" data-container="#chat-container" data-title="Chat Room" data-show-settings="true" data-show-channel-list="true"></script>
</body>
</html>
