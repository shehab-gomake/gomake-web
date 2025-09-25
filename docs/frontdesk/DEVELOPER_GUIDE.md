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
- **Main Layout**: `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx` (Note: Currently a two-column layout)
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
