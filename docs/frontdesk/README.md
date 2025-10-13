# FrontDesk Hub Documentation

Welcome to the FrontDesk documentation. This folder contains comprehensive guides for understanding, developing, and maintaining the FrontDesk unified messaging hub.

This README serves as the central index and starting point for all developers working on the FrontDesk feature.

## 🏗️ Codebase Structure

The core FrontDesk implementation is located in `src/widgets/frontdesk/`. Here is a map of the key directories that align with this documentation:

```
src/
├── widgets/frontdesk/
│   ├── frontdesk-widget.tsx      # Entry point and main layout
│   ├── routing/                  # ⭐ NEW: Centralized routing system
│   │   ├── types.ts              # Route type definitions (5 route types)
│   │   ├── route-parser.ts       # URL parsing logic
│   │   ├── route-builder.ts      # URL building utilities
│   │   ├── hooks/                # Routing hooks
│   │   │   └── use-frontdesk-router.ts  # Main routing hook
│   │   └── index.ts              # Public API
│   ├── providers/                # Logic for each communication channel
│   │   ├── internal/             # Direct Messages (DMs) via WebSocket
│   │   ├── email/                # Gmail provider (OAuth)
│   │   ├── whatsapp/             # WhatsApp provider
│   │   ├── tickets/              # Support tickets with WebSocket
│   │   └── unified/              # Unified inbox view
│   ├── components/               # Shared React components
│   ├── hooks/                    # Custom React hooks for provider logic
│   ├── controllers/              # Business logic and navigation (legacy)
│   ├── design-system/            # Storybook components and design tokens
│   ├── layouts/                  # Reusable layout components
│   ├── settings/                 # Configuration and settings components
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
│
├── store/frontdesk/
│   ├── atoms/                    # Recoil state atoms, scoped per provider
│   └── selectors/                # Recoil selectors for derived state
│
└── services/
    ├── api-service/frontdesk/     # REST API calls
    └── websocket/                # WebSocket service for real-time communication
```

## 📋 Recent Updates

### January 2025 - Routing System Refactor (v2.0.0)

Major architectural improvement introducing a centralized, type-safe routing system. See [CHANGELOG.md](CHANGELOG.md) for complete details.

**Key Improvements:**
- ✅ Centralized routing in `src/widgets/frontdesk/routing/`
- ✅ Type-safe navigation with TypeScript
- ✅ Fixed UUID ticket ID navigation bug
- ✅ Fixed LIVE CHATS sidebar highlighting
- ✅ Reduced main widget complexity by ~200 lines

---

## 📚 Documentation Guide

### 1. Core Concepts

Start here if you're new to FrontDesk. These documents provide a high-level overview of the architecture and development practices.

- **[FRONTDESK_ARCHITECTURE.md](00-core/FRONTDESK_ARCHITECTURE.md)**: The complete architecture, including system diagrams, state management patterns, routing system, and provider models.
- **[DEVELOPER_GUIDE.md](00-core/DEVELOPER_GUIDE.md)**: A quick reference for common development tasks, code patterns, and debugging tips.

#### 🆕 Routing System (January 2025)

FrontDesk now features a **centralized, type-safe routing system** located in `src/widgets/frontdesk/routing/`:

- **Type-Safe Navigation**: All routes are strongly typed with TypeScript discriminated unions
- **URL Patterns**: Clean, predictable URL structure for all features
- **Deep Linking**: First-class support for notification deep links
- **Developer Experience**: Auto-completion and compile-time route validation

**Quick Example:**
```typescript
import { useFrontDeskRouter, RouteBuilder } from '@/widgets/frontdesk/routing';

function MyComponent() {
  const { navigate } = useFrontDeskRouter();

  // Navigate to email channel
  navigate(RouteBuilder.email());

  // Navigate to specific ticket
  navigate(RouteBuilder.ticketDetail('TICKET-123'));
}
```

