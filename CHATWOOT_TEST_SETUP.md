# Chatwoot Backend Testing Setup

## Overview

This document describes the new testing infrastructure created for the Chatwoot backend integration. This is a **separate, isolated testing environment** that exists alongside the current FrontDesk implementation.

## Purpose

- **Zero UI complexity**: Simple interface with buttons to test API endpoints
- **Backend validation**: Verify Chatwoot API responses and data structures
- **Migration preparation**: Foundation for implementing Phase 1 of `FRONTDESK_MIGRATION_PLAN.md`

## What Was Created

### 1. Service Layer

**File**: `src/services/frontdesk/api/chatwoot.service.ts`

- Implements Phase 1 of the migration plan
- Singleton instances of Chatwoot API clients:
  - `getChatwootConversationsApi()` - Conversations endpoint
  - `getChatwootMessagesApi()` - Messages endpoint
  - `getChatwootContactsApi()` - Contacts endpoint
  - `getChatwootInboxesApi()` - Inboxes endpoint
- Configures authentication using existing `getUserToken()` utility
- Base path from environment variable: `NEXT_PUBLIC_CHATWOOT_API_URL`

### 2. Test Page Component

**File**: `src/widgets/frontdesk/providers/chatwoot-test/chatwoot-test-page.tsx`

- Minimal UI with test buttons for each API endpoint
- Results display with success/error states
- Console logging for detailed response inspection
- No complex state management or UI interactions

### 3. Route Definition

**File**: `src/pages/frontdesk/chatwoot-test/index.page.tsx`

- Accessible at: **`http://localhost:3004/frontdesk/chatwoot-test`**
- Uses CustomerAuthLayout (requires authentication)
- Dynamic import with SSR disabled

### 4. Navigation Button

**Modified**: `src/widgets/header/header.tsx`

- Red bug icon button added to top navigation bar
- Located next to existing FrontDesk button
- Direct navigation to test page

## How to Use

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Access Test Page**:

   - Click the red bug icon in the top navigation bar, OR
   - Navigate directly to: `http://localhost:3004/frontdesk/chatwoot-test`

3. **Test API Endpoints**:

   - Click any test button (e.g., "Test: List Conversations")
   - Check the result directly on the page
   - Open browser console (F12) for detailed response data

4. **Expected Behavior**:
   - Most tests will **initially fail** if:
     - Backend is not configured
     - `NEXT_PUBLIC_CHATWOOT_API_URL` is not set
     - Account ID is incorrect (currently hardcoded to `1`)
   - Errors are displayed in the UI with details
   - All requests/responses are logged to console

## Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_CHATWOOT_API_URL=http://localhost:8080
# Or your Chatwoot backend URL
```

## Current Limitations

- Account ID is hardcoded to `1` in test functions
- Conversation ID is hardcoded to `1` for message tests
- No pagination or advanced query parameters
- Authentication assumes token from `getUserToken()` works with Chatwoot API

## Next Steps (Migration Plan)

This setup completes **Phase 1** of `FRONTDESK_MIGRATION_PLAN.md`. Future phases will:

1. **Phase 2**: Migrate `use-direct-messages.ts` hook to use Chatwoot APIs
2. **Phase 3**: Update Recoil state and UI components to use Chatwoot DTOs
3. **Phase 4**: Replace WebSocket implementation
4. **Phase 5**: Remove legacy code and complete migration

## Testing Checklist

- [ ] Verify test page is accessible
- [ ] Confirm button appears in navigation bar
- [ ] Test "List Conversations" endpoint
- [ ] Test "List Inboxes" endpoint
- [ ] Test "List Contacts" endpoint
- [ ] Test "Get Conversation Messages" endpoint
- [ ] Check console logs for response data
- [ ] Verify error handling for failed requests

## Files Modified/Created

### Created:

- `src/services/frontdesk/api/chatwoot.service.ts`
- `src/widgets/frontdesk/providers/chatwoot-test/chatwoot-test-page.tsx`
- `src/pages/frontdesk/chatwoot-test/index.page.tsx`
- `CHATWOOT_TEST_SETUP.md` (this file)

### Modified:

- `src/widgets/header/header.tsx` - Added test button
- `src/services/frontdesk/api/index.ts` - Exported chatwoot service

## Clean Separation

This testing infrastructure is **completely separate** from the existing FrontDesk implementation:

- No modifications to existing providers (Email, WhatsApp, Internal, Tickets)
- No changes to existing Recoil state
- No impact on current FrontDesk functionality
- Can be removed easily when migration is complete

## Troubleshooting

**Button doesn't appear in header:**

- Verify `src/widgets/header/header.tsx` was updated correctly
- Clear browser cache and refresh

**Test page returns 404:**

- Restart development server: `npm run dev`
- Verify page file exists at `src/pages/frontdesk/chatwoot-test/index.page.tsx`

**All tests fail with network errors:**

- Check `NEXT_PUBLIC_CHATWOOT_API_URL` environment variable
- Verify Chatwoot backend is running
- Check CORS configuration on backend

**Import errors in chatwoot.service.ts:**

- Verify `chatwoot/` directory exists at project root
- Run `npm install` to ensure dependencies are installed
