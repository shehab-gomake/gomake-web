# Provider Registry

## Overview

The Provider Registry is a centralized system for registering, loading, and managing FrontDesk communication providers. It uses lazy loading to improve initial bundle size and provides a consistent interface for accessing providers throughout the application.

## File Structure

```
src/widgets/frontdesk/providers/registry/
└── ProviderRegistry.tsx              # Provider registry and wrapper component
```

## Purpose

The Provider Registry serves several key functions:

1. **Lazy Loading**: Dynamically imports provider components only when needed
2. **Centralized Configuration**: Single source of truth for available providers
3. **Consistent Loading States**: Standardized loading UI across all providers
4. **Type Safety**: TypeScript-enforced provider configurations
5. **Error Handling**: Graceful fallbacks for missing or errored providers

## Provider Configuration

### ProviderConfig Interface

```typescript
interface ProviderConfig {
  component: React.LazyExoticComponent<React.FC<any>>;
  name: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
}
```

**Properties:**
- `component`: Lazy-loaded React component for the provider
- `name`: Display name of the provider
- `icon`: Optional icon React element
- `requiresAuth`: Whether provider requires authentication

### Registered Providers

The registry currently supports four providers:

```typescript
const providerRegistry: Record<Channel, ProviderConfig> = {
  all: {
    component: UnifiedProvider,
    name: 'Unified Inbox',
    requiresAuth: false
  },
  email: {
    component: EmailProvider,
    name: 'Email',
    requiresAuth: true
  },
  whatsapp: {
    component: WhatsAppProvider,
    name: 'WhatsApp',
    requiresAuth: true
  },
  internal: {
    component: InternalProvider,
    name: 'Direct Messages',
    requiresAuth: false
  }
};
```

### Channel Type

The `Channel` type defines valid provider identifiers:

```typescript
type Channel = 'all' | 'email' | 'whatsapp' | 'internal' | 'tickets';
```

**Note:** The `tickets` provider is not yet registered in the current implementation but is defined in the type.

## Components

### ProviderWrapper

Main component for rendering providers with loading states and error handling.

**Location:** `ProviderRegistry.tsx`

**Props:**

```typescript
interface ProviderWrapperProps {
  channel: Channel;              // Which provider to render
  [key: string]: any;           // Additional props passed to provider
}
```

**Usage:**

```typescript
import { ProviderWrapper } from '@/widgets/frontdesk/providers/registry';

function FrontDeskView() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>('all');

  return (
    <ProviderWrapper
      channel={selectedChannel}
      customProp="value"
    />
  );
}
```

**Features:**

1. **Lazy Loading**: Uses React.Suspense to show loading state
2. **Error Boundaries**: Shows error UI if provider not found
3. **Props Forwarding**: Passes all additional props to provider component
4. **Loading UI**: Displays centered CircularProgress during load

**Implementation:**

```typescript
export const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ channel, ...props }) => {
  const config = providerRegistry[channel];

  if (!config) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <h2>Provider Not Found</h2>
        <p>The selected provider "{channel}" is not available.</p>
      </Box>
    );
  }

  const { component: Component } = config;

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};
```

## Utility Functions

The registry provides several utility functions for working with providers.

### getProvider

Retrieve full provider configuration by channel.

```typescript
export const getProvider = (channel: Channel): ProviderConfig | undefined
```

**Usage:**

```typescript
const config = getProvider('email');
if (config) {
  console.log(config.name);        // "Email"
  console.log(config.requiresAuth); // true
}
```

### getProviderComponent

Get just the lazy-loaded component for a channel.

```typescript
export const getProviderComponent = (channel: Channel): React.LazyExoticComponent<React.FC<any>> | undefined
```

**Usage:**

```typescript
const EmailComponent = getProviderComponent('email');
if (EmailComponent) {
  return <EmailComponent />;
}
```

### isProviderAvailable

Check if a provider is registered.

```typescript
export const isProviderAvailable = (channel: Channel): boolean
```

