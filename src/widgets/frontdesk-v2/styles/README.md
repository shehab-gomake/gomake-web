# FrontDesk V2 - Styling System

Centralized styling system following best practices for maintainability and reusability.

## Structure

```
styles/
├── theme.ts           # Theme constants (colors, spacing, typography)
├── layout.styles.ts   # Styled components for layout panels
├── utils.ts          # Utility functions for common styles
└── index.ts          # Centralized exports
```

## Usage

### Using Theme Constants

```typescript
import { frontdeskV2Theme } from "@/widgets/frontdesk-v2/styles";

const MyComponent = () => {
  return (
    <Box sx={{ 
      backgroundColor: frontdeskV2Theme.colors.background.secondary,
      padding: frontdeskV2Theme.spacing[4],
      color: frontdeskV2Theme.colors.text.primary
    }}>
      Content
    </Box>
  );
};
```

### Using Styled Components

```typescript
import { LeftSidebarContainer, Panel } from "@/widgets/frontdesk-v2/styles";

// Predefined panel
const MySidebar = () => (
  <LeftSidebarContainer>
    Content
  </LeftSidebarContainer>
);

// Custom panel with props
const CustomPanel = () => (
  <Panel width={300} backgroundColor="#ff0000" borderRight>
    Content
  </Panel>
);
```

### Using Style Utilities

```typescript
import { flexContainer, scrollableContainer, clickable, textTruncate } from "@/widgets/frontdesk-v2/styles/utils";

const MyComponent = () => {
  return (
    <Box sx={{
      ...flexContainer("column"),
      ...scrollableContainer("vertical"),
      ...clickable(),
    }}>
      <Typography sx={textTruncate(2)}>
        Long text that will truncate...
      </Typography>
    </Box>
  );
};
```

### Using Theme Hook

```typescript
import { useFrontdeskTheme } from "@/widgets/frontdesk-v2/hooks/use-frontdesk-theme";

const MyComponent = () => {
  const theme = useFrontdeskTheme();
  
  return (
    <Box sx={{ 
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.base
    }}>
      Content
    </Box>
  );
};
```

## Best Practices

1. **Always use theme constants** - Never hardcode colors or spacing values
2. **Use styled components** - For reusable UI elements with consistent styling
3. **Use style utilities** - For common patterns (flex, scroll, hover effects)
4. **Keep styles close to components** - Use `sx` prop for component-specific styles
5. **Import from centralized exports** - Always import from `@/widgets/frontdesk-v2/styles`

## Available Theme Constants

- `colors.background.*` - Background colors (primary, secondary, tertiary, hover)
- `colors.text.*` - Text colors (primary, secondary, tertiary)
- `colors.border.*` - Border colors (default, strong)
- `colors.brand.*` - Brand colors (primary, secondary)
- `colors.status.*` - Status colors (online, away, offline)
- `colors.priority.*` - Priority colors (low, normal, high, urgent)
- `colors.platform.*` - Platform colors (email, whatsapp, facebook, sms)
- `spacing.*` - Spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10)
- `typography.*` - Typography settings (fontFamily, fontSize, fontWeight)
- `layout.*` - Layout dimensions (leftSidebarWidth, middlePanelWidth, rightSidebarWidth)
- `transitions.*` - Transition timings (default, fast, slow)

## Available Styled Components

- `LayoutContainer` - Main app container
- `LeftSidebarContainer` - Left navigation sidebar (240px)
- `MiddlePanelContainer` - Middle conversation list (380px)
- `CenterPanelContainer` - Center message thread (flex-1)
- `RightSidebarContainer` - Right contact details (340px)
- `Panel` - Generic panel component with configurable props

## Available Style Utilities

- `getSpacing(multiplier)` - Get spacing value
- `getColor(path)` - Get color value by path (e.g., "background.primary")
- `flexContainer(direction)` - Create flex container styles
- `scrollableContainer(direction)` - Create scrollable container styles
- `hoverEffect()` - Add hover effect styles
- `clickable()` - Make element clickable with hover
- `border(side)` - Add border styles
- `textTruncate(lines)` - Truncate text with ellipsis

