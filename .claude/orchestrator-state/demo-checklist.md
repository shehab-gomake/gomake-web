# FrontDesk Demo Checklist

**Last Updated**: 2025-10-19
**Target Demo Date**: TBD

---

## Critical Path (Must Have)

- [ ] **Internal DMs**: Send/receive messages in real-time
  - WebSocket connection established
  - Messages appear instantly
  - UI updates without refresh
- [ ] **Email**: OAuth connect + conversation view
  - Gmail/Outlook OAuth flow working
  - Conversations list displays correctly
  - Email content renders properly
- [ ] **Tickets**: List, view, assign, update status
  - Tickets list with filtering
  - Ticket detail view with messages
  - Status updates work
  - Assignment functionality
- [ ] **WebSocket**: Real-time updates working across all providers
  - Connection indicators show status
  - Reconnection logic handles failures
  - Events processed correctly
- [ ] **Navigation**: Smooth transitions between providers
  - Sidebar navigation functional
  - Provider switching seamless
  - No console errors during navigation

---

## Important (Should Have)

- [ ] **Unified Inbox**: All providers visible in single view
  - Messages from all sources aggregated
  - Filtering by provider works
  - Sorting by timestamp accurate
- [ ] **Error States**: Graceful handling of network failures
  - Connection lost message displays
  - Retry mechanisms work
  - User feedback is clear
- [ ] **Loading States**: User feedback during async operations
  - Spinners show during data fetch
  - Skeleton screens for initial load
  - No jarring content shifts
- [ ] **Empty States**: Clear messaging when no data
  - Helpful instructions for new users
  - Visual clarity on empty views
  - Call-to-action buttons present

---

## Nice to Have (Could Have)

- [ ] **WhatsApp**: Basic conversation view (mock data OK)
  - Mock conversations display
  - Basic UI layout matches pattern
- [ ] **Search**: Filter messages/tickets
  - Search input functional
  - Results update in real-time
- [ ] **Notifications**: Badge counts for unread items
  - Accurate unread counts
  - Updates in real-time
  - Visual indicators on sidebar

---

## Blockers & Risks

- [ ] None currently

*(Update this section as blockers arise)*

---

## Demo Script Validation

- [ ] **End-to-end flow tested**
  - Walked through complete user journey
  - All critical paths work
  - No dead ends or broken links
- [ ] **No console errors**
  - Browser console clean
  - No TypeScript errors
  - No React warnings
- [ ] **Performance acceptable**
  - Page loads < 2s
  - Interactions feel responsive
  - No janky animations
- [ ] **Cross-browser tested**
  - Chrome/Edge working
  - Safari tested (if applicable)
- [ ] **Data scenarios covered**
  - Empty state tested
  - Single item tested
  - Multiple items tested
  - Error state tested

---

## Pre-Demo Checklist

- [ ] **Code quality**
  - No commented-out code
  - Console.logs removed
  - Code formatted consistently
- [ ] **Visual polish**
  - Colors consistent with design
  - Spacing/alignment correct
  - Icons and images load
- [ ] **Content ready**
  - Test data prepared
  - Mock accounts configured
  - Sample messages created
- [ ] **Environment stable**
  - Dev server running smoothly
  - No build warnings
  - All dependencies installed

---

## Demo Day Readiness

**Status**: 🔴 Not Ready / 🟡 In Progress / 🟢 Ready

- Current Status: 🔴 Not Ready
- Tasks Completed: 0/X
- Critical Blockers: None
- Confidence Level: TBD

**Notes**:
*(Add any notes or concerns before demo day)*
