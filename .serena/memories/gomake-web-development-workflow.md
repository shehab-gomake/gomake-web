# GoMake Web - Development Workflow & Best Practices

## Development Environment
- **Port**: 3004 (dev server)
- **Build**: `NODE_OPTIONS='--max-old-space-size=4096' next build`
- **Testing**: Jest with coverage reporting
- **Linting**: Next.js ESLint configuration

## Code Organization Principles
### File Placement Rules
- **Pages**: `src/pages/**.page.tsx` (Next.js Pages Router)
- **Page Components**: `src/pages-components/` (page-specific, not reused)
- **Reusable UI**: `src/components/` (pure UI components)
- **Feature Widgets**: `src/widgets/` (business logic + UI composition)
- **Global State**: `src/store/` (Recoil atoms/selectors)
- **API Services**: `src/services/api-service/` (endpoint definitions)
- **Real-time Services**: `src/services/websocket/` (Socket.IO, SignalR)
- **Business Logic**: `src/lib/` (pure domain logic)
- **Utilities**: `src/utils/` (small generic helpers)
- **Types**: `src/interfaces/` (shared TypeScript interfaces)

### Import Guidelines
- **Always use alias**: `@/` instead of relative paths
- **Service imports**: Never import UI components from services
- **Hook organization**: Group by feature/domain in subdirectories

## Socket.IO Development Patterns
### Service Implementation
```typescript
// Always use MessagingService for Socket.IO connections
import { messagingService } from '@/services/websocket/messaging-service';

// Connection with authentication
await messagingService.connect(authToken);

// Event handling
messagingService.onNewMessage((message) => {
  // Handle incoming message
});

// Message sending
messagingService.sendMessage(messageData);
```

### Hook Patterns
```typescript
// Feature-specific Socket.IO hooks
const useFeatureSocketIo = () => {
  useEffect(() => {
    const socket = io(config.api_server);
    // Event listeners
    return () => socket.disconnect();
  }, []);
};
```

## State Management (Recoil)
### Global State
- **Cross-page state**: Use Recoil atoms in `src/store/`
- **Local component state**: Use React useState/useReducer
- **Server state**: Use custom hooks with Axios

### Common Patterns
```typescript
// Atom definition
const userState = atom({
  key: 'userState',
  default: null,
});

// Usage in components
const [user, setUser] = useRecoilState(userState);
```

## API Integration
### Axios Configuration
- **Base config**: `src/services/api-request.ts`
- **Interceptors**: Automatic token handling, error management
- **Custom hooks**: `useGomakeAxios()` for API calls

### Service Structure
```typescript
// API service organization
src/services/api-service/
├── [domain]/
│   ├── [feature]-endpoints.ts
│   └── types.ts
```

## Testing Strategy
### Jest Configuration
- **Environment**: jsdom for React testing
- **Coverage**: Comprehensive coverage reporting
- **Setup**: Custom Jest setup with testing library

### Testing Patterns
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

// Hook testing
import { renderHook } from '@testing-library/react-hooks';
```

## Performance Considerations
### Bundle Optimization
- **Bundle Analyzer**: `@next/bundle-analyzer` integration
- **Package Optimization**: `optimizePackageImports` for icon libraries
- **Standalone Output**: Docker-ready builds

### Real-time Optimization
- **Connection Pooling**: Reuse Socket.IO connections
- **Event Debouncing**: Prevent excessive event firing
- **Memory Management**: Proper cleanup of event listeners

## Security Best Practices
### Authentication
- **Token Management**: Secure storage and automatic refresh
- **OAuth Integration**: Google OAuth for external providers
- **Session Management**: Persistent session IDs for Socket.IO

### Data Handling
- **Input Sanitization**: DOMPurify for user content
- **Type Safety**: TypeScript interfaces for all data structures
- **Error Boundaries**: Graceful error handling

## Deployment & Configuration
### Environment Variables
- **Multiple Servers**: API, ERP, Messaging, Calculation
- **Runtime Config**: Both server and public runtime configs
- **Security**: Sensitive data in serverRuntimeConfig only

### Build Process
- **Standalone Output**: Self-contained deployment
- **Source Maps**: Production source maps for debugging
- **Webpack Optimization**: Custom webpack configuration