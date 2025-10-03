# FrontDesk Three-Column Layout

## Overview
The FrontDesk messaging hub has been transformed from a two-column layout with tab-based navigation to a three-column layout with vertical channel navigation. This provides better navigation, multi-account support, and a unified view across all communication channels.

## Architecture

### Layout Structure
```
┌──────────┬────────────────┬──────────────────────────────┐
│   Nav    │   List Panel   │      Content Area            │
│  (100px) │    (380px)     │        (Flexible)            │
├──────────┼────────────────┼──────────────────────────────┤
│ Channels │ Conversations  │   Message Viewer/Settings    │
│ System   │ Search/Filter  │                              │
└──────────┴────────────────┴──────────────────────────────┘
```

### Key Components

#### 1. ThreeColumnLayout
- Location: `src/widgets/frontdesk/layouts/three-column/`
- Purpose: Main layout container with responsive columns
- Features:
  - Fixed width for navigation and list columns
  - Flexible content area
  - Independent scrolling
  - Responsive breakpoints

#### 2. NavigationSidebar
- Location: `src/widgets/frontdesk/layouts/components/NavigationSidebar/`
- Sections:
  - **Channels**: All, Email, WhatsApp, Internal
  - **System**: Inbox, Assigned, Admin, Settings
- Features:
  - Badge counts for unread messages
  - Visual selection indicators
  - Tooltips on hover

#### 3. DynamicListPanel
- Location: `src/widgets/frontdesk/layouts/components/DynamicListPanel/`
- Purpose: Context-aware list display
- Features:
  - Search functionality
  - Account selector (for multi-account providers)
  - Loading and error states
  - Dynamic title based on selection

#### 4. Provider System

##### Unified Provider
- Location: `src/widgets/frontdesk/providers/unified/`
- Features:
  - Aggregates conversations from all channels
  - Channel indicators (📧 💬 🏢)
  - Advanced filtering and sorting
  - Group by date
  - Priority management

##### Provider Registry
- Location: `src/widgets/frontdesk/providers/registry/`
- Purpose: Centralized provider management
- Features:
  - Lazy loading of providers
  - Provider configuration
  - Authentication requirements

##### Base Provider Architecture
- Location: `src/widgets/frontdesk/providers/base/`
- Components:
  - `provider.interface.ts`: Standard provider contract
  - `BaseProvider.tsx`: Abstract base class
- Features:
  - Multi-account support
  - Standardized methods
  - Event handling
  - Connection management

## State Management

### Recoil Atoms Structure
```
src/store/frontdesk/
├── atoms/
│   ├── navigation.atoms.ts    # Navigation state
│   ├── unified.atoms.ts       # Unified view state
│   ├── email.atoms.ts         # Email provider state
│   ├── whatsapp.atoms.ts      # WhatsApp provider state
│   └── internal.atoms.ts      # Internal chat state
└── selectors/
    ├── navigation.selectors.ts # Navigation computed values
    └── aggregation.selectors.ts # Cross-provider aggregation
```

### Key Atoms
- `selectedSectionAtom`: Current navigation section
- `selectedChannelAtom`: Current communication channel
- `unifiedConversationsAtom`: Aggregated conversations
- `emailAccountsAtom`: Connected email accounts
- `whatsappAccountsAtom`: Connected WhatsApp accounts

### Key Selectors
- `aggregatedConversationsSelector`: All conversations with filters
- `totalUnreadCountSelector`: Total unread across providers
- `unreadCountByProviderSelector`: Per-provider unread counts

## Usage

### Basic Implementation
```typescript
import { FrontdeskWidgetV2 } from '@/widgets/frontdesk/frontdesk-widget-v2';

function App() {
  return <FrontdeskWidgetV2 />;
}
```

### Using Navigation Controller
```typescript
import { useNavigationController } from '@/widgets/frontdesk/controllers/NavigationController';

function MyComponent() {
  const {
    currentSection,
    currentChannel,
    handleSectionChange,
    handleChannelChange
  } = useNavigationController();

  // Navigate to email channel
  handleChannelChange('email');
  
  // Navigate to settings
  handleSectionChange('settings');
}
```

### Adding a New Provider

1. Create provider directory structure:
```
providers/newprovider/
├── NewProvider.tsx
├── components/
├── hooks/
├── types/
└── utils/
```

2. Implement the IProvider interface:
```typescript
class NewProvider extends BaseProvider {
  readonly providerId = 'newprovider';
  readonly providerName = 'New Provider';
  // ... implement required methods
}
```

3. Register in ProviderRegistry:
```typescript
const providerRegistry = {
  // ...
  newprovider: {
    component: NewProvider,
    name: 'New Provider',
    requiresAuth: true
  }
};
```

## Migration Strategy

### Feature Flag Implementation
```typescript
const ENABLE_NEW_LAYOUT = process.env.NEXT_PUBLIC_NEW_FRONTDESK_LAYOUT === 'true';

export const FrontdeskWidget = ENABLE_NEW_LAYOUT 
  ? FrontdeskWidgetV2 
  : FrontdeskWidgetV1;
```

### Gradual Rollout
1. Deploy with feature flag disabled
2. Enable for internal testing
3. Enable for beta users (10%)
4. Monitor metrics and feedback
5. Full rollout (100%)
6. Remove old implementation

## Testing

### Component Tests
```bash
npm run test src/widgets/frontdesk/__tests__
```

### Key Test Areas
- Layout responsiveness
- Navigation state management
- Provider switching
- Message aggregation
- Multi-account handling
- Search and filtering

## Performance Considerations

### Optimizations Implemented
- Lazy loading of providers
- Virtualized conversation lists (for large datasets)
- Memoized selectors
- Debounced search
- Optimistic UI updates

### Bundle Size
- Providers are code-split and loaded on demand
- Shared components reduce duplication
- Tree-shaking friendly exports

## Future Enhancements

### Planned Features
- [ ] Drag-and-drop file attachments
- [ ] Rich text message composer
- [ ] Message templates
- [ ] Bulk actions
- [ ] Advanced search with filters
- [ ] Conversation tagging
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Mobile app support

### Provider Roadmap
- [ ] Slack integration
- [ ] Microsoft Teams
- [ ] Facebook Messenger
- [ ] Telegram
- [ ] SMS/Twilio

## Troubleshooting

### Common Issues

1. **Providers not loading**
   - Check ProviderRegistry configuration
   - Verify lazy import paths
   - Check console for loading errors

2. **State not syncing**
   - Verify Recoil atom keys are unique
   - Check selector dependencies
   - Use React DevTools to inspect state

3. **Navigation not working**
   - Verify router query parameters
   - Check NavigationController hooks
   - Ensure proper route structure

## Support

For questions or issues, please contact the FrontDesk team or create an issue in the repository.