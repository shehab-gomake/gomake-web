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
│   ├── components/               # Shared React components
│   ├── hooks/                    # Custom React hooks for provider logic
│   ├── controllers/              # Business logic, navigation, and actions
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

## 📚 Documentation Guide

### 1. Core Concepts

Start here if you're new to FrontDesk. These documents provide a high-level overview of the architecture and development practices.

- **[FRONTDESK_ARCHITECTURE.md](00-core/FRONTDESK_ARCHITECTURE.md)**: The complete architecture, including system diagrams, state management patterns, and provider models.
- **[DEVELOPER_GUIDE.md](00-core/DEVELOPER_GUIDE.md)**: A quick reference for common development tasks, code patterns, and debugging tips.

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
├── README.md
├── FRONTDESK_KNOWLEDGE_BASE.md
├── 00-core/
│   ├── FRONTDESK_ARCHITECTURE.md
│   └── DEVELOPER_GUIDE.md
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