**Usage:**

```typescript
if (isProviderAvailable('tickets')) {
  // Show tickets option in menu
  return <MenuItem>Tickets</MenuItem>;
}
```

### getAvailableProviders

Get list of all registered provider channels.

```typescript
export const getAvailableProviders = (): Channel[]
```

**Usage:**

```typescript
const providers = getAvailableProviders();
// ['all', 'email', 'whatsapp', 'internal']

return (
  <Menu>
    {providers.map(channel => (
      <MenuItem key={channel} onClick={() => selectChannel(channel)}>
        {getProvider(channel)?.name}
      </MenuItem>
    ))}
  </Menu>
);
```

### requiresAuthentication

Check if a provider requires authentication.

```typescript
export const requiresAuthentication = (channel: Channel): boolean
```

**Usage:**

```typescript
function handleChannelSelect(channel: Channel) {
  if (requiresAuthentication(channel) && !isAuthenticated) {
    // Redirect to auth flow
    navigate('/auth');
  } else {
    // Load provider
    setSelectedChannel(channel);
  }
}
```

## Lazy Loading Implementation

Each provider is lazy-loaded using React's `lazy()` function to reduce initial bundle size.

### Provider Imports

```typescript
// Lazy load providers
const UnifiedProvider = lazy(() =>
  import('../unified/UnifiedProvider')
);

const EmailProvider = lazy(() =>
  import('../email/email-provider-view').then(m => ({
    default: m.EmailProviderView
  }))
);

const InternalProvider = lazy(() =>
  import('../internal/internal-provider').then(m => ({
    default: m.InternalProvider
  }))
);
```

### Placeholder Components

For providers not yet implemented, the registry provides placeholder components:

```typescript
const WhatsAppProvider = lazy(() => Promise.resolve({
  default: () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <h2>WhatsApp Provider</h2>
      <p>Coming soon...</p>
    </Box>
  )
}));
```

## Adding a New Provider

### Step 1: Create Provider Component

Create your provider component following the standard structure:

```
src/widgets/frontdesk/providers/myProvider/
├── my-provider-view.tsx          # Main provider component
├── components/                   # Provider-specific components
├── hooks/                       # Provider hooks
└── types/                       # TypeScript types
```

### Step 2: Register Provider

Add to `ProviderRegistry.tsx`:

```typescript
// 1. Import (lazy)
const MyProvider = lazy(() =>
  import('../myProvider/my-provider-view').then(m => ({
    default: m.MyProviderView
  }))
);

// 2. Add to Channel type (if not already present)
type Channel = 'all' | 'email' | 'whatsapp' | 'internal' | 'myProvider';

// 3. Register in providerRegistry
const providerRegistry: Record<Channel, ProviderConfig> = {
  // ... existing providers
  myProvider: {
    component: MyProvider,
    name: 'My Provider',
    icon: <MyProviderIcon />,
    requiresAuth: true  // or false
  }
};
```

### Step 3: Update Navigation

Add the new provider to the navigation sidebar:

```typescript
// src/widgets/frontdesk/layouts/components/NavigationSidebar.tsx
const channels: Channel[] = [
  'all',
  'internal',
  'email',
  'whatsapp',
  'myProvider'  // Add here
];
```

### Step 4: Add Icon (Optional)

If using a custom icon:

```typescript
import MyProviderIcon from '@mui/icons-material/MyIcon';

const providerRegistry: Record<Channel, ProviderConfig> = {
  myProvider: {
    component: MyProvider,
    name: 'My Provider',
    icon: <MyProviderIcon />,
    requiresAuth: true
  }
};
```

## Loading States

The registry handles three loading states:

### 1. Initial Load

Before provider component is loaded:

```typescript
<Suspense fallback={<CircularProgress />}>
  <ProviderComponent />
</Suspense>
```

### 2. Provider Not Found

When channel doesn't exist in registry:

```typescript
<Box sx={{ p: 3, textAlign: 'center' }}>
  <h2>Provider Not Found</h2>
  <p>The selected provider "{channel}" is not available.</p>
</Box>
```

