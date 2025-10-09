# FrontDesk Hub Documentation

Welcome to the FrontDesk documentation. This folder contains comprehensive guides for understanding, developing, and maintaining the FrontDesk unified messaging hub.

This README serves as the central index and starting point for all developers working on the FrontDesk feature.

## 🏗️ Codebase Structure

The core FrontDesk implementation is located in `src/widgets/frontdesk/`. Here is a map of the key directories that align with this documentation:

```
src/
├── widgets/frontdesk/
│   ├── frontdesk-widget.tsx      # Entry point, routing, and main layout
│   ├── providers/                # Logic for each communication channel
│   │   ├── internal/             # Direct Messages (DMs) via WebSocket
│   │   ├── email/                # Gmail provider (OAuth)
│   │   ├── whatsapp/             # WhatsApp provider
│   │   └── unified/              # Unified inbox view
│   ├── components/               # Shared React components (e.g., message bubbles, conversation list)
│   ├── hooks/                    # Custom React hooks for provider logic
│   └── controllers/              # Business logic, navigation, and actions
│
├── store/frontdesk/
│   ├── atoms/                    # Recoil state atoms, scoped per provider
│   └── selectors/                # Recoil selectors for derived state (e.g., message aggregation)
│
└── services/
    ├── api-service/frontdesk/     # REST API calls
    └── websocket/                # WebSocket service for real-time communication
```

## 📚 Documentation Guide

### 1. Core Concepts

Start here if you're new to FrontDesk. These documents provide a high-level overview of the architecture and development practices.

- **[FRONTDESK_ARCHITECTURE.md](00-core/FRONTDESK_ARCHITECTURE.md)**: The complete architecture, including system diagrams, state management patterns, and provider models.
- **[DEVELOPER_GUIDE.md](00-core/DEVELOPER_GUIDE.md)**: A quick reference for common development tasks, code patterns, and debugging tips.

### 2. Provider Guides

Deep dives into each communication provider located in `src/widgets/frontdesk/providers/`.

- **Internal (Direct Messages):**
  - **[direct-messages-frontend.md](01-providers/direct-messages/direct-messages-frontend.md)**: Covers WebSocket integration, real-time messaging, and conversation management.
  - **[direct-messages-archiving-guide.md](01-providers/direct-messages/direct-messages-archiving-guide.md)**: Guide to the conversation archiving feature.

- **Email (Gmail):**
  - `[EMAIL_PROVIDER_GUIDE.md]` - *(Documentation to be created)*: Will cover OAuth flow and email-specific logic.

- **WhatsApp:**
  - `[WHATSAPP_PROVIDER_GUIDE.md]` - *(Documentation to be created)*: Will cover WhatsApp integration details.

- **Unified Inbox:**
  - `[UNIFIED_INBOX_GUIDE.md]` - *(Documentation to be created)*: Will explain message aggregation and the unified view logic.

### 3. API and Services

Documentation for backend APIs and frontend services.

- **[API_REFERENCE.md](03-api/API_REFERENCE.md)**: Complete reference for REST API endpoints and WebSocket events.
- **[API_INTEGRATION_GUIDE.md](03-api/API_INTEGRATION_GUIDE.md)**: Frontend-focused guide on how to connect to and use the APIs.

### 4. Feature Guides

In-depth documentation for specific, complex features.

- **Search:**
  - **[SEARCH_API_FRONTEND_GUIDE.md](02-features/search/SEARCH_API_FRONTEND_GUIDE.md)**: A guide to implementing global and in-conversation search.

- **Tickets/Support:**
  - **[TICKETS_PROVIDER_GUIDE.md](01-providers/tickets/TICKETS_PROVIDER_GUIDE.md)**: An overview of the ticket lifecycle and multi-channel support.
  - **[tickets/](01-providers/tickets/)**: In-depth documentation for the Tickets feature, including:
    - **[README.md](01-providers/tickets/README.md)**: Index of the tickets documentation.
    - **[INTEGRATION_SUMMARY.md](01-providers/tickets/INTEGRATION_SUMMARY.md)**: Summary of the backend integration project.
    - **[TICKETS_BACKEND_INTEGRATION.md](01-providers/tickets/TICKETS_BACKEND_INTEGRATION.md)**: The complete technical guide for the backend integration.
    - **[TICKETS_QUICK_REFERENCE.md](01-providers/tickets/TICKETS_QUICK_REFERENCE.md)**: A developer cheat sheet.
    - **[FRONTEND_MIGRATION_GUIDE_V2.md](01-providers/tickets/FRONTEND_MIGRATION_GUIDE_V2.md)**: Guide for migrating to the V2 ticketing system.

- **Quick Actions:**
  - **[Design System README - Quick Actions Section](../src/widgets/frontdesk/design-system/README.md#-ticket-quick-actions-integration)**: Complete documentation for the Quick Actions system including:
    - QuickActionButton and QuickActionMenu components
    - useQuickActions hook for navigation and customer context management
    - Pre-configured actions (Quote, Invoice, Order, Receipt, Delivery Note, Purchase Order, Purchase Invoice, Print, Export, Delete)
    - Integration patterns and customization guide
    - Full implementation examples with code snippets

### 5. AI Agent Playbooks

Guides for AI-assisted development, located in [04-ai-agents/](04-ai-agents/).

- **[00-readme.md](04-ai-agents/00-readme.md)**: Hub for AI-assisted development.
- **[01-orientation.md](04-ai-agents/01-orientation.md)**: System orientation for agents.
- **[02-feature-development-playbook.md](04-ai-agents/02-feature-development-playbook.md)**: Workflow for new features.
- **[03-maintenance-bugfixing-guide.md](04-ai-agents/03-maintenance-bugfixing-guide.md)**: Guide for maintenance and bug fixing.
- **[04-data-integrations.md](04-ai-agents/04-data-integrations.md)**: Data integration patterns and contracts.
- **[05-verification-checklists.md](04-ai-agents/05-verification-checklists.md)**: Quality assurance checklists.

## 🗂️ Documentation File Structure

```
docs/frontdesk/
├── README.md
├── 00-core/
│   ├── FRONTDESK_ARCHITECTURE.md
│   └── DEVELOPER_GUIDE.md
├── 01-providers/
│   ├── direct-messages/
│   │   ├── direct-messages-frontend.md
│   │   └── direct-messages-archiving-guide.md
│   └── tickets/
│       ├── TICKETS_PROVIDER_GUIDE.md
│       ├── README.md
│       ├── INTEGRATION_SUMMARY.md
│       ├── TICKETS_BACKEND_INTEGRATION.md
│       ├── TICKETS_QUICK_REFERENCE.md
│       └── FRONTEND_MIGRATION_GUIDE_V2.md
├── 02-features/
│   └── search/
│       └── SEARCH_API_FRONTEND_GUIDE.md
├── 03-api/
│   ├── API_REFERENCE.md
│   └── API_INTEGRATION_GUIDE.md
└── 04-ai-agents/
    ├── 00-readme.md
    ├── 01-orientation.md
    ├── 02-feature-development-playbook.md
    ├── 03-maintenance-bugfixing-guide.md
    ├── 04-data-integrations.md
    └── 05-verification-checklists.md
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