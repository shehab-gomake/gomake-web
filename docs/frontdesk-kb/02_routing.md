# FrontDesk Routing System

FrontDesk features a centralized, type-safe routing system located in `src/widgets/frontdesk/routing/`. This system provides a clean and predictable URL structure for all features and ensures type-safe navigation.

## Key Features

- **Type-Safe Navigation**: All routes are strongly typed with TypeScript discriminated unions, which means you get autocompletion and compile-time checks when building or navigating to routes.
- **URL Patterns**: The system generates clean, predictable URL structures.
- **Deep Linking**: The routing system has first-class support for notification deep links, allowing users to navigate directly to a specific conversation or ticket.

## `useFrontDeskRouter` Hook

The primary way to interact with the routing system is through the `useFrontDeskRouter` hook.

```typescript
import { useFrontDeskRouter, RouteBuilder } from '@/widgets/frontdesk/routing';

function MyComponent() {
  const { navigate,-
   // ... other properties
  } = useFrontDeskRouter();

  const goToEmail = () => {
    // Navigate to the email channel view
    navigate(RouteBuilder.email());
  };

  const openTicket = (ticketId: string) => {
    // Navigate to a specific ticket
    navigate(RouteBuilder.ticketDetail(ticketId));
  };
}
```

## `RouteBuilder`

The `RouteBuilder` is a collection of static methods that create route objects for every possible destination in the FrontDesk widget.

### Examples

```typescript
import { RouteBuilder } from '@/widgets/frontdesk/routing';

// Main provider views
const emailRoute = RouteBuilder.email();
const ticketsRoute = RouteBuilder.tickets();
const unifiedInboxRoute = RouteBuilder.unified();

// Detail views
const ticketDetailRoute = RouteBuilder.ticketDetail('TICKET-123');
const emailConversationRoute = RouteBuilder.emailConversation('thread-abc');

// Creation views
const newEmailRoute = RouteBuilder.newEmail();
const newTicketRoute = RouteBuilder.newTicket();
```