### 3. Provider Internal Loading

Each provider manages its own internal loading states (connections, data fetching, etc.).

## Error Handling

### Missing Provider

The registry gracefully handles missing providers:

```typescript
const config = providerRegistry[channel];

if (!config) {
  return <ErrorDisplay message="Provider not found" />;
}
```

### Failed Lazy Load

React's Suspense automatically handles component load failures. Consider adding an Error Boundary for better UX:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function FrontDesk() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ProviderWrapper channel={selectedChannel} />
    </ErrorBoundary>
  );
}
```

## Type Safety

The registry enforces type safety through TypeScript:

### Compile-Time Checks

```typescript
// Good - valid channel
<ProviderWrapper channel="email" />

// Error - invalid channel
<ProviderWrapper channel="invalid" />
//                        ^^^^^^^ Type '"invalid"' is not assignable to type 'Channel'
```

### Runtime Validation

```typescript
function selectChannel(channel: string) {
  // Validate at runtime
  if (isProviderAvailable(channel as Channel)) {
    setSelectedChannel(channel as Channel);
  } else {
    console.error(`Invalid channel: ${channel}`);
  }
}
```

## Performance Optimization

### Code Splitting

Each provider is split into its own bundle:

```
dist/
├── main.js                    # Core app
├── internal-provider.js       # Internal provider chunk
├── email-provider.js          # Email provider chunk
├── whatsapp-provider.js       # WhatsApp provider chunk
└── unified-provider.js        # Unified inbox chunk
```

### Bundle Size Impact

Without lazy loading:
- Initial bundle: ~500KB
- All providers loaded upfront

With lazy loading:
- Initial bundle: ~200KB
- Providers loaded on-demand (~100KB each)

### Preloading (Optional)

For frequently-used providers, consider preloading:

```typescript
import { getProviderComponent } from './registry/ProviderRegistry';

// Preload email provider when user hovers over email button
function EmailButton() {
  const handleMouseEnter = () => {
    const EmailProvider = getProviderComponent('email');
    if (EmailProvider) {
      // Trigger preload
      EmailProvider.preload?.();
    }
  };

  return (
    <Button onMouseEnter={handleMouseEnter}>
      Email
    </Button>
  );
}
```

## Integration with NavigationSidebar

The registry works closely with the NavigationSidebar component:

```typescript
// NavigationSidebar.tsx
export type Channel = 'all' | 'email' | 'whatsapp' | 'internal' | 'tickets';

