# ✨ FrontDesk: Unified Messaging Hub - Production Enhancement Plan

## Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels (Direct Messages, Email, WhatsApp, Tickets) into a single three-column interface. This issue tracks the comprehensive enhancement plan to bring all providers to production-ready status, improve performance, add error resilience, and implement missing features.

**Current Status:**
- 🟢 Production Ready: Internal DMs (WebSocket), Email (OAuth), Tickets (WebSocket + 12 events)
- 🟡 Needs Work: WhatsApp (Mock data only), Unified Inbox (Partial aggregation)
- 🔴 Missing: Error boundaries, list virtualization, offline support

**Access:** `http://localhost:3004/frontdesk/inbox`

---

## Problem Statement

### Current Architecture Strengths
- ✅ **Solid Foundation:** Well-structured provider pattern with clear separation of concerns
- ✅ **Type Safety:** Strong TypeScript integration with discriminated unions for routing
- ✅ **Real-time Support:** Socket.IO integration for DMs and Tickets (12 WebSocket events)
- ✅ **State Management:** Recoil atoms with localStorage persistence
- ✅ **Modern Stack:** React 18.2, TypeScript 5.4.3, MUI 5.16.6, Socket.IO 4.8.1

### Critical Gaps
1. **No Error Boundaries:** Single provider failure crashes entire widget
2. **Performance Issues:** No list virtualization for long message/ticket lists (100+ items)
3. **Mock Providers:** WhatsApp provider uses static mock data
4. **Incomplete Aggregation:** Unified inbox lists conversations but can't display messages
5. **Limited Resilience:** No offline message queuing, weak reconnection UX
6. **No Testing Strategy:** Zero test coverage for real-time features

### Why This Matters
- **User Experience:** Users lose all context when errors occur (no graceful degradation)
- **Scalability:** Performance degrades significantly with 500+ tickets or 1000+ messages
- **Production Readiness:** Cannot confidently deploy without error handling and testing
- **Business Value:** WhatsApp is a critical channel for customer communication

---

## Proposed Solution

Transform FrontDesk from a functional prototype into a production-grade unified messaging hub by implementing:

1. **Error Resilience:** Granular error boundaries per provider with custom fallback UIs
2. **Performance Optimization:** Virtual scrolling for all list views using react-window (already installed)
3. **Complete Provider Coverage:** Implement real WhatsApp API integration, finish Unified inbox aggregation
4. **Offline Support:** Message queuing, connection state management, sync after reconnection
5. **Testing Infrastructure:** Unit tests for hooks, integration tests for WebSocket flows
6. **Enhanced UX:** Loading skeletons, optimistic updates, keyboard shortcuts

---

## Technical Approach

### Architecture

**Current Structure (Maintained):**
```
src/
├── widgets/frontdesk/               # UI Components
│   ├── frontdesk-widget.tsx         # Main router (706 lines)
│   ├── routing/                     # ⭐ Centralized routing (Jan 2025)
│   │   ├── types.ts                 # 5 route types, type-safe navigation
│   │   ├── route-builder.ts         # URL builder utilities
│   │   └── hooks/
│   │       └── use-frontdesk-router.ts
│   ├── providers/                   # Provider implementations
│   │   ├── internal/                # DMs (✅ Complete, 600+ lines)
│   │   ├── email/                   # Email (✅ Complete, 340 lines)
│   │   ├── tickets/                 # Tickets (✅ Complete, 1346 lines)
│   │   ├── whatsapp/                # WhatsApp (🟡 Mock, 150 lines)
│   │   └── unified/                 # Unified (🟡 Partial)
│   └── layouts/three-column/        # Three-column layout
├── store/frontdesk/                 # Recoil state
│   └── atoms/
│       ├── internal.atoms.ts        # 99 lines, 5 atoms
│       ├── email.atoms.ts           # 99 lines, 6 atoms
│       └── tickets.atoms.ts         # 100+ lines, 6 atoms
└── services/frontdesk/              # Services layer
    ├── api/                         # REST endpoints
    │   └── index.ts                 # Unified export
    └── websocket/                   # Real-time
        ├── messaging-socket.service.ts  # DMs WebSocket
        └── ticket-socket.service.ts     # Tickets WebSocket
```

