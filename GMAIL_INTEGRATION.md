# Gmail Integration Setup

The Gmail integration has been successfully implemented as a provider within the Front Desk system, using Next.js API proxy routes to avoid CORS issues.

## Architecture

### Request Flow (CORS-Free)

1. **Frontend (localhost:3004)** → Next.js API routes (same origin, no CORS)
2. **Next.js API routes** → Messaging Service (localhost:3000) via server-side fetch
3. **Response flows back** through the same path

This approach eliminates CORS preflight OPTIONS requests entirely.

## API Endpoints

Frontend makes calls to Next.js API routes, which proxy to messaging service:

- **Frontend calls**: `GET localhost:3004/api/gmail/profile`
- **Proxies to**: `GET localhost:3000/api/gmail/profile`

Available endpoints:
- `/api/gmail/profile` - Connection status
- `/api/gmail/auth-url` - OAuth URL generation
- `/api/gmail/conversations` - Conversations list
- `/api/gmail/conversations/[id]` - Single conversation details
- `/api/gmail/send` - Send email
- `/api/gmail/disconnect` - Disconnect account

## Project Structure (Provider-Based Organization)

### Next.js API Proxy Routes:
- `src/pages/api/gmail/profile.ts`
- `src/pages/api/gmail/auth-url.ts`
- `src/pages/api/gmail/callback.ts`
- `src/pages/api/gmail/conversations.ts`
- `src/pages/api/gmail/conversations/[id].ts`
- `src/pages/api/gmail/send.ts`
- `src/pages/api/gmail/disconnect.ts`

### Gmail Provider Components:
- `src/widgets/frontdesk/providers/gmail/gmail-provider-view.tsx` - Main Gmail UI
- `src/widgets/frontdesk/providers/gmail/gmail-conversation-list.tsx` - Conversation list component
- `src/widgets/frontdesk/providers/gmail/gmail-auth-modal.tsx` - OAuth modal

### Gmail Provider Hooks:
- `src/hooks/frontdesk/providers/gmail/index.ts` - Exports for all Gmail hooks
- `src/hooks/frontdesk/providers/gmail/use-gmail-auth.ts` - Authentication & OAuth flow
- `src/hooks/frontdesk/providers/gmail/use-gmail-conversations.ts` - Conversations list with pagination
- `src/hooks/frontdesk/providers/gmail/use-gmail-conversation-detail.ts` - Single conversation details
- `src/hooks/frontdesk/providers/gmail/use-gmail-send.ts` - Send/reply functionality

### Gmail Provider Services:
- `src/services/api-service/frontdesk/providers/gmail/gmail-endpoints.ts` - Gmail API service functions

### Gmail Provider State:
- `src/store/frontdesk/providers/gmail.ts` - Recoil state management

## Provider Integration

Gmail is now properly integrated as one of the Front Desk providers alongside WhatsApp and Internal messaging. The provider-based structure allows for:

- **Consistent Interface**: All providers follow the same pattern
- **Easy Extension**: New providers can be added following the same structure
- **Clear Separation**: Each provider's logic is isolated
- **Maintainability**: Clear organization makes the codebase easier to navigate

## Testing

Network tab should show requests to same origin:
```
localhost:3004/api/gmail/profile
localhost:3004/api/gmail/conversations
```

Backend console will show proxied requests:
```
GET /api/gmail/profile 200 in 1375ms
```

## Development

1. Ensure messaging service runs on `localhost:3000`
2. Frontend runs on `localhost:3004`
3. All Gmail API calls automatically proxy through Next.js API routes
4. No CORS configuration needed - everything works seamlessly!

## Adding New Providers

To add a new provider (e.g., SMS, Facebook), follow the Gmail structure:

1. Create provider directory: `src/widgets/frontdesk/providers/[provider-name]/`
2. Add provider hooks: `src/hooks/frontdesk/providers/[provider-name]/`
3. Add API services: `src/services/api-service/frontdesk/providers/[provider-name]/`
4. Add state management: `src/store/frontdesk/providers/[provider-name].ts`
5. Update `frontdesk-widget.tsx` to include the new provider tab