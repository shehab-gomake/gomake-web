/**
 * FrontDesk Design System
 *
 * Complete design system for consistent UI across FrontDesk feature
 *
 * @example
 * ```tsx
 * import { tokens, Avatar, Button, ConversationListItem, ThreeColumnLayout } from '@/widgets/frontdesk/design-system';
 *
 * // Use tokens directly
 * const primaryColor = tokens.colors.primary[600];
 *
 * // Use primitive components
 * <Avatar name="John Doe" size="md" presence="online" />
 *
 * // Use compound components
 * <ConversationListItem
 *   title="Email Subject"
 *   participants={["user@email.com"]}
 *   snippet="Preview text..."
 *   timestamp="2 min ago"
 * />
 *
 * // Use layouts
 * <ThreeColumnLayout
 *   navigationContent={<Nav />}
 *   listContent={<List />}
 *   mainContent={<Content />}
 * />
 * ```
 */

// Tokens
export * from './tokens';

// Primitives
export * from './primitives';

// Compounds
export * from './compounds';

// Layouts
export * from './layouts';

// Utilities
export { default as themeConfig } from './theme';