**Technology Stack (Exact Versions):**
- **React:** 18.2.0 (Concurrent features, Suspense, Transitions)
- **Recoil:** 0.7.7 (State management with atom effects)
- **Socket.IO Client:** 4.8.1 (WebSocket with automatic reconnection)
- **Next.js:** 13.5.4 (Pages Router - NOT App Router)
- **Material-UI:** 5.16.6 + Emotion 11.13.0 (Component library)
- **TypeScript:** 5.4.3 (Discriminated unions, generics)
- **react-window:** 1.8.11 (Already installed, virtualization)
- **Axios:** 1.3.4 (REST API client)

### Implementation Phases

#### Phase 1: Resilience & Stability (Week 1-2)

**Deliverables:**
- [ ] Global error boundary wrapper for entire FrontDesk widget
- [ ] Provider-specific error boundaries (5 components)
- [ ] Custom error fallback UIs per provider type
- [ ] Connection state indicator in navigation sidebar
- [ ] Enhanced WebSocket reconnection UX (loading states, retry counters)
- [ ] Offline detection and visual feedback

**Success Criteria:**
- ✅ Provider crash doesn't affect other providers
- ✅ User sees clear error messages with actionable recovery steps
- ✅ Connection loss shows immediate UI feedback
- ✅ Reconnection attempts visible with progress

**Files to Create:**
```typescript
// src/components/error-boundary/ErrorBoundary.tsx (120 lines)
// src/components/error-boundary/ProviderErrorFallback.tsx (80 lines)
// src/widgets/frontdesk/components/ConnectionIndicator.tsx (60 lines)
// src/services/frontdesk/websocket/connection-manager.ts (200 lines)
```

**Implementation Example:**
```typescript
// ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}

// Usage in frontdesk-widget.tsx
<ThreeColumnLayout
  navigationContent={
    <ErrorBoundary fallback={<NavigationErrorFallback />}>
      <NavigationSidebar />
    </ErrorBoundary>
  }
  listContent={
    <ErrorBoundary fallback={<ListErrorFallback />}>
      <DynamicListPanel />
    </ErrorBoundary>
  }
  mainContent={
    <ErrorBoundary fallback={<ContentErrorFallback />}>
      {renderProviderView()}
    </ErrorBoundary>
  }
/>
```

#### Phase 2: Performance Optimization (Week 2-3)

**Deliverables:**
- [ ] Virtual scrolling for ticket lists (TicketListPanel.tsx)
- [ ] Virtual scrolling for message lists (MessageList.tsx)
- [ ] Memoize expensive components (TicketCard, MessageCard)
- [ ] Debounced search/filter inputs (300ms delay)
- [ ] Optimize Recoil selectors with memoization
- [ ] Code-split provider views with React.lazy()

**Success Criteria:**
- ✅ 60 FPS scrolling with 1000+ tickets
- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Memory usage < 150MB for typical session

**Performance Targets:**
| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Ticket List Render | ~450ms (500 items) | <50ms | React DevTools Profiler |
| Message List Scroll | Janky | 60 FPS | Chrome DevTools Performance |
| Search Input Lag | ~200ms | <16ms | React DevTools |
| Bundle Size | 2.3MB | <2MB | Next.js build output |

**Implementation Example:**
```typescript
// VirtualizedTicketList.tsx
import { FixedSizeList } from 'react-window';

export function VirtualizedTicketList({ tickets }: Props) {
  const Row = ({ index, style }: RowProps) => {
    const ticket = tickets[index];
    return (
      <Box style={style}>
        <TicketCard ticket={ticket} />
      </Box>
    );
  };

  return (
    <FixedSizeList
      height={600}
      itemCount={tickets.length}
      itemSize={72}
      width="100%"
      overscanCount={10} // Render 10 extra for smooth scrolling
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### Phase 3: Complete Provider Coverage (Week 3-5)

**WhatsApp Provider Implementation:**
- [ ] Research WhatsApp Business API integration patterns
- [ ] Implement OAuth flow for WhatsApp Business accounts
- [ ] Create API service: `whatsapp.service.ts` (REST API client)
- [ ] Implement WebSocket service (if supported by backend)
- [ ] Update `use-whatsapp-provider.ts` hook (remove mock data)
- [ ] Add WhatsApp-specific UI components (templates, media messages)
- [ ] Handle WhatsApp message statuses (sent, delivered, read, failed)

**Unified Inbox Aggregation:**
- [ ] Implement message viewer routing logic
- [ ] Create adapter functions for normalized `Message` type
- [ ] Dynamic component rendering based on conversation provider
- [ ] Aggregate unread counts across all providers
- [ ] Unified search across all channels
- [ ] Sort conversations by most recent activity

**Success Criteria:**
- ✅ WhatsApp conversations load real data from backend
- ✅ Unified inbox displays messages from any selected conversation
- ✅ All provider message types render correctly in unified view
- ✅ Search returns results across all active channels

**Files to Create/Modify:**
```typescript
// src/services/frontdesk/api/whatsapp.service.ts (250 lines)
// src/services/frontdesk/websocket/whatsapp-socket.service.ts (300 lines)
// src/widgets/frontdesk/providers/whatsapp/hooks/use-whatsapp-provider.ts (400 lines)
// src/widgets/frontdesk/providers/unified/components/UnifiedMessageViewer.tsx (200 lines)
// src/widgets/frontdesk/providers/unified/hooks/useUnifiedAggregation.ts (300 lines)
// src/widgets/frontdesk/types/normalized-message.types.ts (80 lines)
```

**Unified Inbox Architecture:**
```typescript
// Normalized message type
interface NormalizedMessage {
  id: string;
  conversationId: string;
  provider: 'internal' | 'email' | 'whatsapp' | 'tickets';
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    attachments?: Attachment[];
    replyTo?: string;
    // Provider-specific data
  };
}

