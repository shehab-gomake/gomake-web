# FrontDesk Developer Quick Reference

## 🚀 Quick Start

### Run the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3004/frontdesk/inbox
```

### Key Files to Know
- **Main Widget**: `src/widgets/frontdesk/frontdesk-widget.tsx`
- **Layout**: `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`
- **Navigation**: `src/widgets/frontdesk/layouts/components/NavigationSidebar/NavigationSidebar.tsx`
- **Providers**: `src/widgets/frontdesk/providers/[provider-name]/`
- **State**: `src/store/frontdesk/`

---

## 📁 Directory Map

```
frontdesk/
├── layouts/           → Layout components (3-column structure)
├── providers/         → Communication channel implementations
├── components/        → Shared/reusable components
├── controllers/       → Business logic and navigation
├── hooks/            → Custom React hooks
└── types/            → TypeScript definitions
```

---

## 🔧 Common Tasks

### Add a New Provider

1. **Create provider structure**:
```bash
mkdir -p src/widgets/frontdesk/providers/mynewprovider/{components,hooks,types,utils}
```

2. **Create main provider component**:
```typescript
// mynewprovider/MyNewProvider.tsx
export const MyNewProvider: React.FC = () => {
  return (
    <Box>
      {/* Provider UI */}
    </Box>
  );
};
```

3. **Register in ProviderRegistry**:
```typescript
// providers/registry/ProviderRegistry.tsx
const providerRegistry = {
  // ...existing
  mynewprovider: {
    component: MyNewProvider,
    name: 'My New Provider',
    requiresAuth: true
  }
};
```

4. **Add navigation entry**:
```typescript
// Update NavigationSidebar to include new channel
```

### Add a New System Section

1. **Create section component**:
```typescript
// In frontdesk-widget.tsx, add to renderMainContent()
case 'mynewsection':
  return <MyNewSection />;
```

2. **Update navigation type**:
```typescript
// layouts/components/NavigationSidebar/NavigationSidebar.tsx
export type Section = 'inbox' | 'assigned' | 'admin' | 'settings' | 'mynewsection';
```

3. **Add to system items**:
```typescript
const systemItems = [
  // ...existing
  { id: 'mynewsection', icon: <MyIcon />, label: 'My Section' }
];
```

### Create a Recoil Atom

```typescript
// src/store/frontdesk/atoms/myprovider.atoms.ts
import { atom } from 'recoil';

export const myProviderDataAtom = atom<DataType[]>({
  key: 'frontdesk.myprovider.data', // Unique key
  default: []
});
```

### Add API Service

```typescript
// src/services/api-service/frontdesk/providers/myprovider/myprovider.service.ts
export class MyProviderService {
  async fetchData(): Promise<Data[]> {
    const response = await apiClient.get('/api/frontdesk/myprovider/data');
    return response.data;
  }
}
```

---

## 🎨 UI Components

### Use Three-Column Layout
```typescript
import { ThreeColumnLayout } from '@/widgets/frontdesk/layouts/three-column';

<ThreeColumnLayout
  navigationContent={<NavigationSidebar />}
  listContent={<DynamicListPanel />}
  mainContent={<ContentArea />}
/>
```

### Create a Conversation List
```typescript
import { ConversationList } from '@/widgets/frontdesk/components/ui/ConversationList';

<ConversationList
  conversations={conversations}
  selectedId={selectedId}
  onSelect={handleSelect}
  loading={isLoading}
/>
```

### Add Loading State
```typescript
{loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress />
  </Box>
) : (
  <YourContent />
)}
```

---

## 🔄 State Management

### Read State
```typescript
import { useRecoilValue } from 'recoil';
import { emailAccountsAtom } from '@/store/frontdesk';

const EmailComponent = () => {
  const accounts = useRecoilValue(emailAccountsAtom);
  // Use accounts...
};
```

### Update State
```typescript
import { useRecoilState } from 'recoil';

const [accounts, setAccounts] = useRecoilState(emailAccountsAtom);

const addAccount = (newAccount) => {
  setAccounts([...accounts, newAccount]);
};
```

### Create Selector
```typescript
import { selector } from 'recoil';

export const unreadCountSelector = selector({
  key: 'frontdesk.selectors.unreadCount',
  get: ({ get }) => {
    const conversations = get(conversationsAtom);
    return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  }
});
```

---

## 🚦 Navigation

### Programmatic Navigation
```typescript
// Smooth client-side navigation (no page refresh)
const handleNavigation = (section: Section) => {
  setCurrentSection(section);
  window.history.pushState({}, '', `/frontdesk/${section}`);
};

