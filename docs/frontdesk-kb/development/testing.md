# Testing Guide

This comprehensive guide covers testing strategies, patterns, and best practices for the FrontDesk feature.

## Table of Contents
1. [Running Tests](#running-tests)
2. [Testing Strategy](#testing-strategy)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [Testing Patterns](#testing-patterns)
6. [Mock Data](#mock-data)
7. [WebSocket Testing](#websocket-testing)
8. [State Testing](#state-testing)
9. [Verification Checklists](#verification-checklists)

---

## Running Tests

### Available Scripts

```bash
# Development
npm run dev                    # Start dev server for manual testing

# Code Quality
npm run lint                   # Run ESLint checks
npm run lint --fix            # Auto-fix linting issues
npm run typecheck             # TypeScript type checking

# Unit Tests
npm run test                   # Run all tests once
npm run test -- --watch       # Run in watch mode (TDD)
npm run test -- --coverage    # Generate coverage report
npm run test -- --verbose     # Show detailed test output

# Specific Tests
npm run test TicketsProvider  # Run tests matching name
npm run test -- --testPathPattern=tickets  # Run tests in path
```

### Test Environment Setup

Ensure you have the following before running tests:

```bash
# Install dependencies
npm install

# Verify test environment
npm run test -- --listTests  # List all test files
```

---

## Testing Strategy

FrontDesk uses a multi-layered testing approach:

```
┌─────────────────────────────────────────────┐
│  Manual Testing (Development)               │
│  - Visual testing in browser                │
│  - User acceptance testing                  │
└─────────────────────────────────────────────┘
                    ▲
┌─────────────────────────────────────────────┐
│  Integration Tests                          │
│  - Provider hooks with services             │
│  - End-to-end user flows                    │
└─────────────────────────────────────────────┘
                    ▲
┌─────────────────────────────────────────────┐
│  Unit Tests                                 │
│  - Pure functions                           │
│  - Individual components                    │
│  - Service methods                          │
└─────────────────────────────────────────────┘
```

### Test Pyramid

- **Unit Tests (70%)**: Fast, isolated, test individual functions
- **Integration Tests (20%)**: Test interactions between modules
- **Manual/E2E Tests (10%)**: Full user flows in real browser

---

## Unit Testing

### Testing React Components

Use React Testing Library for component tests:

```typescript
// src/widgets/frontdesk/providers/tickets/components/__tests__/ticket-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCard } from '../ticket-card';

describe('TicketCard', () => {
  const mockTicket = {
    id: 'ticket-1',
    ticketNumber: 'T-123',
    status: 'OPEN',
    priority: 'HIGH',
    customerId: 'customer-1',
    customerName: 'John Doe',
    createdAt: '2025-01-15T10:00:00Z',
  };

  it('should render ticket information', () => {
    render(<TicketCard ticket={mockTicket} onSelect={jest.fn()} />);

    expect(screen.getByText('T-123')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<TicketCard ticket={mockTicket} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByTestId('ticket-card'));

    expect(mockOnSelect).toHaveBeenCalledWith('ticket-1');
  });

  it('should display unread indicator when hasUnread is true', () => {
    const unreadTicket = {
      ...mockTicket,
      viewStatus: { hasUnread: true, lastViewedAt: null, lastViewedMessageId: null }
    };

    render(<TicketCard ticket={unreadTicket} onSelect={jest.fn()} />);

    expect(screen.getByTestId('unread-indicator')).toBeInTheDocument();
  });
});
```

### Testing Utility Functions

```typescript
// src/widgets/frontdesk/utils/__tests__/date-formatter.test.ts
import { formatRelativeTime, formatDateTime } from '../date-formatter';

describe('formatRelativeTime', () => {
  beforeAll(() => {
    // Mock current time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should format recent times correctly', () => {
    const fiveMinutesAgo = new Date('2025-01-15T11:55:00Z').toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');

    const twoHoursAgo = new Date('2025-01-15T10:00:00Z').toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
  });

  it('should format old dates as absolute date', () => {
    const lastWeek = new Date('2025-01-08T12:00:00Z').toISOString();
    expect(formatRelativeTime(lastWeek)).toBe('Jan 8, 2025');
  });
});
```

### Testing Service Classes

```typescript
// src/services/frontdesk/api/__tests__/tickets.service.test.ts
import axios from 'axios';
import { ticketsService } from '../tickets.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TicketsService', () => {
  const mockToken = 'test-auth-token';

  beforeEach(() => {
    localStorage.setItem('authToken', mockToken);
    jest.clearAllMocks();
  });

  describe('listTickets', () => {
    it('should fetch tickets with correct headers', async () => {
      const mockResponse = {
        data: {
          tickets: [{ id: 'T-1', ticketNumber: 'T-123' }],
          pagination: { page: 1, total: 1 }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await ticketsService.listTickets({ page: 1, limit: 20 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/tickets'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockToken}`
          })
        })
      );

      expect(result.tickets).toHaveLength(1);
      expect(result.tickets[0].ticketNumber).toBe('T-123');
    });

    it('should handle API errors gracefully', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };

      mockedAxios.get.mockRejectedValue(error);

      await expect(ticketsService.listTickets({})).rejects.toThrow();
    });
  });

  describe('createTicketFromConversation', () => {
    it('should create ticket with correct payload', async () => {
      const mockPayload = {
        providerId: 'email-provider-1',
        externalConversationId: 'conv-123',
        priority: 'HIGH',
        customerId: 'customer-1'
      };

      const mockResponse = {
        data: {
          id: 'ticket-1',
          ticketNumber: 'T-456',
          ...mockPayload
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await ticketsService.createTicketFromConversation(mockPayload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/tickets/create-from-conversation'),
        mockPayload,
        expect.any(Object)
      );

      expect(result.ticketNumber).toBe('T-456');
    });
  });
});
```

---

## Integration Testing

### Testing Provider Hooks

Use `renderHook` from React Testing Library:

```typescript
// src/widgets/frontdesk/providers/tickets/hooks/__tests__/use-tickets-provider.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useTicketsProvider } from '../use-tickets-provider';
import { ticketsService } from '@/services/frontdesk';

