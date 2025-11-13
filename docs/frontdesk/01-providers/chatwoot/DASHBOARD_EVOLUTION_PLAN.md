# Chatwoot Dashboard Evolution Plan

**Status:** 📋 Planning  
**Created:** 2025-01-12  
**Goal:** Transform the Chatwoot dashboard from a "one-size-fits-all" solution into an insight-driven command center tailored to user roles.

---

## Executive Summary

The current Chatwoot dashboard provides a good foundation, but it's generic for all users. This plan outlines a three-phase evolution to create role-specific dashboards that provide actionable insights:

- **Phase 1:** Role-based dashboards (Agent vs Admin/Manager)
- **Phase 2:** Rich data visualization with charts
- **Phase 3:** Increased actionability with clickable cards and SLA alerts

---

## Current State Analysis

### Existing Infrastructure ✅

- **Dashboard View:** `src/widgets/frontdesk/providers/chatwoot/views/dashboard-view.tsx`
- **Stats Hook:** `useChatwootDashboardStats()` - Calculates metrics from conversations
- **Permissions Hook:** `useChatwootPermissions()` - Provides `isAdministrator`, `isAgent`, `userRole`
- **Components:**
  - `ChatwootStatsCards` - Displays stat cards
  - `ChatwootActivityFeed` - Shows recent activity
  - `ChatwootDashboardSidebar` - Quick views (My Conversations, Mentions, Unattended)

### Current Metrics

- Unread conversations
- Open conversations
- My conversations (assigned to user)
- Mentions
- Unattended conversations
- Active today (last 24h)
- Unread notifications

### Current Limitations

- Generic stats for all users (not role-specific)
- No visual charts (numbers only)
- Stats cards are clickable but navigation is basic
- No SLA tracking or alerts
- Activity feed shows all conversations (not filtered by role)

---

## Phase 1: Role-Based Dashboards

**Goal:** Create distinct dashboard experiences for Agents vs Admins/Managers

### 1.1 Detect User Role

**Implementation:**
- ✅ Already available via `useChatwootPermissions()` hook
- Add helper function to determine dashboard type:
  ```typescript
  const getDashboardType = (): 'agent' | 'admin' => {
    if (isAdministrator) return 'admin';
    // Managers can be detected via custom roles or permissions
    if (checkPermissions(['conversation_manage', 'report_manage'])) return 'admin';
    return 'agent';
  };
  ```

**Files to Modify:**
- `src/widgets/frontdesk/providers/chatwoot/views/dashboard-view.tsx`
- `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-dashboard-stats.ts` (add role-specific stats)

---

### 1.2 Agent Dashboard

**Focus:** Personal performance and immediate tasks

**Key Widgets:**

#### My Performance Cards
Replace generic stats with agent-specific metrics:

- **My Open Tickets:** Count of open conversations assigned to current user
- **My Average Response Time:** Calculate from message timestamps
- **My Resolved Tickets Today:** Count of resolved conversations assigned to user (last 24h)

**Implementation:**
```typescript
// Add to useChatwootDashboardStats hook
export interface AgentDashboardStats extends ChatwootDashboardStats {
  myOpenTickets: number;
  myAverageResponseTime: number; // in minutes
  myResolvedToday: number;
}
```

#### My Activity Feed
Filter activity feed to show only agent-relevant events:
- Assignments to them
- Mentions of them
- Their replies
- Conversations they're assigned to

**Implementation:**
- Modify `ChatwootActivityFeed` component to accept `userId` filter
- Filter conversations by `meta.assignee.id === currentUserId`

#### "Needs My Attention" Widget
A prioritized list combining:
- Assigned open conversations (sorted by unread count, then timestamp)
- Mentions (sorted by timestamp)

**New Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/agent-attention-list.tsx`

---

### 1.3 Admin Dashboard

**Focus:** Team performance and overall system health

**Key Widgets:**

#### Team Performance Cards
- **Total Open Tickets:** All open conversations across all agents
- **Unassigned Tickets:** Open conversations without assignee
- **Average Team Response Time:** Aggregate response time across all agents

**Implementation:**
```typescript
// Add to useChatwootDashboardStats hook
export interface AdminDashboardStats extends ChatwootDashboardStats {
  totalOpenTickets: number;
  unassignedTickets: number;
  averageTeamResponseTime: number; // in minutes
}
```

#### Agent Leaderboard
New component showing ranked list of agents by:
- Resolved conversations (this week/month)
- Average response time
- Open conversations count

**New Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/agent-leaderboard.tsx`

**Data Requirements:**
- Need to fetch agent list with stats (may require new API endpoint)
- Or calculate from conversations data (filter by assignee)

#### Inbox Hotspots
View showing which inboxes have:
- Most traffic (conversation count)
- Longest wait times (time since last message)
- Highest unread counts