// With router (causes refresh - avoid if possible)
router.push('/frontdesk/inbox/email');
```

### Route Structure
```
/frontdesk/inbox/unified    → Unified inbox (all channels)
/frontdesk/inbox/email      → Email provider
/frontdesk/inbox/whatsapp   → WhatsApp provider
/frontdesk/inbox/internal   → Internal chat
/frontdesk/assigned         → Assigned conversations
/frontdesk/admin           → Admin panel
/frontdesk/settings        → Settings
```

---

## 🔌 WebSocket Integration

### Connect to Socket
```typescript
import { messagingService } from '@/services/websocket/messaging-service';

// Connect
await messagingService.connect(authToken);

// Send message
messagingService.sendMessage(channelId, content);

// Listen for messages
messagingService.on('message:receive', (message) => {
  // Handle new message
});
```

### Socket Events
```typescript
// Available events
'connect'           // Connected to server
'disconnect'        // Disconnected
'message:receive'   // New message received
'message:sent'      // Message sent confirmation
'typing:start'      // User started typing
'typing:stop'       // User stopped typing
'presence:update'   // User presence changed
```

---

## 🎯 Best Practices

### Component Structure
```typescript
// ✅ Good
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. State
  const [state, setState] = useState();
  
  // 2. Hooks
  const data = useRecoilValue(atom);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Handlers
  const handleClick = () => {};
  
  // 5. Render
  return <Box>{/* content */}</Box>;
};

// ❌ Avoid
- Inline styles (use sx prop or styled components)
- Direct DOM manipulation
- Synchronous heavy computations
```

### State Management
```typescript
// ✅ Good
- Use Recoil atoms for shared state
- Use useState for local component state
- Use selectors for computed values

// ❌ Avoid
- Global variables
- Prop drilling (passing props through many levels)
- Direct atom mutations
```

### Performance
```typescript
// ✅ Good
const memoizedValue = useMemo(() => expensiveOperation(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);

// ❌ Avoid
- Re-creating objects/functions in render
- Unnecessary re-renders
- Large component trees without code splitting
```

---

## 🐛 Debugging

### Enable Debug Mode
```typescript
// In browser console
localStorage.setItem('FRONTDESK_DEBUG', 'true');
```

### Check State
```typescript
// React DevTools
// 1. Open React DevTools
// 2. Search for "RecoilRoot"
// 3. Inspect atom values

// Or in component
import { useRecoilValue } from 'recoil';
console.log('Current state:', useRecoilValue(myAtom));
```

### Monitor WebSocket
```typescript
// Browser DevTools → Network → WS tab
// Shows all WebSocket messages
```

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Provider not loading | Check lazy import path and ProviderRegistry |
| State not updating | Verify atom keys are unique |
| Navigation broken | Check Section/Channel types match |
| WebSocket disconnected | Verify auth token and server URL |
| Messages not showing | Check message format and channelId |

---

## 📝 Type Definitions

### Core Types
```typescript
// Navigation
type Section = 'inbox' | 'assigned' | 'admin' | 'settings';
type Channel = 'all' | 'email' | 'whatsapp' | 'internal';

// Messaging
interface Message {
  messageId: string;
  channelId: string;
  content: string;
  userId: string;
  timestamp: string;
  metadata?: any;
}

interface Conversation {
  id: string;
  name: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
}

// Provider
interface IProvider {
  providerId: string;
  providerName: string;
  connect(): Promise<void>;
  fetchConversations(): Promise<Conversation[]>;
  sendMessage(conversationId: string, content: string): Promise<void>;
}
```

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Write Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

test('renders navigation sidebar', () => {
  render(
    <RecoilRoot>
      <NavigationSidebar />
    </RecoilRoot>
  );
  
  expect(screen.getByText('Email')).toBeInTheDocument();
});
```

---

## 📚 Resources

### Internal Documentation
- [Full Architecture Guide](./FRONTDESK_ARCHITECTURE.md)
- [API Documentation](../api/README.md)
- [Component Storybook](http://localhost:6006)

### External Resources
- [Material-UI Components](https://mui.com/components/)
- [Recoil Guide](https://recoiljs.org/docs/introduction/motivation)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [React Best Practices](https://react.dev/learn/thinking-in-react)

---

## 🆘 Getting Help

- **Slack**: #frontdesk-dev
- **Wiki**: Internal wiki → FrontDesk
- **Code Reviews**: Tag @frontdesk-team
- **Issues**: GitHub Issues with `frontdesk` label

---

*Quick Reference Version: 1.0.0*
*Last Updated: December 2024*