# Bug Fixing Guide

This comprehensive playbook outlines a structured approach to debugging and fixing issues within the FrontDesk system.

## Table of Contents
1. [Reproduce & Isolate](#reproduce--isolate)
2. [Enable Debugging](#enable-debugging)
3. [Debugging Tools](#debugging-tools)
4. [Common Issues by Layer](#common-issues-by-layer)
5. [Provider-Specific Issues](#provider-specific-issues)
6. [Testing Your Fix](#testing-your-fix)

---

## Reproduce & Isolate

### Step 1: Document the Bug
Create a clear bug report:
- **What happened?** (Actual behavior)
- **What should have happened?** (Expected behavior)
- **Steps to reproduce** (Detailed, numbered steps)
- **Environment** (Browser, OS, user role)
- **Screenshots/Videos** (If applicable)

### Step 2: Reproduce Consistently
- Follow the exact steps to reproduce
- Try in different browsers (Chrome, Firefox, Safari)
- Test with different user roles (USER, MANAGER, ADMIN)
- Check if it happens only in certain conditions

### Step 3: Identify the Layer
FrontDesk has three main layers where bugs can occur:

| Layer | Description | Files |
|-------|-------------|-------|
| **UI Layer** | Visual glitches, layout issues, component rendering | `src/widgets/frontdesk/providers/*/components/` |
| **State Layer** | Data not updating, stale state, sync issues | `src/store/frontdesk/atoms/` |
| **Service Layer** | API failures, WebSocket disconnections, network errors | `src/services/frontdesk/` |

---

## Enable Debugging

### Browser Console Debugging

Enable verbose logging in your browser console:

```javascript
// Enable FrontDesk debug logging
localStorage.setItem('FRONTDESK_DEBUG', 'true')

// Enable specific provider debugging
localStorage.setItem('FRONTDESK_DEBUG_TICKETS', 'true')
localStorage.setItem('FRONTDESK_DEBUG_DMS', 'true')
localStorage.setItem('FRONTDESK_DEBUG_EMAIL', 'true')

// Disable debugging
localStorage.removeItem('FRONTDESK_DEBUG')
```

After setting, refresh the page. You'll see detailed logs like:
```
[TicketsProvider] Fetching tickets with filters: {...}
[TicketsProvider] WebSocket event: ticket.updated
[DirectMessages] Message sent successfully: msg-123
```

### React DevTools

Install React Developer Tools extension:
- Chrome: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Usage:**
1. Open DevTools (F12)
2. Click "Components" tab
3. Navigate to FrontDesk components
4. Inspect props and state in real-time

### Recoil DevTools

View and modify Recoil state in real-time:

```bash
# Install Recoil DevTools
npm install --save-dev recoil-devtools
```

```typescript
// Add to your app root (if not already present)
import { RecoilDevTools } from 'recoil-devtools';

<RecoilRoot>
  <RecoilDevTools />
  <App />
</RecoilRoot>
```

**Usage:**
1. Open browser console
2. Look for Recoil DevTools panel
3. Inspect all atoms and selectors
4. See state changes in real-time

---

## Debugging Tools

### 1. Browser Network Tab

**When to use:** API failures, slow requests, authentication issues

**How to use:**
1. Open DevTools (F12) → Network tab
2. Reproduce the bug
3. Look for red (failed) requests
4. Click on failed request → "Preview" or "Response" tab

**Common Issues:**
```
401 Unauthorized → Check authentication token
403 Forbidden → Check user permissions/role
404 Not Found → Check API endpoint URL
500 Internal Server Error → Backend error, check backend logs
```

### 2. WebSocket Inspector

**When to use:** Real-time updates not working, connection issues

**How to use:**
1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Click on WebSocket connection
4. View "Messages" tab to see sent/received events

**What to look for:**
- Connection established (Status 101)
- Events being sent/received
- Connection errors or disconnections

**Example:**
```
← ticket.created {"ticketId": "123", ...}  // Received
→ subscribe {"room": "tickets"}           // Sent
```

### 3. Console Logging

Add strategic console.log statements:

```typescript
// At the start of a function
console.log('[BugFix] Function called with:', { param1, param2 });

// Before API call
console.log('[BugFix] Making API call:', endpoint, payload);

// After API response
console.log('[BugFix] API response:', response);

// In catch block
console.error('[BugFix] Error occurred:', error, {
  message: error.message,
  response: error.response?.data,
  stack: error.stack
});
```

### 4. React Error Boundaries

Check if the error is caught by an error boundary:

```typescript
// Look for this in the console
Error: [Error message]
  at ComponentName (file.tsx:123)
  at ...
```

---

## Common Issues by Layer

### UI Layer Issues

#### Issue: Component Not Rendering

**Symptoms:**
- Blank screen or missing component
- "Cannot read property of undefined" errors

**Debug Steps:**
1. Check React DevTools for component hierarchy
2. Verify props are being passed correctly
3. Check for conditional rendering that might be hiding the component

```typescript
// Bad: Component won't render if data is undefined
{data.map(item => <Item key={item.id} />)}

// Good: Add safety check
{data?.map(item => <Item key={item.id} />) || <EmptyState />}
```

#### Issue: Styling Not Applied

**Symptoms:**
- Component appears but looks wrong
- CSS classes not applying

**Debug Steps:**
1. Inspect element in browser DevTools
2. Check if CSS class is present on element
3. Look for conflicting styles
4. Check Material-UI `sx` prop syntax

```typescript
// Common MUI sx prop issues
<Box sx={{ marginTop: 2 }}>  // ✅ Correct (theme spacing)
<Box sx={{ marginTop: '2px' }}>  // ✅ Also correct (pixels)
<Box sx={{ margin-top: 2 }}>  // ❌ Wrong syntax
```

#### Issue: Infinite Re-renders

**Symptoms:**
- Page freezes or becomes unresponsive
- Console shows "Maximum update depth exceeded"

**Debug Steps:**
1. Check for missing dependencies in `useEffect`
2. Look for state updates that trigger themselves
3. Check if objects/arrays are being created in render

```typescript
// Bad: Creates new array on every render
const items = data.filter(item => item.active);

// Good: Use useMemo
const items = useMemo(
  () => data.filter(item => item.active),
  [data]
);
```

---

### State Layer Issues

#### Issue: Stale Data / State Not Updating

**Symptoms:**
- UI shows old data after update
- Changes don't reflect immediately

**Debug Steps:**
1. Open Recoil DevTools and watch the atom
2. Check if the state update is actually being called
3. Verify you're not mutating state directly

```typescript
// Bad: Direct mutation (won't trigger re-render)
const [tickets, setTickets] = useRecoilState(ticketsAtom);
tickets.push(newTicket);  // ❌ Wrong!

// Good: Create new array
setTickets([...tickets, newTicket]);  // ✅ Correct

// Good: Using callback for complex updates
setTickets(prev => [...prev, newTicket]);  // ✅ Best
```

#### Issue: State Reset on Navigation

**Symptoms:**
- State clears when navigating between views
- Data lost on page refresh

**Debug Steps:**
1. Check if atoms have persistence effects
2. Verify localStorage is enabled in browser
3. Check atom key naming convention

```typescript
// Add localStorage persistence to atom
export const myAtom = atom({
  key: 'frontdesk.provider.data',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      // Load from localStorage on init
      const saved = localStorage.getItem('frontdesk.provider.data');
      if (saved) {
        setSelf(JSON.parse(saved));
      }

      // Save to localStorage on change
      onSet((newValue) => {
        localStorage.setItem('frontdesk.provider.data', JSON.stringify(newValue));
      });
    },
  ],
});
```

#### Issue: Selector Not Updating

**Symptoms:**
- Derived state doesn't recalculate
- UI shows incorrect computed values

**Debug Steps:**
1. Check selector dependencies
2. Verify atoms are updating
3. Add console.log inside selector

```typescript
export const filteredTicketsSelector = selector({
  key: 'frontdesk.tickets.filtered',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const filters = get(filtersAtom);

    console.log('[Selector] Recalculating with:', { tickets, filters });

    return tickets.filter(ticket => {
      // Filter logic
    });
  },
});
```

---

### Service Layer Issues

#### Issue: API Request Failing

**Symptoms:**
- Network errors in console
- Data not loading

**Debug Steps:**
1. Check Network tab for the failed request
2. Verify API endpoint URL
3. Check request headers (especially `Authorization`)
4. Verify request payload matches backend DTO

```typescript
// Debug API service
class TicketsService {
  async listTickets(filters: TicketFilters) {
    console.log('[TicketsService] Request:', {
      url: `${BASE_URL}/api/tickets`,
      headers: this.getHeaders(),
      params: filters
    });

    try {
      const response = await axios.get(...);
      console.log('[TicketsService] Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[TicketsService] Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
}
```

#### Issue: WebSocket Not Receiving Events

**Symptoms:**
- Real-time updates not working
- UI doesn't update when data changes on backend

**Debug Steps:**
1. Check WebSocket connection status
2. Verify event listeners are registered
3. Check if events are being sent from backend
4. Look for connection errors

```typescript
// Debug WebSocket connection
useEffect(() => {
  console.log('[WebSocket] Connecting...');

  ticketSocketService.connect(token)
    .then(() => {
      console.log('[WebSocket] Connected successfully');
      console.log('[WebSocket] Socket ID:', ticketSocketService.getSocketId());
    })
    .catch(error => {
      console.error('[WebSocket] Connection failed:', error);
    });

  // Debug event listeners
  ticketSocketService.onTicketCreated((payload) => {
    console.log('[WebSocket] ticket.created event:', payload);
  });

  return () => {
    console.log('[WebSocket] Disconnecting...');
    ticketSocketService.disconnect();
  };
}, []);
```

#### Issue: CORS Errors

**Symptoms:**
- Console shows "CORS policy" error
- API requests blocked by browser

**Debug Steps:**
1. Check if backend CORS is configured
2. Verify API URL matches allowed origins
3. Check if credentials are being sent

**Solution:**
```typescript
// Add withCredentials if needed
axios.get(url, {
  withCredentials: true,
  headers: this.getHeaders()
});
```

---

## Provider-Specific Issues

### Tickets Provider

#### Issue: Tickets Not Loading
**Check:**
- User role permissions (USER can only see assigned tickets)
- Filters applied (might be filtering everything out)
- Backend ticket service running

**Debug:**
```typescript
console.log('[Tickets] Filters:', ticketsProvider.filters);
console.log('[Tickets] User role:', currentUser.role);
console.log('[Tickets] API response:', await ticketsService.listTickets());
```

#### Issue: Tags Not Appearing
**Check:**
- Tag API endpoints returning data
- Tags being added to ticket correctly
- Tag selectors properly configured

**Debug:**
```typescript
console.log('[Tickets] Popular tags:', ticketsProvider.popularTags);
console.log('[Tickets] Selected ticket tags:', ticketsProvider.selectedTicket?.tags);
```

### Direct Messages Provider

#### Issue: Messages Not Sending
**Check:**
- WebSocket connection active
- Conversation ID valid
- Message content not empty

**Debug:**
```typescript
console.log('[DM] Sending message:', {
  conversationId: activeConversationId,
  content: message,
  socketConnected: messagingService.isConnected()
});
```

#### Issue: Unread Count Incorrect
**Check:**
- Read receipts being sent
- Unread calculation logic
- Conversation state

### Email Provider

#### Issue: OAuth Token Expired
**Symptoms:**
- 401 errors from Gmail API
- "Re-authenticate" message

**Solution:**
- Refresh OAuth token
- Re-authenticate with Gmail

---

## Testing Your Fix

### 1. Verify the Fix

**Test the exact scenario from the bug report:**
1. Follow reproduction steps
2. Confirm bug no longer occurs
3. Test edge cases

### 2. Regression Testing

**Ensure you didn't break anything else:**
- Test related features
- Check other providers still work
- Run automated tests: `npm run test`

### 3. Add a Test Case

**Prevent the bug from happening again:**

```typescript
// Unit test example
describe('TicketsProvider', () => {
  it('should handle empty tickets list', () => {
    const { result } = renderHook(() => useTicketsProvider());
    expect(result.current.filteredTickets).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
```

### 4. Test in Different Scenarios

- [ ] Different user roles (USER, MANAGER, ADMIN)
- [ ] Different browsers (Chrome, Firefox, Safari)
- [ ] Different network conditions (slow 3G, offline)
- [ ] Different screen sizes (mobile, tablet, desktop)

---

## Quick Reference: Console Commands

```javascript
// View all Recoil state
window.__RECOIL_DEVTOOLS_EXTENSION__.getSnapshot()

// Clear all localStorage
localStorage.clear()

// Check authentication token
localStorage.getItem('authToken')

// Force reload without cache
location.reload(true)

// Copy object to clipboard for inspection
copy(object)
```

---

## When to Escalate

If you've tried the above and still can't fix the bug, escalate if:
- Backend API is returning errors (coordinate with backend team)
- Browser-specific issue that can't be reproduced
- Performance issue requiring profiling tools
- Security concern or authentication issue

**Document what you've tried** before escalating:
- Steps taken to debug
- Console logs and error messages
- Network tab screenshots
- Suspected root cause