jest.mock('@/services/frontdesk');

describe('useTicketsProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tickets on mount', async () => {
    const mockTickets = [
      { id: 'T-1', ticketNumber: 'T-123', status: 'OPEN' },
      { id: 'T-2', ticketNumber: 'T-124', status: 'RESOLVED' }
    ];

    (ticketsService.listTickets as jest.Mock).mockResolvedValue({
      tickets: mockTickets,
      pagination: { page: 1, total: 2 }
    });

    const { result } = renderHook(() => useTicketsProvider(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.allTickets).toEqual([]);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allTickets).toHaveLength(2);
    expect(result.current.allTickets[0].ticketNumber).toBe('T-123');
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Failed to fetch tickets';
    (ticketsService.listTickets as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useTicketsProvider(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.allTickets).toEqual([]);
  });

  it('should update ticket optimistically', async () => {
    const mockTickets = [
      { id: 'T-1', ticketNumber: 'T-123', status: 'OPEN', priority: 'LOW' }
    ];

    (ticketsService.listTickets as jest.Mock).mockResolvedValue({
      tickets: mockTickets,
      pagination: { page: 1, total: 1 }
    });

    (ticketsService.updateTicket as jest.Mock).mockResolvedValue({
      ticket: { ...mockTickets[0], priority: 'HIGH' },
      changes: []
    });

    const { result } = renderHook(() => useTicketsProvider(), { wrapper });

    await waitFor(() => {
      expect(result.current.allTickets).toHaveLength(1);
    });

    // Update priority
    await result.current.updateTicket('T-1', { priority: 'HIGH' });

    await waitFor(() => {
      expect(ticketsService.updateTicket).toHaveBeenCalledWith('T-1', { priority: 'HIGH' });
    });
  });
});
```

### Testing with Recoil State

```typescript
// src/store/frontdesk/atoms/__tests__/tickets.atoms.test.ts
import { renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  ticketsAtom,
  filteredTicketsSelector,
  ticketFiltersAtom
} from '../tickets.atoms';