interface NavigationSidebarProps {
  selectedChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

export function NavigationSidebar({ selectedChannel, onChannelChange }: NavigationSidebarProps) {
  const availableChannels = getAvailableProviders();

  return (
    <List>
      {availableChannels.map(channel => {
        const provider = getProvider(channel);
        return (
          <ListItem
            key={channel}
            selected={selectedChannel === channel}
            onClick={() => onChannelChange(channel)}
          >
            {provider?.icon}
            <ListItemText primary={provider?.name} />
            {requiresAuthentication(channel) && <LockIcon />}
          </ListItem>
        );
      })}
    </List>
  );
}
```

## Testing

### Unit Tests

```typescript
import {
  getProvider,
  isProviderAvailable,
  getAvailableProviders,
  requiresAuthentication
} from './ProviderRegistry';

describe('ProviderRegistry', () => {
  describe('getProvider', () => {
    it('should return config for valid channel', () => {
      const config = getProvider('email');
      expect(config).toBeDefined();
      expect(config?.name).toBe('Email');
    });

    it('should return undefined for invalid channel', () => {
      const config = getProvider('invalid' as any);
      expect(config).toBeUndefined();
    });
  });

  describe('isProviderAvailable', () => {
    it('should return true for registered providers', () => {
      expect(isProviderAvailable('email')).toBe(true);
      expect(isProviderAvailable('internal')).toBe(true);
    });

    it('should return false for unregistered providers', () => {
      expect(isProviderAvailable('tickets')).toBe(false);
    });
  });

  describe('getAvailableProviders', () => {
    it('should return all registered channel names', () => {
      const providers = getAvailableProviders();
      expect(providers).toContain('all');
      expect(providers).toContain('email');
      expect(providers).toContain('internal');
      expect(providers).toContain('whatsapp');
    });
  });

  describe('requiresAuthentication', () => {
    it('should return true for auth-required providers', () => {
      expect(requiresAuthentication('email')).toBe(true);
      expect(requiresAuthentication('whatsapp')).toBe(true);
    });

    it('should return false for non-auth providers', () => {
      expect(requiresAuthentication('internal')).toBe(false);
      expect(requiresAuthentication('all')).toBe(false);
    });
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { ProviderWrapper } from './ProviderRegistry';

describe('ProviderWrapper', () => {
  it('should render loading state initially', () => {
    render(<ProviderWrapper channel="email" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render error for invalid channel', () => {
    render(<ProviderWrapper channel="invalid" as any />);
    expect(screen.getByText(/Provider Not Found/i)).toBeInTheDocument();
  });

  it('should pass props to provider component', async () => {
    const mockProp = 'test-value';
    render(<ProviderWrapper channel="internal" customProp={mockProp} />);

    // Wait for provider to load
    await waitFor(() => {
      // Check that provider received prop
      expect(screen.getByTestId('provider')).toHaveAttribute('data-customprop', mockProp);
    });
  });
});
```

## Best Practices

### 1. Always Use Lazy Loading

```typescript
// Good - lazy loaded
const MyProvider = lazy(() => import('../myProvider'));

// Bad - eager loaded
import MyProvider from '../myProvider';
```

### 2. Check Provider Availability

```typescript
// Good - check before using
if (isProviderAvailable(channel)) {
  return <ProviderWrapper channel={channel} />;
}

// Bad - assume provider exists
return <ProviderWrapper channel={channel} />;
```

### 3. Handle Authentication

```typescript
// Good - check auth requirement
function loadProvider(channel: Channel) {
  if (requiresAuthentication(channel) && !user.isAuthenticated) {
    return <AuthPrompt />;
  }
  return <ProviderWrapper channel={channel} />;
}

// Bad - ignore auth
return <ProviderWrapper channel={channel} />;
```

### 4. Use Type-Safe Channels

```typescript
// Good - use Channel type
const [channel, setChannel] = useState<Channel>('all');

// Bad - use string
const [channel, setChannel] = useState<string>('all');
```

## Future Enhancements

### Planned Features

1. **Dynamic Registration**: Allow runtime provider registration
2. **Plugin System**: Load providers from external packages
3. **Provider Marketplace**: Install providers from registry
4. **Hot Reloading**: Update providers without page reload
5. **Provider Versioning**: Support multiple versions of same provider

### Tickets Provider

The `tickets` provider is defined in the Channel type but not yet registered:

```typescript
// TODO: Add tickets provider
const TicketsProvider = lazy(() =>
  import('../tickets/tickets-provider-view')
);

providerRegistry.tickets = {
  component: TicketsProvider,
  name: 'Tickets',
  requiresAuth: false
};
```

## Related Documentation

- [Base Provider Interfaces](./base.md) - Provider interface definitions
- [Internal DMs Provider](./internal_dms.md) - Direct messaging
- [Email Provider](./email.md) - Email integration
- [WhatsApp Provider](./whatsapp.md) - WhatsApp integration
- [Unified Inbox](./unified_inbox.md) - Multi-provider view
- [Tickets Provider](./tickets.md) - Ticketing system

## Changelog

### v1.1.0 (Current)
- Added utility functions (getProvider, isProviderAvailable, etc.)
- Improved error handling for missing providers
- Added TypeScript type safety
- Documented lazy loading implementation

### v1.0.0
- Initial provider registry
- Lazy loading support
- Basic provider configuration
- ProviderWrapper component
