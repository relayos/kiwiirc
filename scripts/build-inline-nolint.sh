#!/bin/bash

# Script to build the inline component without linting
# This is useful when you want to build the inline component quickly without worrying about linting errors

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if vue.config.js.nolint exists
if [ ! -f "vue.config.js.nolint" ]; then
  echo "Error: vue.config.js.nolint not found. Please create it first."
  exit 1
fi

# Backup the original vue.config.js
echo "Backing up original vue.config.js..."
mv vue.config.js vue.config.js.original

# Use the no-lint version
echo "Using no-lint configuration..."
cp vue.config.js.nolint vue.config.js

# Build the inline component
echo "Building inline component without linting..."
yarn build:inline

# Restore the original vue.config.js
echo "Restoring original vue.config.js..."
mv vue.config.js.original vue.config.js

echo "Inline component build completed successfully!"