**New Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/inbox-hotspots.tsx`

**Data Source:** Group conversations by `inbox_id` and calculate metrics

---

### 1.4 Implementation Steps

1. **Create Dashboard Type Detection**
   - Add `useChatwootDashboardType()` hook
   - Returns `'agent' | 'admin'`

2. **Refactor Dashboard View**
   - Conditionally render Agent vs Admin components
   - Create `AgentDashboardView` and `AdminDashboardView` sub-components

3. **Extend Stats Hook**
   - Add role-specific stat calculations
   - Split into `useAgentDashboardStats()` and `useAdminDashboardStats()`

4. **Create New Components**
   - Agent Attention List
   - Agent Leaderboard
   - Inbox Hotspots

5. **Update Activity Feed**
   - Add user filtering for agent view

**Estimated Effort:** 2-3 days

---

## Phase 2: Rich Data Visualization

**Goal:** Replace numbers with visual charts for better data comprehension

### 2.1 Chart Library Integration

**Proposed Library:** Recharts (lightweight, React-friendly)

**Installation:**
```bash
npm install recharts
```

**Why Recharts:**
- Lightweight (~200KB)
- Built for React
- Good TypeScript support
- Responsive by default
- Active maintenance

**Alternative:** Chart.js with react-chartjs-2 (heavier but more features)

---

### 2.2 Admin Visualizations

#### Conversation Volume Chart (Line Chart)
- **X-axis:** Last 7 days
- **Y-axis:** Conversation count
- **Data:** Group conversations by `created_at` date
- **Purpose:** Show trends in conversation volume

**Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/charts/conversation-volume-chart.tsx`

#### Conversation Status Breakdown (Pie Chart)
- **Segments:** Open, Pending, Resolved, Snoozed
- **Data:** Count conversations by `status`
- **Purpose:** Quick overview of conversation distribution

**Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/charts/status-breakdown-chart.tsx`

---

### 2.3 Agent Visualizations

#### Resolved Conversations Per Day (Bar Chart)
- **X-axis:** Days of current week (Mon-Sun)
- **Y-axis:** Resolved conversation count
- **Data:** Filter resolved conversations by assignee and date
- **Purpose:** Show agent's daily productivity

**Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/charts/agent-resolved-chart.tsx`

---

### 2.4 Implementation Steps

1. **Install Recharts**
   ```bash
   npm install recharts
   ```

2. **Create Chart Components**
   - Conversation Volume Chart (Admin)
   - Status Breakdown Chart (Admin)
   - Agent Resolved Chart (Agent)

3. **Add Data Processing**
   - Create utilities to group conversations by date/status
   - Add to stats hooks or create separate data processing hooks

4. **Integrate Charts into Dashboards**
   - Add charts to appropriate dashboard views
   - Ensure responsive layout

**Estimated Effort:** 2-3 days

---

## Phase 3: Increase Actionability

**Goal:** Make the dashboard not just informative, but actionable

### 3.1 Smart Filter Navigation

**Current State:** Stats cards are clickable but navigate to generic views

**Enhancement:** Make each stat card a "smart filter" that navigates with pre-applied filters

**Examples:**

#### Admin Dashboard
- **"Unassigned Tickets" card** → Navigate to "All Conversations" with `assignee_type: 'unassigned'` filter
- **"Total Open Tickets" card** → Navigate to "All Conversations" with `status: 'open'` filter
- **"Average Team Response Time" card** → Navigate to "All Conversations" sorted by response time

#### Agent Dashboard
- **"My Open Tickets" card** → Navigate to "My Inbox" with `status: 'open'` filter
- **"My Resolved Today" card** → Navigate to "My Inbox" with `status: 'resolved'` and date filter
- **"Needs My Attention" card** → Navigate to "Mentions" view

**Implementation:**
- Extend `handleCardClick` in `dashboard-view.tsx`
- Pass filter parameters to router navigation
- Update router to accept filter parameters (may need to extend `useChatwootRouter`)

**Files to Modify:**
- `src/widgets/frontdesk/providers/chatwoot/views/dashboard-view.tsx`
- `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-router.ts` (if needed)

---

### 3.2 SLA (Service Level Agreement) Alerts

**Purpose:** Highlight conversations that need immediate attention

**For Admins:**
- **SLA Breaches Indicator:** Prominent badge/card showing conversations waiting too long
- **Threshold:** Configurable (default: 4 hours without response)
- **Display:** Count + list of conversations
- **Action:** Click to navigate to filtered view

**For Agents:**
- **Personal SLA Alerts:** Show their assigned conversations approaching SLA threshold
- **Visual Indicator:** Color-coded (green/yellow/red) based on time remaining

**Implementation:**

