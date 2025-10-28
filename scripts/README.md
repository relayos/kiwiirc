# RelayOS KiwiIRC Scripts

This directory contains utility scripts for building, compiling, and managing the RelayOS KiwiIRC client.

## Build Scripts

### Standard Build Scripts

- `compile-themes.js` - Compiles all theme files from SCSS to CSS
- `migrate-themes.js` - Utility for migrating themes from older versions

### No-Lint Build Scripts

These scripts build components without running linting checks, which is useful for:
- Quick development iterations
- Building when you have linting errors you plan to fix later
- Environments where linting is not critical

#### Available No-Lint Scripts:

- `build-nolint.sh` - Builds the main application without linting
- `build-widget-nolint.sh` - Builds only the widget component without linting
- `build-inline-nolint.sh` - Builds only the inline component without linting
- `build-all-nolint.sh` - Builds all components (main, widget, and inline) without linting

## Usage

All scripts should be run from the project root directory:

```bash
# Standard build with linting
yarn build

# Build without linting
./scripts/build-nolint.sh

# Build specific components without linting
./scripts/build-widget-nolint.sh
./scripts/build-inline-nolint.sh

# Build all components without linting
./scripts/build-all-nolint.sh
```

## Requirements

- The no-lint build scripts require `vue.config.js.nolint` to exist in the project root
- All scripts assume they are being run from the project root directory

## Notes

- The no-lint scripts temporarily replace the standard `vue.config.js` with `vue.config.js.nolint` during the build process
- The original `vue.config.js` is automatically restored after the build completes
- If a build fails, you may need to manually restore the original `vue.config.js` file
