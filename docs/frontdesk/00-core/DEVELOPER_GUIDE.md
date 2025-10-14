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
- **Routing System**: `src/widgets/frontdesk/routing/` ⭐ NEW
- **Main Layout**: `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`
- **Navigation**: `src/widgets/frontdesk/layouts/components/NavigationSidebar/NavigationSidebar.tsx`
- **Providers**: `src/widgets/frontdesk/providers/[provider-name]/`
- **State**: `src/store/frontdesk/`

---

## 📁 Directory Map

```
frontdesk/
├── layouts/           → Layout components
├── providers/         → Communication channel implementations
├── components/        → Shared/reusable components
├── controllers/       → Business logic and navigation
├── hooks/            → Custom React hooks
└── types/            → TypeScript definitions
```

---

## 🧭 Routing System (NEW)

### Navigation with Type Safety

FrontDesk uses a centralized routing system for type-safe navigation:

```typescript
import { useFrontDeskRouter, RouteBuilder } from '@/widgets/frontdesk/routing';

function MyComponent() {
  const { navigate, currentRoute, isInTicketMode } = useFrontDeskRouter();

  // Navigate to inbox/dashboard
  navigate(RouteBuilder.inbox());

  // Navigate to specific channel
  navigate(RouteBuilder.email());
  navigate(RouteBuilder.whatsapp());
  navigate(RouteBuilder.internal()); // Direct messages

  // Navigate to tickets
  navigate(RouteBuilder.myTickets());
  navigate(RouteBuilder.allTickets());
  navigate(RouteBuilder.ticketDetail('846c2a13-4133-4046-b04a-e3607f8e45b6'));

  // Open in new tab
  navigate(RouteBuilder.ticketDetail('TICKET-123'), { newTab: true });

  // Navigate to sections
  navigate(RouteBuilder.settings());
  navigate(RouteBuilder.assigned());
}
```

### Supported URL Patterns

```
/frontdesk/inbox                           → Dashboard (unified)
/frontdesk/inbox/email                     → Email channel
/frontdesk/inbox/whatsapp                  → WhatsApp channel
/frontdesk/inbox/internal                  → Direct messages
/frontdesk/inbox/internal?conversation=123 → DM with conversation
/frontdesk/tickets/my-tickets              → My tickets view
/frontdesk/tickets/all-tickets             → All tickets view
/frontdesk/tickets/846c...45b6             → Ticket detail (UUID)
/frontdesk/tickets/TICKET-123              → Ticket detail (legacy)
/frontdesk/assigned                        → Assigned section
/frontdesk/settings                        → Settings section
```

### Check Current Route

```typescript
const { currentRoute, currentSection, currentChannel, isInTicketMode } = useFrontDeskRouter();

if (currentRoute.type === RouteType.TICKET_DETAIL) {
  console.log('Viewing ticket:', currentRoute.ticketId);
}

if (isInTicketMode) {
  // Show ticket-specific UI
}
```

### Deep Linking from Notifications

The routing system automatically handles deep links with query parameters:

```typescript
// URL: /frontdesk/inbox?view=email&conversation=456
// Automatically parsed and routed to email channel with conversation 456

// URL: /frontdesk/inbox?ticket=TICKET-789
// Automatically opens ticket TICKET-789
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
      {/* Provider UI. Should conform to the application's layout structure. */}
    </Box>
  );
};
```

3. **Register in `frontdesk-widget.tsx`**:
```typescript
// in renderMainContent()
case 'mynewprovider':
  return <MyNewProviderView />;
```

4. **Add navigation entry**:
```typescript
// Update NavigationSidebar to include new channel
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
// src/services/frontdesk/api/myprovider.service.ts
export class MyProviderService {
  async fetchData(): Promise<Data[]> {
    const response = await apiClient.get('/api/frontdesk/myprovider/data');
    return response.data;
  }
}

// Export in src/services/frontdesk/api/index.ts
export * from './myprovider.service';
```

---

## 🎨 UI Components

### Main Layout
The main layout is currently a two-column layout. Providers are expected to implement their own content layout. Refer to `FRONTDESK_ARCHITECTURE.md` for recommendations on unifying the layout.

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

---

## 🔌 WebSocket Integration

### Connect to Socket
```typescript
import { messagingService, ticketSocketService } from '@/services/frontdesk';

// Connect to messaging
await messagingService.connect(authToken);

// Send message
messagingService.sendMessage(channelId, content);

// Listen for messages
messagingService.on('message:receive', (message) => {
  // Handle new message
});

// For tickets - connect and listen to events
await ticketSocketService.connect(authToken, printHouseId);
ticketSocketService.onTicketCreated((ticket) => {
  // Handle new ticket
});
```

---

## 🐛 Debugging

### Enable Debug Mode
```typescript
// In browser console
localStorage.setItem('FRONTDESK_DEBUG', 'true');
```

### Check State with React DevTools
- Open React DevTools and inspect the `RecoilRoot` to see the state of all atoms.

### Monitor WebSocket
- Use the Network tab in your browser's developer tools to inspect WebSocket traffic.

---

## 📚 Resources

### Internal Documentation
- [Full Architecture Guide](./FRONTDESK_ARCHITECTURE.md)
- [Direct Messages Frontend Guide](./direct-messages-frontend.md)

### External Resources
- [Material-UI Components](https://mui.com/components/)
- [Recoil Guide](https://recoiljs.org/docs/introduction/motivation)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