#### SLA Calculation
```typescript
// Add to stats hook
interface SLAMetrics {
  breachedCount: number;
  approachingCount: number; // Within 1 hour of threshold
  breachedConversations: Conversation[];
}

const calculateSLA = (
  conversations: Conversation[],
  thresholdHours: number = 4
): SLAMetrics => {
  const now = Date.now();
  const thresholdMs = thresholdHours * 60 * 60 * 1000;
  
  const breached = conversations.filter(conv => {
    const lastMessageTime = getLastMessageTime(conv);
    const timeSinceLastMessage = now - lastMessageTime;
    return timeSinceLastMessage > thresholdMs;
  });
  
  // ... calculate approaching
};
```

#### SLA Alert Component
**New Component:** `src/widgets/frontdesk/providers/chatwoot/components/dashboard/sla-alerts.tsx`

**Features:**
- Prominent display (top of dashboard)
- Color-coded severity
- Clickable to navigate to filtered conversations
- Configurable threshold (future: user settings)

---

### 3.3 Implementation Steps

1. **Enhance Card Click Handlers**
   - Add filter parameter support to router
   - Update `handleCardClick` to pass filters

2. **Create SLA Calculation Logic**
   - Add SLA metrics to stats hooks
   - Calculate breached/approaching conversations

3. **Create SLA Alert Component**
   - Display SLA breaches prominently
   - Make clickable to navigate

4. **Add Configuration**
   - Store SLA threshold in settings (future enhancement)

**Estimated Effort:** 2-3 days

---

## Implementation Roadmap

### Sprint 1: Phase 1 (Role-Based Dashboards)
- ✅ Week 1: Dashboard type detection + Agent dashboard
- ✅ Week 1: Admin dashboard + Team performance cards
- ✅ Week 2: Agent Leaderboard + Inbox Hotspots

### Sprint 2: Phase 2 (Visualizations)
- ✅ Week 3: Recharts integration + Admin charts
- ✅ Week 3: Agent charts + Data processing utilities

### Sprint 3: Phase 3 (Actionability)
- ✅ Week 4: Smart filter navigation
- ✅ Week 4: SLA alerts + Configuration

**Total Estimated Time:** 4-6 weeks (depending on team size and other priorities)

---

## Technical Considerations

### Performance
- **Memoization:** Ensure all stats calculations are memoized
- **Data Fetching:** Consider pagination for large datasets (leaderboard, activity feed)
- **Chart Rendering:** Use `React.memo` for chart components to prevent unnecessary re-renders

### Data Requirements
- **Agent Stats:** May need backend API endpoint for agent performance metrics
- **Historical Data:** Charts require historical data (7 days, weekly trends)
- **SLA Calculation:** Need message timestamps for accurate SLA tracking

### Backend Dependencies
- **Agent Performance API:** May need new endpoint for agent leaderboard
- **Historical Metrics:** May need aggregated metrics endpoint for charts
- **SLA Tracking:** Backend may need to track SLA thresholds

### Testing
- **Unit Tests:** Test stats calculations with mock data
- **Integration Tests:** Test dashboard rendering for different roles
- **E2E Tests:** Test navigation from dashboard cards to filtered views

---

## Success Metrics

### Phase 1 Success Criteria
- ✅ Agent dashboard shows only agent-relevant data
- ✅ Admin dashboard shows team-wide metrics
- ✅ Dashboard type correctly detected based on role

### Phase 2 Success Criteria
- ✅ Charts render correctly with real data
- ✅ Charts are responsive and performant
- ✅ Charts provide actionable insights

### Phase 3 Success Criteria
- ✅ Clicking stat cards navigates with correct filters
- ✅ SLA alerts accurately identify at-risk conversations
- ✅ Users can quickly act on dashboard insights

---

## Future Enhancements (Post-Phase 3)

1. **Customizable Dashboards:** Allow users to add/remove widgets
2. **Dashboard Templates:** Pre-built templates for different roles
3. **Real-time Updates:** WebSocket integration for live dashboard updates
4. **Export Reports:** PDF/CSV export of dashboard data
5. **Comparison Views:** Compare metrics across time periods
6. **Mobile Optimization:** Responsive dashboard for mobile devices

---

## References

- **Current Dashboard:** `src/widgets/frontdesk/providers/chatwoot/views/dashboard-view.tsx`
- **Stats Hook:** `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-dashboard-stats.ts`
- **Permissions Hook:** `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-permissions.ts`
- **Chatwoot Reference:** `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

---

## Notes

- This plan assumes the current Chatwoot API supports the required data endpoints
- Some features (like agent leaderboard) may require backend API enhancements
- SLA thresholds should be configurable per account (future enhancement)
- Consider A/B testing dashboard layouts to optimize user experience

