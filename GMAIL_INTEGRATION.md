# Gmail Integration Setup

The Gmail integration has been successfully implemented using Next.js API proxy routes to avoid CORS issues.

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

## Files Created/Modified

### Next.js API Proxy Routes:
- `src/pages/api/gmail/profile.ts`
- `src/pages/api/gmail/auth-url.ts`
- `src/pages/api/gmail/callback.ts`
- `src/pages/api/gmail/conversations.ts`
- `src/pages/api/gmail/conversations/[id].ts`
- `src/pages/api/gmail/send.ts`
- `src/pages/api/gmail/disconnect.ts`

### Gmail Integration:
- `src/services/api-service/gmail/gmail-endpoints.ts` - Gmail API service functions
- `src/store/gmail.ts` - Recoil state management
- `src/hooks/use-gmail-auth.ts` - Authentication & OAuth flow
- `src/hooks/use-gmail-conversations.ts` - Conversations list with pagination
- `src/hooks/use-gmail-conversation-detail.ts` - Single conversation details
- `src/hooks/use-gmail-send.ts` - Send/reply functionality
- `src/widgets/frontdesk/components/gmail-inbox-view.tsx` - Main Gmail UI
- `src/widgets/frontdesk/components/gmail-auth-modal.tsx` - OAuth modal

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