See [FRONTDESK_ARCHITECTURE.md - Routing System](00-core/FRONTDESK_ARCHITECTURE.md#routing-system) for details.

### 2. Provider Guides

Deep dives into each communication provider located in `src/widgets/frontdesk/providers/`.

- **[Direct Messages (DM)](01-providers/direct-messages/README.md)**: Covers WebSocket integration, real-time messaging, and conversation management.
- **[Email (Gmail)](01-providers/email/EMAIL_PROVIDER_GUIDE.md)**: Covers OAuth flow and email-specific logic.
- **[Tickets/Support](01-providers/tickets/README.md)**: In-depth documentation for the Tickets feature.
- **WhatsApp**: *(Documentation to be created)*
- **Unified Inbox**: *(Documentation to be created)*

### 3. Feature Guides

In-depth documentation for specific, complex features.

- **[Search](02-features/search/SEARCH_API_FRONTEND_GUIDE.md)**: A guide to implementing global and in-conversation search.
- **[Tags](02-features/tags/README.md)**: Documentation for the tag management system.

### 4. API and Services

Documentation for backend APIs and frontend services.

- **[API and Services Hub](03-api/README.md)**: Index for API and WebSocket documentation.

### 5. AI Agent Playbooks

Guides for AI-assisted development, located in [04-ai-agents/](04-ai-agents/).

- **[AI Agent Hub](04-ai-agents/00-readme.md)**: Hub for AI-assisted development.

## 🗂️ Documentation File Structure

```
docs/frontdesk/
├── README.md                           # You are here - Documentation hub
├── CHANGELOG.md                        # Version history and updates ⭐ NEW
├── FRONTDESK_KNOWLEDGE_BASE.md        # Comprehensive knowledge base
├── 00-core/
│   ├── FRONTDESK_ARCHITECTURE.md      # Complete architecture (includes routing)
│   └── DEVELOPER_GUIDE.md              # Quick reference (includes routing examples)
├── 01-providers/
│   ├── direct-messages/
│   │   ├── README.md
│   │   ├── direct-messages-archiving-guide.md
│   │   └── direct-messages-frontend.md
│   ├── email/
│   │   └── EMAIL_PROVIDER_GUIDE.md
│   └── tickets/
│       ├── README.md
│       ├── INTEGRATION_SUMMARY.md
│       ├── TICKETS_BACKEND_INTEGRATION.md
│       ├── TICKETS_PROVIDER_GUIDE.md
│       ├── TICKETS_QUICK_REFERENCE.md
│       └── FRONTEND_MIGRATION_GUIDE_V2.md
├── 02-features/
│   ├── search/
│   │   └── SEARCH_API_FRONTEND_GUIDE.md
│   └── tags/
│       ├── README.md
│       ├── TAG_INTEGRATION_SUMMARY.md
│       └── TAG_SYSTEM_IMPLEMENTATION.md
├── 03-api/
│   ├── README.md
│   ├── API_REFERENCE.md
│   └── WEBSOCKET_GUIDE.md
├── 04-ai-agents/
│   ├── 00-readme.md
│   ├── 01-orientation.md
│   ├── 02-feature-development-playbook.md
│   ├── 03-maintenance-bugfixing-guide.md
│   ├── 04-data-integrations.md
│   └── 05-verification-checklists.md
└── archive/
    ├── FRONTDESK_IMPROVEMENT_PLAN.md
    ├── TASK_UNIFY_ARCHITECTURE.md
    ├── frontend-conversations-guide.md
    ├── frontend-ui-requirements.md
    └── internal-messaging-guide.md
```

## 📖 How to Use This Documentation

- **New to FrontDesk?** Start with `Core Concepts` and then explore the `Codebase Structure`.
- **Adding a feature?** Review the `Architecture` and relevant `Provider Guides`.
- **Fixing a bug?** Check the `Developer Guide` and the specific `Provider Guide`.
- **Working with APIs?** Refer to the `API and Services` section.

## 🎯 Quick Links

- **Main codebase**: `src/widgets/frontdesk/`
- **State management**: `src/store/frontdesk/`
- **Services**: `src/services/frontdesk/`
- **Root project guide**: `CLAUDE.md` (in project root)

---
*Last updated: October 2025*
*This documentation is actively maintained. For implementation details, always refer to the source code.*