# Multi-Theme Architecture

This directory contains the multi-theme system that allows for dynamic theming with style, component, and page-level overrides.

## Overview

The multi-theme architecture enables you to:
- **Style-level overrides**: Inject CSS variables to customize colors, spacing, typography, etc.
- **Component-level overrides**: Replace specific components with themed versions
- **Page-level overrides**: Replace entire pages with custom implementations
- **Automatic fallback**: If a theme doesn't provide an override, the base implementation is used

## Directory Structure

```
src/themes/
├── types.ts                    # TypeScript interfaces
├── theme-loader.ts             # Dynamic import utilities
├── README.md                   # This file
└── [theme-name]/              # Individual theme folders
    ├── theme.config.ts        # Theme configuration
    ├── styles/
    │   └── variables.css      # CSS custom properties
    ├── pages/
    │   └── HomePage.tsx       # Page overrides
    └── components/
        └── Component.tsx      # Component overrides
```

## How It Works

### 1. Theme Selection

Themes are selected via `localStorage` with the key `selectedTheme`:

```javascript
// Activate a theme
localStorage.setItem('selectedTheme', 'example');

// Deactivate (use base theme)
localStorage.removeItem('selectedTheme');

// Then refresh the page
```

### 2. Theme Loading

When the app loads:
1. `MultiThemeProvider` reads the theme name from localStorage
2. Dynamically imports the theme configuration
3. Injects CSS variables into the document root
4. Makes theme config available via `useTheme()` hook

### 3. Override Resolution

**Page-level override:**
```tsx
// In your page file
import { withThemeOverride } from '@/contexts/theme';

function HomePage() {
  return <div>Base Home Page</div>;
}

export default withThemeOverride('HomePage', HomePage);
```

**Component-level override:**
```tsx
// In your component
import { useThemeComponent } from '@/contexts/theme';
import { BaseComponent } from './BaseComponent';

function MyPage() {
  const ThemedComponent = useThemeComponent('MyComponent', BaseComponent);
  return <ThemedComponent />;
}
```

## Creating a New Theme

### Step 1: Create Theme Folder

```bash
src/themes/
└── my-theme/
    ├── theme.config.ts
    ├── styles/
    ├── pages/
    └── components/
```

### Step 2: Create Theme Configuration

```typescript
// src/themes/my-theme/theme.config.ts
import { ThemeConfig } from '../types';

const myThemeConfig: ThemeConfig = {
  name: 'my-theme',
  
  styles: {
    cssVariables: {
      '--theme-primary-color': '#ff6b6b',
      '--theme-bg-primary': '#ffffff',
      // ... more variables
    },
  },
  
  pages: {
    // HomePage: MyCustomHomePage,
  },
  
  components: {
    // HomePageComponent: MyCustomComponent,
  },
};

export default myThemeConfig;
```

### Step 3: Create Overrides (Optional)

**Page Override:**
```tsx
// src/themes/my-theme/pages/HomePage.tsx
export default function MyHomePage() {
  return (
    <div style={{ color: 'var(--theme-primary-color)' }}>
      My Themed Home Page
    </div>
  );
}
```

**Component Override:**
```tsx
// src/themes/my-theme/components/MyComponent.tsx
export default function MyThemedComponent(props) {
  return (
    <div style={{ backgroundColor: 'var(--theme-bg-primary)' }}>
      Themed Component
    </div>
  );
}
```

### Step 4: Register in Theme Config

```typescript
import MyHomePage from './pages/HomePage';
import MyThemedComponent from './components/MyComponent';

const myThemeConfig: ThemeConfig = {
  // ...
  pages: {
    HomePage: MyHomePage,
  },
  components: {
    MyComponent: MyThemedComponent,
  },
};
```

## Testing Your Theme

### Method 1: Browser Console
```javascript
localStorage.setItem('selectedTheme', 'my-theme');
location.reload();
```

### Method 2: React DevTools
1. Open React DevTools
2. Find `MultiThemeProvider` in the component tree
3. Use the `setTheme` function from context

### Method 3: Programmatically
```tsx
import { useTheme } from '@/contexts/theme';

function ThemeSwitcher() {
  const { setTheme, currentTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('my-theme')}>
      Switch to My Theme
    </button>
  );
}
```

## Example Theme

An example theme is provided at `src/themes/example/` to demonstrate:
- CSS variable definition and usage
- Page-level override (HomePage)
- Component-level override (HomePageComponent)

To test it:
```javascript
localStorage.setItem('selectedTheme', 'example');
location.reload();
```

## CSS Variables

All CSS variables should be prefixed with `--theme-` for consistency:

```css
/* Good */
--theme-primary-color: #6366f1;
--theme-spacing-md: 16px;

/* Avoid */
--primary-color: #6366f1;
--spacing: 16px;
```

Use them in your styled components:
```tsx
<div style={{
  color: 'var(--theme-primary-color, #000)', // Fallback value
  padding: 'var(--theme-spacing-md, 16px)',
}}>
  Content
</div>
```

## API Reference

### `useTheme()`
Hook to access theme context.

```tsx
const {
  currentTheme,      // string | null - current theme name
  themeConfig,       // ThemeConfig | null - loaded config
  isLoading,         // boolean - loading state
  getPageOverride,   // (name: string) => Component | null
  getComponentOverride, // (name: string) => Component | null
  setTheme,          // (name: string | null) => void
} = useTheme();
```

### `withThemeOverride(pageName, BaseComponent)`
HOC for page-level overrides.

```tsx
const ThemedPage = withThemeOverride('MyPage', BasePage);
```

### `useThemeComponent(componentName, BaseComponent)`
Hook for component-level overrides.

```tsx
const ThemedComponent = useThemeComponent('MyComponent', BaseComponent);
```

## Best Practices

1. **Always provide fallbacks**: Use CSS variable fallbacks for base theme compatibility
2. **Keep naming consistent**: Use descriptive names for page/component overrides
3. **Test both states**: Test with theme active AND with base theme
4. **Document your theme**: Add comments explaining custom variables and overrides
5. **Minimal overrides**: Only override what's necessary; leverage base components when possible
6. **Type safety**: Import prop types from base components for override components

## Troubleshooting

**Theme not loading?**
- Check browser console for errors
- Verify theme folder name matches localStorage value
- Ensure `theme.config.ts` has default export

**CSS variables not applying?**
- Check variable names start with `--`
- Verify they're in the `cssVariables` object in theme config
- Use browser DevTools to inspect document root styles

**Component override not working?**
- Ensure component is wrapped with `useThemeComponent` or `withThemeOverride`
- Check that override component is registered in theme config
- Verify component name matches exactly (case-sensitive)

## Future Enhancements

Potential additions to the system:
- Theme previewing without page reload
- Visual theme builder/editor
- Theme inheritance (extend base themes)
- Runtime theme switching with animations
- Per-route theme overrides
- Theme marketplace/sharing

