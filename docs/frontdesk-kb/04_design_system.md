# FrontDesk Design System

The FrontDesk Design System is a comprehensive, type-safe system for building a consistent UI across all providers. It is located in `src/widgets/frontdesk/design-system/`.

## 1. Goals

-   **Consistency**: A unified visual language across all providers.
-   **Reusability**: DRY principles with shared, composable components.
-   **Type Safety**: Full TypeScript support with strict typing.
-   **Performance**: Optimized components with proper memoization.
-   **Accessibility**: WCAG 2.1 AA compliant components.

## 2. System Architecture

```
design-system/
├── tokens/              # Design tokens (colors, spacing, typography, etc.)
├── primitives/          # Base components (Button, Input, Avatar, etc.)
├── compounds/           # Complex components (ListItem, Panel, etc.)
├── layouts/             # Layout components (ThreeColumnLayout, etc.)
├── theme.ts             # MUI theme configuration
└── index.ts             # Main export
```

## 3. Design Tokens

Design tokens are the single source of truth for all styling.

-   **Colors**: Based on the Tailwind CSS color palette with semantic mappings (e.g., `colorTokens.semantic.text.primary`).
-   **Spacing**: A 4px base unit system (e.g., `spacingTokens[4]` for `16px`).
-   **Typography**: A full typography system with font sizes, weights, and semantic styles.
-   **Shadows**: An elevation system for shadows and focus rings.

## 4. Primitive Components

These are the basic building blocks of the UI.

-   **Avatar**: User avatars with presence indicators, badges, and automatic color generation.
-   **Badge**: For notification counts, unread status, and more. Includes specialized badges like `PriorityBadge`, `TicketTypeBadge`, and `ChannelBadge`.
-   **Button**: A flexible button component with variants, sizes, and icon support. Includes `IconButton` and `QuickActionButton`.
-   **Chip**: For tags, filters, and status indicators.
-   **Input**: Includes `SearchInput` and `TextInput` with consistent styling and error handling.

## 5. Compound Components

These components are built from primitives and handle more complex UI patterns.

-   **ConversationListItem**: A universal list item for all conversation types (Email, DM, WhatsApp, Tickets).
-   **TicketListItem**: A specialized list item for tickets and tasks.
-   **Panel**: A container component with a consistent structure for headers and content.
-   **EmptyState**: A standardized component for displaying empty states.
-   **MessageCard**: A unified component for displaying messages from different channels (Email, WhatsApp, SMS, etc.) with channel-specific styling.
-   **AttachmentCard**: For displaying file attachments with previews and actions.
-   **QuickActionMenu**: A dropdown menu for context-aware quick actions.

## 6. Layout Components

-   **ThreeColumnLayout**: The standardized layout for all FrontDesk provider views.
-   **NavigationColumn**: The left sidebar for channel navigation.
-   **ListColumn**: The middle panel for conversation or ticket lists.
-   **ContentColumn**: The right panel for the main content area.

For a complete list of components and their props, please refer to the [Design System README](/src/widgets/frontdesk/design-system/README.md).