// Adapter pattern
class MessageAdapter {
  static toNormalized(message: any, provider: Provider): NormalizedMessage {
    switch (provider) {
      case 'internal':
        return this.fromInternalMessage(message);
      case 'email':
        return this.fromEmailMessage(message);
      case 'whatsapp':
        return this.fromWhatsAppMessage(message);
      case 'tickets':
        return this.fromTicketMessage(message);
    }
  }
}
```

#### Phase 4: Offline Support & Sync (Week 5-6)

**Deliverables:**
- [ ] Message queue for offline-sent messages
- [ ] IndexedDB persistence for critical state
- [ ] Sync protocol for missed messages on reconnection
- [ ] Optimistic UI updates with rollback on failure
- [ ] Network status detection (navigator.onLine)
- [ ] Background sync when connection restored

**Success Criteria:**
- ✅ Messages sent offline are queued and sent on reconnection
- ✅ User sees clear "offline" indicator
- ✅ No data loss during brief disconnections (<5 minutes)
- ✅ Automatic state resync on reconnection

**Implementation Example:**
```typescript
// offline-queue.service.ts
export class OfflineQueueService {
  private queue: QueuedMessage[] = [];

  async queueMessage(message: PendingMessage): Promise<void> {
    this.queue.push({ ...message, queuedAt: Date.now() });
    await this.persistToIndexedDB();
  }

