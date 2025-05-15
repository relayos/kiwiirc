# SCSS-based Theme System

This directory contains the SCSS-based theme system for the RelayOS KiwiIRC client. Themes are maintained in SCSS format here and compiled to CSS in `static/themes/` during the build process.

## Directory Structure

```
themes/
├── base/                  # Base theme variables and mixins
│   ├── _variables.scss    # Base theme variables
│   └── _mixins.scss       # Theme mixins
├── default/               # Default theme
│   ├── theme.scss         # Default theme stylesheet
│   └── components/        # Component-specific styles
├── relayos/               # RelayOS theme
│   ├── theme.scss         # RelayOS theme stylesheet
│   └── components/        # Component-specific styles
└── README.md              # This file
```

## Theme System

The theme system is based on SCSS and uses variables and mixins to define the appearance of the client. The base theme defines the variables and mixins that are used by all themes, while the specific themes override these variables to create different looks.

### Base Theme

The base theme defines the variables and mixins that are used by all themes. These include:

- Colors (primary, secondary, background, text, etc.)
- Typography (font family, font size, line height, etc.)
- Spacing (padding, margin, etc.)
- Borders (width, radius, etc.)
- Shadows (box shadow, text shadow, etc.)
- Transitions (duration, timing function, etc.)

### Specific Themes

Specific themes override the base theme variables to create different looks. Each theme has its own directory with a `theme.scss` file that imports the base theme and overrides the variables as needed.

## Creating a New Theme

To create a new theme:

1. Create a new directory in the `themes` directory with the name of your theme (e.g., `mytheme`)
2. Create a `theme.scss` file in the new directory
3. Import the base theme variables and mixins
4. Override the variables as needed
5. Add component-specific styles in a `components` directory if needed

Example `theme.scss`:

```scss
// Import base theme variables and mixins
@import '../base/variables';
@import '../base/mixins';

// Override variables
$color-primary: #ff4081;
$color-primary-light: lighten($color-primary, 15%);
$color-primary-dark: darken($color-primary, 15%);
$color-primary-text: #ffffff;

$color-background: #f5f5f5;
$color-surface: #ffffff;
$color-text-primary: rgba(0, 0, 0, 0.87);

$font-family: 'Roboto', sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5;

// Add component-specific styles
@import 'components/message-list';
@import 'components/control-input';
```

## Using Themes

Themes are loaded at runtime based on the configuration. The theme can be specified in the configuration file or selected by the user in the settings.

### Configuration

```json
{
  "theme": "relayos",
  "themes": [
    { "name": "Default", "url": "static/themes/default" },
    { "name": "Dark", "url": "static/themes/dark" },
    { "name": "RelayOS", "url": "static/themes/relayos" }
  ]
}
```

### Host-specific Themes

The RelayOS KiwiIRC client supports host-specific themes. The theme can be specified in the host-specific configuration file:

```json
{
  "theme": "relayos",
  "themes": [
    { "name": "Default", "url": "static/themes/default" },
    { "name": "Dark", "url": "static/themes/dark" },
    { "name": "RelayOS", "url": "static/themes/relayos" }
  ]
}
```

### Runtime Theme Switching

The theme can be switched at runtime using the `ThemeManager`:

```javascript
import ThemeManager from '@/libs/ThemeManager';

// Get the theme manager instance
const themeMgr = ThemeManager.instance(getState());

// Set the theme
themeMgr.setTheme('relayos');

// Get the current theme
const currentTheme = themeMgr.getCurrentTheme();

// Get the available themes
const availableThemes = themeMgr.getAvailableThemes();
```

## Theme Migration

The RelayOS KiwiIRC client includes scripts to migrate from the old CSS-based theme system to the new SCSS-based theme system. The migration process is as follows:

1. Run the migration script to convert CSS themes to SCSS:
   ```bash
   yarn migrate-themes
   ```

2. This script will:
   - Read the CSS files from `static/themes`
   - Convert them to SCSS format
   - Save them to the appropriate directories in `src/themes`
   - Create a `_common.scss` file in `src/themes/base` with the common CSS

3. After migration, themes are maintained in SCSS format in `src/themes` and compiled to CSS during the build process.

## Building Themes

Themes are built as part of the build process. The SCSS files are compiled to CSS and included in the build output.

### Build Process

1. The SCSS files are compiled to CSS using the SCSS compiler:
   ```bash
   yarn build:themes
   ```

2. This script will:
   - Read the SCSS files from `src/themes`
   - Compile them to CSS
   - Save them to the appropriate directories in `static/themes`

3. The CSS files are loaded at runtime based on the configuration

### Build Output

The build output includes the following files:

- `dist/static/themes/default/theme.css`: Default theme stylesheet
- `dist/static/themes/relayos/theme.css`: RelayOS theme stylesheet
- `dist/static/themes/dark/theme.css`: Dark theme stylesheet
- etc.

## Customizing Themes

Themes can be customized by overriding the variables in the `theme.scss` file. The variables are defined in the base theme and can be overridden by specific themes.

### Variables

The following variables are available for customization:

- `$color-primary`: Primary color
- `$color-primary-light`: Lighter version of the primary color
- `$color-primary-dark`: Darker version of the primary color
- `$color-primary-text`: Text color on primary color background
- `$color-secondary`: Secondary color
- `$color-secondary-light`: Lighter version of the secondary color
- `$color-secondary-dark`: Darker version of the secondary color
- `$color-secondary-text`: Text color on secondary color background
- `$color-background`: Background color
- `$color-surface`: Surface color (cards, dialogs, etc.)
- `$color-text-primary`: Primary text color
- `$color-text-secondary`: Secondary text color
- `$color-text-disabled`: Disabled text color
- `$color-text-hint`: Hint text color
- `$font-family`: Font family
- `$font-size-base`: Base font size
- `$line-height-base`: Base line height
- `$border-radius`: Border radius
- `$border-width`: Border width
- `$box-shadow`: Box shadow
- `$transition-duration`: Transition duration
- `$transition-timing-function`: Transition timing function

### Example

```scss
// Override variables
$color-primary: #ff4081;
$color-primary-light: lighten($color-primary, 15%);
$color-primary-dark: darken($color-primary, 15%);
$color-primary-text: #ffffff;

$color-background: #f5f5f5;
$color-surface: #ffffff;
$color-text-primary: rgba(0, 0, 0, 0.87);

$font-family: 'Roboto', sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5;