describe('Tickets Atoms', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );

  it('should filter tickets by status', () => {
    const { result } = renderHook(
      () => ({
        tickets: useRecoilValue(ticketsAtom),
        filteredTickets: useRecoilValue(filteredTicketsSelector),
        setTickets: useSetRecoilState(ticketsAtom),
        setFilters: useSetRecoilState(ticketFiltersAtom)
      }),
      { wrapper }
    );

    // Set initial tickets
    result.current.setTickets([
      { id: 'T-1', status: 'OPEN' },
      { id: 'T-2', status: 'RESOLVED' },
      { id: 'T-3', status: 'OPEN' }
    ] as any);

    // Apply filter
    result.current.setFilters({ status: 'OPEN' } as any);

    // Check filtered results
    expect(result.current.filteredTickets).toHaveLength(2);
    expect(result.current.filteredTickets.every(t => t.status === 'OPEN')).toBe(true);
  });
});
```

---

## Testing Patterns

### Pattern 1: Arrange-Act-Assert (AAA)

```typescript
it('should add tags to ticket', async () => {
  // Arrange: Set up test data
  const ticketId = 'ticket-1';
  const tags = ['urgent', 'bug'];
  const mockResponse = [
    { id: 'tag-1', name: 'urgent' },
    { id: 'tag-2', name: 'bug' }
  ];
  (ticketsService.addTagsToTicket as jest.Mock).mockResolvedValue(mockResponse);

  // Act: Perform the action
  const result = await ticketsProvider.addTagsToTicket(ticketId, tags);

  // Assert: Verify the outcome
  expect(ticketsService.addTagsToTicket).toHaveBeenCalledWith(ticketId, tags);
  expect(result).toEqual(mockResponse);
});
```

### Pattern 2: Test Data Builders

```typescript
// src/widgets/frontdesk/providers/tickets/test-utils/ticket-builder.ts
export class TicketBuilder {
  private ticket: Partial<TicketWithDetails> = {
    id: 'ticket-1',
    ticketNumber: 'T-123',
    status: 'OPEN',
    priority: 'MEDIUM',
    tags: [],
    conversations: []
  };

  withId(id: string): TicketBuilder {
    this.ticket.id = id;
    return this;
  }

  withStatus(status: string): TicketBuilder {
    this.ticket.status = status;
    return this;
  }

  withTags(...tags: Tag[]): TicketBuilder {
    this.ticket.tags = tags;
    return this;
  }

  build(): TicketWithDetails {
    return this.ticket as TicketWithDetails;
  }
}

// Usage in tests
const ticket = new TicketBuilder()
  .withId('T-456')
  .withStatus('RESOLVED')
  .withTags({ id: 'tag-1', name: 'urgent' })
  .build();
```

### Pattern 3: Custom Test Hooks

```typescript
// src/widgets/frontdesk/test-utils/test-hooks.tsx
import { RecoilRoot } from 'recoil';
import { ReactNode } from 'react';

export const TestWrapper = ({ children }: { children: ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
);

export const renderHookWithRecoil = <T,>(hook: () => T) => {
  return renderHook(hook, { wrapper: TestWrapper });
};
```

---

## Mock Data

### Creating Mock Data

```typescript
// src/widgets/frontdesk/test-utils/mock-data.ts

export const mockTickets: TicketWithDetails[] = [
  {
    id: 'ticket-1',
    ticketNumber: 'T-1001',
    status: 'OPEN',
    priority: 'HIGH',
    customerId: 'customer-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    assigneeId: 'user-1',
    tags: [
      { id: 'tag-1', name: 'urgent', color: '#FF0000' }
    ],
    conversations: [
      {
        id: 'conv-1',
        channel: 'EMAIL',
        messages: [
          {
            id: 'msg-1',
            content: 'I need help with my order',
            direction: 'INBOUND',
            createdAt: '2025-01-15T10:00:00Z'
          }
        ]
      }
    ],
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }
];

export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'urgent', color: '#FF0000', usageCount: 45 },
  { id: 'tag-2', name: 'bug', color: '#FFA500', usageCount: 32 },
  { id: 'tag-3', name: 'feature', color: '#00FF00', usageCount: 18 }
];