  async flushQueue(): Promise<void> {
    for (const message of this.queue) {
      try {
        await messagingService.sendMessage(message);
        this.queue = this.queue.filter(m => m.id !== message.id);
      } catch (error) {
        console.error('Failed to send queued message:', error);
      }
    }
    await this.persistToIndexedDB();
  }
}
```

#### Phase 5: Testing Infrastructure (Week 6-7)

**Deliverables:**
- [ ] Unit tests for provider hooks (80% coverage target)
- [ ] Integration tests for WebSocket flows
- [ ] Mock Socket.IO server for testing
- [ ] E2E tests for critical user flows (Playwright)
- [ ] Performance regression tests
- [ ] Visual regression tests (Chromatic or Percy)

**Success Criteria:**
- ✅ 80%+ code coverage for hooks and services
- ✅ All WebSocket events have integration tests
- ✅ E2E tests pass for send message, create ticket, search flows
- ✅ CI/CD pipeline runs tests on every PR

**Test Structure:**
```typescript
// use-tickets-provider.test.ts
describe('useTicketsProvider', () => {
  it('fetches tickets on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTicketsProvider());

    await waitForNextUpdate();

    expect(result.current.tickets).toHaveLength(10);
  });

  it('handles WebSocket ticket.created event', async () => {
    const { result } = renderHook(() => useTicketsProvider());

    // Simulate WebSocket event
    act(() => {
      mockSocket.emit('ticket.created', mockTicket);
    });

    expect(result.current.tickets).toContainEqual(mockTicket);
  });
});
```

---

## Alternative Approaches Considered

### 1. ❌ Use React Query Instead of Recoil
**Why Rejected:**
- Would require rewriting all state management (2000+ lines)
- Recoil integrates better with WebSocket real-time updates
- Breaking change for existing codebase
- Loss of localStorage persistence built into atom effects

### 2. ❌ Migrate to Next.js App Router
**Why Rejected:**
- Next.js 13.5 Pages Router is stable and sufficient
- App Router migration is high-risk, low-reward for this feature
- Widget architecture doesn't benefit from Server Components
- Would require significant refactoring (500+ lines)

### 3. ❌ Replace Socket.IO with Native WebSocket
**Why Rejected:**
- Socket.IO provides automatic reconnection (critical feature)
- Fallback to long-polling for unreliable networks
- Backend already implements Socket.IO protocol
- Would require rewriting WebSocket services (600+ lines)

### 4. ✅ Considered: TanStack Virtual Instead of react-window
**Why Approved for Research:**
- More modern API, better TypeScript support
- Better handling of dynamic item heights
- Could replace react-window in Phase 2 if testing shows benefits

---

## Acceptance Criteria

### Functional Requirements

**Error Handling:**
- [ ] Provider crash shows error UI but doesn't affect other providers
- [ ] User can retry failed operations (send message, fetch data)
- [ ] Connection errors show actionable messages ("Check internet connection")
- [ ] Error logs sent to monitoring service (console.error minimum)

**Performance:**
- [ ] Smooth 60 FPS scrolling for lists with 1000+ items
- [ ] Search results appear within 300ms
- [ ] UI remains responsive during WebSocket message floods (10+ msgs/sec)
- [ ] Memory usage stable over 1-hour session

**Provider Coverage:**
- [ ] WhatsApp provider connects to real backend API
- [ ] WhatsApp messages send, receive, and display correctly
- [ ] Unified inbox shows messages from all providers
- [ ] Unified inbox search works across all channels

**Offline Support:**
- [ ] Messages sent offline are queued
- [ ] Offline indicator appears when network disconnects
- [ ] Queued messages flush automatically on reconnection
- [ ] No data loss for messages sent during brief disconnections

### Non-Functional Requirements

**Performance Targets:**
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Time to Interactive (TTI) < 3s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

**Security Requirements:**
- [ ] All WebSocket connections use WSS (secure)
- [ ] Auth tokens refresh automatically on expiration
- [ ] No sensitive data logged to console
- [ ] XSS protection via DOMPurify (already installed)

**Accessibility Standards:**
- [ ] WCAG 2.1 Level AA compliance
- [ ] Keyboard navigation for all features
- [ ] Screen reader support (ARIA labels)
- [ ] Color contrast ratio ≥ 4.5:1

### Quality Gates

**Test Coverage:**
- [ ] 80%+ coverage for hooks and services
- [ ] 100% coverage for critical flows (send message, create ticket)
- [ ] Integration tests for all 12 Ticket WebSocket events
- [ ] E2E tests for user journeys (inbox → send message → receive reply)

**Code Quality:**
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors (strict mode)
- [ ] All new code reviewed (PR approval required)
- [ ] Documentation updated for new features

**Documentation Completeness:**
- [ ] README updated with new features
- [ ] API documentation for new services
- [ ] Architecture diagrams updated
- [ ] Runbook for troubleshooting common issues

---

## Success Metrics

### Performance KPIs
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Ticket List Render | 450ms | <50ms | React DevTools Profiler |
| Search Query Response | 800ms | <300ms | Chrome DevTools |
| WebSocket Reconnection | Manual refresh required | <3s automatic | Custom telemetry |
| Memory Usage (1hr) | 220MB | <150MB | Chrome DevTools Memory |

### User Experience KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Error Recovery Rate | >90% | User successfully retries after error |
| Offline Message Success | >95% | Queued messages sent on reconnect |
| Provider Switch Time | <200ms | Time to switch between providers |
| Search Accuracy | >85% | Relevant results in top 5 |

### Development KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | >80% | Jest/Istanbul |
| Build Time | <30s | Next.js build output |
| PR Review Time | <24hrs | GitHub metrics |
| Bug Density | <0.5/KLOC | Issue tracker |

---

## Dependencies & Prerequisites

### Backend Dependencies
- [ ] **WhatsApp Business API:** Backend must implement REST endpoints
  - `GET /whatsapp/conversations`
  - `GET /whatsapp/conversations/:id/messages`
  - `POST /whatsapp/conversations/:id/messages`
  - WebSocket events: `whatsapp.message.received`, `whatsapp.status.update`
  - **Blocking:** Phase 3 (WhatsApp implementation)

- [ ] **Sync Protocol:** Backend must support missed message query
  - `GET /messages/since/:timestamp`
  - **Blocking:** Phase 4 (Offline support)

### Infrastructure Dependencies
- [ ] **Error Tracking Service:** Sentry or similar (optional, recommended)
  - **Non-blocking:** Can use console.error fallback

- [ ] **IndexedDB Support:** All modern browsers supported
  - **Non-blocking:** Can fallback to localStorage

### Team Dependencies
- [ ] **Design Review:** UX/UI approval for error states and loading patterns
  - **Blocking:** Phase 1 (Error boundaries)

- [ ] **Backend Coordination:** Sync API contracts for WhatsApp
  - **Blocking:** Phase 3

---

## Risk Analysis & Mitigation

### High-Risk Items

**1. WhatsApp API Integration Complexity**
- **Risk:** Backend API may not be ready or may have limited functionality
- **Impact:** 🔴 HIGH - Blocks Phase 3 completion
- **Probability:** 🟡 MEDIUM - Depends on backend team availability
- **Mitigation:**
  - Start with mock API adapter that matches expected interface
  - Implement frontend first, swap real API later
  - Define API contract early in Phase 1
  - Fallback: Keep mock mode with feature flag

**2. Performance Regression with Virtual Scrolling**
- **Risk:** react-window integration may introduce bugs (scroll position loss, item height miscalculations)
- **Impact:** 🟡 MEDIUM - Degrades UX but not blocking
- **Probability:** 🟢 LOW - react-window is battle-tested
- **Mitigation:**
  - Thorough testing with various data sets (empty, 10, 100, 1000+ items)
  - Implement scroll position preservation on navigation
  - Add performance benchmarks to CI/CD
  - Fallback: Keep non-virtualized lists for small datasets (<50 items)

**3. WebSocket Connection State Race Conditions**
- **Risk:** Complex connection state management may cause edge case bugs (double connections, missed events)
- **Impact:** 🔴 HIGH - Data loss or duplicate messages
- **Probability:** 🟡 MEDIUM - Real-time systems are complex
- **Mitigation:**
  - Implement connection state machine with clear transitions
  - Add extensive logging for debugging
  - Write integration tests for all connection scenarios
  - Use Socket.IO's built-in connection recovery (v4.x feature)

### Medium-Risk Items

**4. IndexedDB Browser Compatibility**
- **Risk:** Older browsers or privacy modes may block IndexedDB
- **Impact:** 🟡 MEDIUM - Offline support disabled
- **Probability:** 🟢 LOW - IndexedDB widely supported
- **Mitigation:**
  - Feature detection with fallback to localStorage
  - Clear error message if offline features unavailable

**5. Test Coverage Goals Unmet**
- **Risk:** 80% coverage target may be difficult for real-time code
- **Impact:** 🟡 MEDIUM - Reduced confidence in stability
- **Probability:** 🟡 MEDIUM - WebSocket testing is complex
- **Mitigation:**
  - Use socket.io-mock for testing
  - Focus on critical paths first
  - Adjust target to 70% if needed

---

## Resource Requirements

### Team Allocation
- **Frontend Engineers:** 2 developers, 6-7 weeks
  - Developer A: Focus on resilience (Phase 1, 4)
  - Developer B: Focus on performance and providers (Phase 2, 3)
  - Shared: Phase 5 (testing)

- **Backend Engineer:** 0.5 FTE (part-time support)
  - WhatsApp API implementation (Week 3-4)
  - Sync protocol implementation (Week 5)

- **Designer:** 0.25 FTE (part-time)
  - Error state designs (Week 1)
  - Loading skeleton patterns (Week 2)
  - Review and approval (ongoing)

### Timeline Estimate
| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Resilience | 2 weeks | None |
| Phase 2: Performance | 1 week | Phase 1 complete |
| Phase 3: Providers | 2 weeks | Backend WhatsApp API |
| Phase 4: Offline | 1 week | Phase 1, 3 complete |
| Phase 5: Testing | 1 week | All phases code complete |
| **Total** | **7 weeks** | + 1 week buffer |

### Infrastructure Needs
- **Development:**
  - No new tools required (all dependencies already installed)
  - Optional: Sentry account for error tracking

- **Testing:**
  - GitHub Actions runner time (existing)
  - Optional: Chromatic/Percy for visual regression tests

- **Production:**
  - No infrastructure changes
  - Monitor existing Node.js server capacity for WebSocket load

---

## Future Considerations

### Extensibility
- **Plugin System:** Abstract provider interface to support third-party integrations (Slack, Telegram, SMS)
- **Custom Widgets:** Allow embedding FrontDesk in other applications via iframe or Web Component
- **Mobile App:** React Native version sharing state management logic

### Long-Term Vision
- **AI-Powered Features:**
  - Smart reply suggestions
  - Automatic ticket categorization
  - Sentiment analysis on messages
  - Predictive routing (assign to best agent)

- **Analytics Dashboard:**
  - Response time metrics per channel
  - Agent performance tracking
  - Customer satisfaction scores
  - Channel preference insights

- **Advanced Automation:**
  - Workflow builder (if X, then Y)
  - Scheduled messages
  - Auto-replies based on rules
  - Chatbot integration

---

## Documentation Plan

### Files to Create
- [ ] `/docs/frontdesk/05-testing/TESTING_STRATEGY.md` (Testing approach)
- [ ] `/docs/frontdesk/00-core/ERROR_HANDLING_GUIDE.md` (Error boundary patterns)
- [ ] `/docs/frontdesk/00-core/PERFORMANCE_OPTIMIZATION.md` (Virtual scrolling guide)
- [ ] `/docs/frontdesk/01-providers/whatsapp/WHATSAPP_INTEGRATION.md` (WhatsApp setup)
- [ ] `/docs/frontdesk/01-providers/unified/UNIFIED_INBOX_ARCHITECTURE.md` (Aggregation logic)

### Files to Update
- [ ] `/docs/frontdesk/README.md` (Add Phase 1-5 status)
- [ ] `/docs/frontdesk/00-core/FRONTDESK_ARCHITECTURE.md` (Update architecture diagram)
- [ ] `/docs/frontdesk/00-core/DEVELOPER_GUIDE.md` (Add error handling, performance sections)
- [ ] `/CLAUDE.md` (Update provider status table)
- [ ] `/GEMINI.md` (Update provider status table)

### API Documentation
- [ ] OpenAPI/Swagger specs for new WhatsApp endpoints
- [ ] WebSocket event documentation for WhatsApp events
- [ ] Sync protocol API reference

---

## References & Research

### Internal References

**Architecture & Patterns:**
- Architecture overview: [docs/frontdesk/00-core/FRONTDESK_ARCHITECTURE.md](docs/frontdesk/00-core/FRONTDESK_ARCHITECTURE.md)
- Developer guide: [docs/frontdesk/00-core/DEVELOPER_GUIDE.md](docs/frontdesk/00-core/DEVELOPER_GUIDE.md)
- AI protocol: [CLAUDE.md:1-185](CLAUDE.md)

**Provider Implementations:**
- Internal DMs provider: [src/widgets/frontdesk/providers/internal/direct-messages-provider-view.tsx:29-506](src/widgets/frontdesk/providers/internal/direct-messages-provider-view.tsx)
- Email provider: [src/widgets/frontdesk/providers/email/email-provider-view.tsx:19-339](src/widgets/frontdesk/providers/email/email-provider-view.tsx)
- Tickets provider: [src/widgets/frontdesk/providers/tickets/hooks/use-tickets-provider.ts](src/widgets/frontdesk/providers/tickets/hooks/use-tickets-provider.ts) (1346 lines)
- WhatsApp provider (mock): [src/widgets/frontdesk/providers/whatsapp/hooks/use-whatsapp-provider.ts:40-149](src/widgets/frontdesk/providers/whatsapp/hooks/use-whatsapp-provider.ts)

**State Management:**
- Internal atoms: [src/store/frontdesk/atoms/internal.atoms.ts:1-99](src/store/frontdesk/atoms/internal.atoms.ts)
- Email atoms: [src/store/frontdesk/atoms/email.atoms.ts:1-99](src/store/frontdesk/atoms/email.atoms.ts)
- Tickets atoms: [src/store/frontdesk/atoms/tickets.atoms.ts:1-100](src/store/frontdesk/atoms/tickets.atoms.ts)

**Services:**
- WebSocket services: [src/services/frontdesk/websocket/index.ts:1-31](src/services/frontdesk/websocket/index.ts)
- API services: [src/services/frontdesk/api/index.ts:1-13](src/services/frontdesk/api/index.ts)
- Messaging socket: [src/services/frontdesk/websocket/messaging-socket.service.ts](src/services/frontdesk/websocket/messaging-socket.service.ts)

### External References

**Framework Documentation:**
- React 18.2 Documentation: https://react.dev
- Recoil 0.7.7 Documentation: https://recoiljs.org
- Socket.IO 4.8.1 Client API: https://socket.io/docs/v4/client-api/
- Next.js 13.5 Pages Router: https://nextjs.org/docs/pages/building-your-application/routing
- Material-UI 5.16 Components: https://mui.com/material-ui/
- TypeScript 5.4 Handbook: https://www.typescriptlang.org/docs/handbook/intro.html

**Best Practices & Patterns:**
- Error Boundaries Guide: https://legacy.reactjs.org/docs/error-boundaries.html
- React Window Documentation: https://react-window.vercel.app
- WebSocket Best Practices: https://blog.logrocket.com/websocket-tutorial-socket-io/
- Optimistic UI Patterns: https://react.dev/reference/react/useOptimistic

**Industry Examples:**
- Zendesk Agent Workspace: https://support.zendesk.com/hc/en-us/articles/4408823962906
- Front Unified Inbox: https://techcrunch.com/2023/09/20/front-goes-beyond-the-unified-inbox/
- Intercom Messenger: https://www.tidio.com/blog/zendesk-vs-intercom/

**Open Source References:**
- Chatwoot (Omnichannel inbox): https://github.com/chatwoot/chatwoot
- Novu (Notification infrastructure): https://github.com/novuhq/novu
- React Chat Examples: https://github.com/rob3000/react-chat

### Related Work
- Related backend documentation: `/Users/omarsabbah/Desktop/Messaging-Hub/docs/README.md`
- Tickets backend integration: [docs/frontdesk/01-providers/tickets/TICKETS_BACKEND_INTEGRATION.md](docs/frontdesk/01-providers/tickets/TICKETS_BACKEND_INTEGRATION.md)

---

## Appendix: Example File Structure

### New Files to Create (Estimated ~2000 lines total)

```
src/
├── components/error-boundary/
│   ├── ErrorBoundary.tsx                    # 120 lines
│   ├── ProviderErrorFallback.tsx            # 80 lines
│   └── index.ts                             # 10 lines
│
├── services/frontdesk/
│   ├── api/
│   │   └── whatsapp.service.ts              # 250 lines
│   ├── websocket/
│   │   ├── whatsapp-socket.service.ts       # 300 lines
│   │   └── connection-manager.ts            # 200 lines
│   └── offline-queue.service.ts             # 150 lines
│
├── store/frontdesk/atoms/
│   └── whatsapp.atoms.ts                    # 100 lines
│
├── widgets/frontdesk/
│   ├── components/
│   │   ├── ConnectionIndicator.tsx          # 60 lines
│   │   ├── VirtualizedTicketList.tsx        # 120 lines
│   │   └── VirtualizedMessageList.tsx       # 120 lines
│   │
│   ├── providers/
│   │   ├── whatsapp/
│   │   │   ├── hooks/
│   │   │   │   └── use-whatsapp-provider.ts # 400 lines (rewrite)
│   │   │   └── components/
│   │   │       ├── WhatsAppMessageCard.tsx  # 80 lines
│   │   │       └── WhatsAppMediaViewer.tsx  # 100 lines
│   │   │
│   │   └── unified/
│   │       ├── components/
│   │       │   └── UnifiedMessageViewer.tsx # 200 lines
│   │       └── hooks/
│   │           └── useUnifiedAggregation.ts # 300 lines
│   │
│   └── types/
│       └── normalized-message.types.ts      # 80 lines
│
└── __tests__/
    ├── hooks/
    │   ├── use-tickets-provider.test.ts     # 200 lines
    │   ├── use-direct-messages.test.ts      # 200 lines
    │   └── use-whatsapp-provider.test.ts    # 200 lines
    │
    └── integration/
        ├── websocket-reconnection.test.ts   # 150 lines
        └── offline-queue.test.ts            # 100 lines
```

---

**Estimated Total Effort:** 7-8 weeks (2 developers)
**Lines of Code:** ~2500 new, ~500 modified
**Priority:** 🔴 HIGH - Required for production deployment
