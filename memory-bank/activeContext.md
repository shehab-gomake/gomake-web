# Active Context: gomake-web

## Current Focus

**FrontDesk Feature Development** - Working exclusively within the FrontDesk unified messaging hub feature. The project is in active development with most core providers complete.

### Current Work Areas

1. **Provider Completion**: Tickets and Internal DMs fully functional, Email integrated, WhatsApp pending backend
2. **Unified Inbox**: Partial aggregation logic, needs completion for true multi-channel view
3. **Performance Optimization**: Large bundle size requires optimization
4. **Documentation**: Comprehensive KB exists in `docs/frontdesk-kb/`

## Recent Changes

### January 2025

- ✅ Enhanced FrontDesk Knowledge Base with 12-step provider guide
- ✅ Updated Bug Fixing Guide with debugging tools and techniques
- ✅ Comprehensive Testing Guide with patterns and checklists
- ✅ Tickets Provider fully integrated with 12 WebSocket events

### October 2025

- ✅ Memory Bank initialized with complete project context
- ✅ All core memory files populated with accurate information
- ✅ Documentation references established

## Next Steps

### Short-term (Current Sprint)

1. **Performance**: Analyze bundle size and optimize imports
2. **Unified Inbox**: Complete cross-provider aggregation logic
3. **WhatsApp Backend**: Coordinate with backend team for WhatsApp provider API
4. **Testing**: Expand test coverage for provider hooks

### Medium-term (Next 2 Sprints)

1. **Search Enhancement**: Improve global search performance
2. **Offline Support**: Add service worker for offline message queuing
3. **Accessibility**: WCAG 2.1 AA compliance audit
4. **Mobile Responsive**: Optimize three-column layout for mobile

### Long-term (Roadmap)

1. **Voice/Video**: Integrate WebRTC for voice and video calls
2. **AI Assistant**: Add AI-powered message suggestions
3. **Analytics Dashboard**: User engagement and response time metrics
4. **Multi-language**: i18n support for international teams

## Active Decisions

### 1. **Bundle Optimization Strategy**

- **Context**: Build requires 4GB memory, bundle size is large
- **Options**:
  - Code splitting by provider
  - Dynamic imports for heavy libraries
  - Remove duplicate UI libraries (keep MUI, evaluate removing Ant Design)
- **Status**: Analysis in progress

### 2. **Unified Inbox Implementation**

- **Context**: Aggregating messages from all providers into single view
- **Challenge**: Different data structures and real-time update patterns
- **Approach**: Adapter pattern with normalized message interface
- **Status**: 60% complete, aggregation logic working, sorting needs work

### 3. **WhatsApp Provider**

- **Context**: UI is complete, backend API not ready
- **Decision**: Keep mock implementation, ready for backend integration
- **Blocker**: Waiting on Messaging-Hub WhatsApp module
- **ETA**: Backend team timeline TBD

## Open Questions

### Technical Questions

1. **State Persistence**: Should we persist message cache in IndexedDB for better performance?
2. **WebSocket Scaling**: How to handle multiple WebSocket connections efficiently?
3. **Error Boundaries**: Need provider-level error boundaries or component-level?

### Product Questions

1. **Unified Inbox Priority**: Should all providers or just Email + Tickets initially?
2. **Notification Strategy**: Browser notifications vs in-app only?
3. **Message Retention**: How long should client cache messages locally?

### Integration Questions

1. **Backend API Versioning**: How to handle backend API changes gracefully?
2. **OAuth Refresh**: Should frontend handle token refresh or rely on backend?
3. **WebSocket Reconnection**: What's acceptable reconnection delay UX?

## Blockers

### Current Blockers

None - all providers operating independently

### Potential Blockers

1. **WhatsApp Backend Dependency**: Cannot complete WhatsApp provider without backend API
2. **Bundle Size**: May impact production deployment if not optimized
3. **Backend Breaking Changes**: No API versioning strategy currently

## Resources Needed

- **Performance Expert**: For bundle optimization consultation
- **Backend Coordination**: For WhatsApp API timeline and specifications
- **UX Review**: For mobile-responsive three-column layout

## Email Provider Integration Details

### Backend Integration (Messaging-Hub)

The Email provider is **fully integrated** with Messaging-Hub backend for reading emails:

**REST API Endpoints Used:**

- `GET /email/accounts` - List connected email accounts
- `GET /email/accounts/:id/messages` - Get conversations with pagination
- `GET /email/accounts/:id/conversations/:cid` - Get conversation details
- `GET /email/accounts/:id/labels` - Get folders/labels
- `POST /email/accounts/:id/messages/:mid/read` - Mark as read
- `POST /email/accounts/:id/messages/:mid/archive` - Archive message
- `POST /email/accounts/:id/send` - Send email
- `GET /auth/oauth/google` - Get OAuth URL for Gmail

**Implementation Files:**

- `src/widgets/frontdesk/providers/email/utils/email-api-client.ts` - REST API client
- `src/widgets/frontdesk/providers/email/hooks/use-email-conversations.ts` - React hook with WebSocket
- `src/widgets/frontdesk/providers/email/hooks/use-email-messages.ts` - Message management
- `src/services/frontdesk/websocket/email-websocket.service.ts` - Real-time updates

**Data Flow:**

1. User selects email account → Hook calls `emailApiClient.getConversations()`
2. Backend fetches from Gmail/Outlook API → Returns paginated conversations
3. Frontend stores in Recoil state (`emailConversationsState`)
4. WebSocket listens for `NEW_EMAIL`, `EMAIL_UPDATED`, `EMAIL_READ` events
5. Real-time updates automatically refresh conversation list

**Key Features Working:**

- ✅ Multi-account support (Gmail + Outlook)
- ✅ Pagination with infinite scroll (`pageToken` from backend)
- ✅ Real-time email notifications via WebSocket
- ✅ Mark as read/unread with optimistic updates
- ✅ Archive and delete operations
- ✅ OAuth token management (transparent to frontend)
- ✅ Search within conversations
- ✅ Email threading support

---

_Last Updated: October 20, 2025_
_Status: Active Development - FrontDesk Feature_