export const mockConversations = [
  {
    id: 'conv-1',
    channel: 'EMAIL',
    identifier: 'john@example.com',
    lastMessageAt: '2025-01-15T10:00:00Z',
    unreadCount: 2,
    messages: []
  }
];
```

### Using Mock Services

```typescript
// src/services/frontdesk/__mocks__/tickets.service.ts
export const ticketsService = {
  listTickets: jest.fn().mockResolvedValue({
    tickets: [],
    pagination: { page: 1, total: 0 }
  }),
  getTicketById: jest.fn().mockResolvedValue({}),
  createTicketFromConversation: jest.fn().mockResolvedValue({}),
  updateTicket: jest.fn().mockResolvedValue({}),
  addTagsToTicket: jest.fn().mockResolvedValue([]),
  // ... other methods
};
```

---

## WebSocket Testing

### Mocking WebSocket Service

```typescript
// src/services/frontdesk/websocket/__mocks__/ticket-socket.service.ts
export const ticketSocketService = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn(),
  isConnected: jest.fn().mockReturnValue(true),
  onTicketCreated: jest.fn(),
  onTicketUpdated: jest.fn(),
  onTicketMessageReceived: jest.fn(),
  // Simulate event emission
  emit: jest.fn((event: string, payload: any) => {
    const handlers = ticketSocketService[`on${event}`];
    if (handlers && handlers.mock.calls.length > 0) {
      handlers.mock.calls.forEach(([handler]: any) => handler(payload));
    }
  })
};
```

### Testing WebSocket Events

```typescript
it('should handle ticket.created event', async () => {
  const { result } = renderHookWithRecoil(() => useTicketsProvider());

  // Wait for initial fetch
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  const newTicket = {
    id: 'ticket-new',
    ticketNumber: 'T-999',
    status: 'OPEN'
  };

  // Simulate WebSocket event
  const handler = (ticketSocketService.onTicketCreated as jest.Mock).mock.calls[0][0];
  handler({ ticket: newTicket });

  // Verify ticket was added to state
  await waitFor(() => {
    expect(result.current.allTickets).toContainEqual(
      expect.objectContaining({ ticketNumber: 'T-999' })
    );
  });
});
```

---

## State Testing

### Testing State Persistence

```typescript
it('should persist sidebar collapsed state to localStorage', () => {
  const { result } = renderHookWithRecoil(() =>
    useRecoilState(sidebarCollapsedAtom)
  );

  const [collapsed, setCollapsed] = result.current;

  expect(collapsed).toBe(false); // Default

  // Collapse sidebar
  setCollapsed(true);

  // Check localStorage
  expect(localStorage.getItem('frontdesk.navigation.sidebarCollapsed')).toBe('true');
});
```

### Testing Selectors

```typescript
it('should calculate unread count across providers', () => {
  const { result } = renderHook(
    () => ({
      setInternal: useSetRecoilState(internalConversationsAtom),
      setEmail: useSetRecoilState(emailConversationsAtom),
      unreadCount: useRecoilValue(totalUnreadCountSelector)
    }),
    { wrapper: TestWrapper }
  );

  // Set unread counts
  result.current.setInternal([
    { id: '1', unreadCount: 3 },
    { id: '2', unreadCount: 5 }
  ] as any);

  result.current.setEmail([
    { id: '3', unreadCount: 2 }
  ] as any);

  // Verify total
  expect(result.current.unreadCount).toBe(10);
});
```

---

## Verification Checklists

### For a New Feature
- [ ] **Build**: Does it build and run locally? (`npm run dev`)
- [ ] **Linting**: Does it pass all linting checks? (`npm run lint`)
- [ ] **Types**: Does it pass TypeScript checks? (`npm run typecheck`)
- [ ] **Unit Tests**: Are there unit tests for core logic?
- [ ] **Integration Tests**: Are there tests for hook/service integration?
- [ ] **Coverage**: Does coverage meet minimum threshold (70%)?
- [ ] **UI**: Is the UI responsive on mobile, tablet, and desktop?
- [ ] **Accessibility**: Does it meet WCAG 2.1 AA standards?
- [ ] **State**: Is Recoil state managed correctly with safe defaults?
- [ ] **API Contracts**: Do API calls match backend DTOs exactly?
- [ ] **WebSocket**: Are all WebSocket events handled?
- [ ] **Error Handling**: Are errors handled gracefully with user feedback?
- [ ] **Loading States**: Are loading indicators shown during async operations?
- [ ] **Optimistic Updates**: Are optimistic updates implemented where appropriate?
- [ ] **Documentation**: Is the feature documented in knowledge base?

### For a Bugfix
- [ ] **Reproduced**: Can you reproduce the bug consistently?
- [ ] **Fixed**: Is the bug verifiably fixed?
- [ ] **Root Cause**: Is the root cause identified and addressed?
- [ ] **Test Added**: Has a test been added that would catch this bug?
- [ ] **Regression**: Have you tested related features for regressions?
- [ ] **All Tests Pass**: Do all existing tests still pass?
- [ ] **Manual Verification**: Have you manually tested the fix in dev?
- [ ] **Edge Cases**: Have you considered and tested edge cases?
- [ ] **Documentation**: Is the fix documented (if user-facing)?

### For Provider Integration
- [ ] **Directory Structure**: Follows standard provider structure?
- [ ] **State Atoms**: Recoil atoms follow naming convention?
- [ ] **Service Integration**: API service class created and exported?
- [ ] **WebSocket**: Real-time events handled (if applicable)?
- [ ] **Provider Hook**: Main hook exports consistent interface?
- [ ] **UI Components**: Main view and sub-components created?
- [ ] **Routing**: Provider registered in `frontdesk-widget.tsx`?
- [ ] **Navigation**: Added to NavigationSidebar with icon?
- [ ] **Unread Counts**: Badge integration for unread counts?
- [ ] **Error States**: Error handling and display implemented?
- [ ] **Loading States**: Loading indicators for async operations?
- [ ] **Empty States**: Empty state UI when no data?
- [ ] **Tests**: Unit tests for hook and components?
- [ ] **Documentation**: Provider documented in knowledge base?

### Performance Checklist
- [ ] **Bundle Size**: No unnecessary dependencies added?
- [ ] **Re-renders**: Components properly memoized (`useMemo`, `useCallback`)?
- [ ] **Large Lists**: Virtualization implemented for 100+ items?
- [ ] **Images**: Images optimized and lazy-loaded?
- [ ] **API Calls**: Debouncing/throttling for search/filters?
- [ ] **WebSocket**: Events batched/throttled if high frequency?

---

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// Bad: Testing implementation details
it('should call setTickets with new array', () => {
  const { result } = renderHookWithRecoil(() => useTicketsProvider());
  result.current.fetchTickets();
  expect(setTickets).toHaveBeenCalled();
});

// Good: Testing behavior
it('should display tickets after fetching', async () => {
  const { result } = renderHookWithRecoil(() => useTicketsProvider());

  await result.current.fetchTickets();

  expect(result.current.allTickets).toHaveLength(2);
  expect(result.current.isLoading).toBe(false);
});
```

### 2. Use Descriptive Test Names

```typescript
// Bad
it('works', () => { ... });

// Good
it('should mark ticket as read when user opens ticket detail view', () => { ... });
```

### 3. Keep Tests Focused

```typescript
// Bad: Testing multiple things
it('should handle tickets', () => {
  // Tests creation, update, and deletion all in one
});

// Good: One test per behavior
it('should create ticket from email conversation', () => { ... });
it('should update ticket priority', () => { ... });
it('should delete ticket', () => { ... });
```

### 4. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

---

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Every pull request (CI pipeline)
- Before deployment (production builds)

**CI Pipeline**:
```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    npm run lint
    npm run typecheck
    npm run test -- --coverage
    npm run build
```
