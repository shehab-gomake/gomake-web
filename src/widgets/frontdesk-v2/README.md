# FrontDesk V2 - Next Generation Messaging Hub

## Overview

FrontDesk V2 is a complete redesign of the messaging hub with a modern, light theme and a fully reusable component architecture.

## Key Features

✅ **Light Theme** - Clean, modern design with excellent readability  
✅ **Modular Components** - Reusable UI primitives and navigation components  
✅ **TypeScript First** - Fully typed with comprehensive interfaces  
✅ **Theme System** - Centralized design tokens for consistency  
✅ **Composable Architecture** - Build complex UIs from simple building blocks  
✅ **Accessibility** - ARIA labels and keyboard navigation support  

## Quick Start

### Using the Navigation Sidebar

```tsx
import { NavigationSidebar } from "@/widgets/frontdesk-v2/navigation";

function App() {
  return (
    <NavigationSidebar
      selectedChannel="email"
      channelBadges={{ email: 5 }}
      onChannelSelect={(channel) => console.log(channel)}
    />
  );
}
```

### Using Individual Components

```tsx
import { Badge, IconButton, Tooltip } from "@/widgets/frontdesk-v2/components";
import { NavItem, NavTree } from "@/widgets/frontdesk-v2/navigation";

// Badge with icon
<Badge count={5} variant="error">
  <EmailIcon />
</Badge>

// Icon button with tooltip
<Tooltip title="Settings">
  <IconButton onClick={handleClick}>
    <SettingsIcon />
  </IconButton>
</Tooltip>

// Navigation item
<NavItem
  id="inbox"
  label="Inbox"
  icon={<InboxIcon />}
  badge={5}
  isSelected={true}
  onClick={handleClick}
/>
```

## Project Structure

```
frontdesk-v2/
├── components/              # Reusable UI components
│   ├── ui/                 # Primitives (Badge, Button, Tooltip, etc.)
│   └── index.ts            # Component exports
├── conversations/          # Conversation list components
│   └── list/
├── layouts/                # Layout components
│   └── three-column/       # Three-column layout system
├── navigation/             # Navigation components
│   ├── nav-tree/          # Tree-based navigation (NavItem, NavSection, NavTree)
│   ├── navigation-sidebar.tsx  # Complete sidebar
│   └── NAVIGATION_GUIDE.md     # Navigation documentation
├── styles/                 # Theme and styling
│   ├── theme.ts           # Theme configuration
│   ├── utils.ts           # Style utilities
│   └── layout.styles.ts   # Layout styled components
└── README.md              # This file
```

## Component Library

### UI Primitives
- **Badge** - Notification badges with variants
- **IconButton** - Clickable icon buttons
- **Tooltip** - Hover tooltips
- **Divider** - Visual separators
- **Avatar** - User avatars (placeholder)
- **Dropdown** - Dropdown menus (placeholder)
- **Tag** - Content tags (placeholder)

### Navigation Components
- **NavItem** - Single navigation item with icon and badge
- **NavSection** - Collapsible group of navigation items
- **NavTree** - Complete navigation tree
- **NavigationSidebar** - Full-featured navigation sidebar

### Layout Components
- **ThreeColumnLayout** - Three-column messaging layout
- **LeftSidebar** - Navigation sidebar container
- **MiddlePanel** - Conversation list panel
- **CenterPanel** - Message thread panel
- **RightSidebar** - Contact details panel

## Theme System

The v2 theme provides:

- **Colors**: Semantic color system with light theme
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (4px base)
- **Shadows**: Elevation system
- **Layout**: Width constants for panels
- **Transitions**: Animation timing functions

Access via:
```tsx
import { frontdeskV2Theme } from "@/widgets/frontdesk-v2/styles";

frontdeskV2Theme.colors.brand.primary    // "#2563eb"
frontdeskV2Theme.spacing[4]              // "16px"
frontdeskV2Theme.typography.fontSize.sm  // "13px"
```

## Documentation

- **[Navigation Guide](./navigation/NAVIGATION_GUIDE.md)** - Complete navigation system documentation
- **[Theme Reference](./styles/theme.ts)** - Theme configuration and tokens

## Examples

### Custom Navigation

```tsx
import { NavTree } from "@/widgets/frontdesk-v2/navigation";
import { frontdeskV2Theme } from "@/widgets/frontdesk-v2/styles";

const sections = [
  {
    id: "tickets",
    label: "Support Tickets",
    items: [
      {
        id: "open",
        label: "Open Tickets",
        icon: <InboxIcon />,
        badge: 12,
        badgeVariant: "error"
      },
      {
        id: "closed",
        label: "Closed Tickets",
        icon: <CheckIcon />
      }
    ]
  }
];

<NavTree
  sections={sections}
  selectedItemId="open"
  onItemClick={(id) => navigate(id)}
/>
```

### Custom Sidebar with Collapse

```tsx
import { useState } from "react";
import { NavigationSidebar } from "@/widgets/frontdesk-v2/navigation";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <NavigationSidebar
      isCollapsed={collapsed}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      selectedChannel="email"
      channelBadges={{
        email: 5,
        whatsapp: 2,
        internal: 3
      }}
      onChannelSelect={(channel) => {
        console.log("Selected:", channel);
      }}
    />
  );
}
```

## Design Principles

1. **Reusability** - Build once, use everywhere
2. **Composability** - Combine simple components for complex UIs
3. **Type Safety** - TypeScript for compile-time guarantees
4. **Consistency** - Use theme tokens for uniform styling
5. **Accessibility** - ARIA labels and semantic HTML
6. **Performance** - Optimized rendering with React best practices

## Migration Guide

### From FrontDesk v1

1. **Update imports**:
   ```tsx
   // Old
   import { NavigationSidebar } from "@/widgets/frontdesk/layouts/components";
   
   // New
   import { NavigationSidebar } from "@/widgets/frontdesk-v2/navigation";
   ```

2. **Use new theme**:
   ```tsx
   // Old
   import { useTheme } from "@mui/material/styles";
   const theme = useTheme();
   
   // New
   import { frontdeskV2Theme } from "@/widgets/frontdesk-v2/styles";
   ```

3. **Replace MUI components** with v2 components where available

4. **Update color references** to use light theme colors

## Contributing

When adding new components:

1. Follow the existing component structure
2. Use TypeScript with proper types
3. Reference `frontdeskV2Theme` for styling
4. Add documentation to component files
5. Update this README and navigation guide
6. Ensure accessibility (ARIA labels, keyboard support)

## Development

```bash
# Start dev server
npm run dev

# Access FrontDesk V2
http://localhost:3004/frontdesk/inbox

# Run linting
npm run lint

# Run tests
npm run test
```

## Status

- ✅ Theme system
- ✅ UI primitives (Badge, IconButton, Tooltip, Divider)
- ✅ Navigation components (NavItem, NavSection, NavTree)
- ✅ Navigation sidebar
- ✅ Layout system
- 🟡 Conversation components (in progress)
- 🟡 Message components (in progress)
- ⬜ Settings panel
- ⬜ Search functionality

## License

Part of the GoMake Web project.
