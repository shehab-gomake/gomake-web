# FrontDesk Documentation

Welcome to the FrontDesk documentation. This folder contains comprehensive guides for understanding, developing, and maintaining the FrontDesk unified messaging hub.

## 📚 Documentation Index

### Getting Started

Start here if you're new to FrontDesk:

1. **[FRONTDESK_ARCHITECTURE.md](FRONTDESK_ARCHITECTURE.md)** - Complete architecture overview
   - System architecture and file structure
   - Provider status and capabilities
   - State management patterns
   - API integration overview

2. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Quick reference guide
   - Common development tasks
   - Code examples and patterns
   - Debugging tips
   - Quick commands

### Provider-Specific Guides

Deep dives into each communication provider:

- **[direct-messages-frontend.md](direct-messages-frontend.md)** - Direct Messages (Internal) provider
  - WebSocket integration
  - Real-time messaging patterns
  - Typing indicators and presence
  - Conversation management

- **[TICKETS_PROVIDER_GUIDE.md](TICKETS_PROVIDER_GUIDE.md)** - Tickets/Support provider overview
  - Ticket lifecycle management
  - Multi-channel ticket sources
  - Hook API and usage examples
  - State management

- **[tickets/](tickets/)** - Complete Tickets Backend Integration Documentation
  - [README.md](tickets/README.md) - Documentation index and quick navigation
  - [INTEGRATION_SUMMARY.md](tickets/INTEGRATION_SUMMARY.md) - Project overview and completion status
  - [TICKETS_BACKEND_INTEGRATION.md](tickets/TICKETS_BACKEND_INTEGRATION.md) - Complete technical guide (600+ lines)
  - [TICKETS_QUICK_REFERENCE.md](tickets/TICKETS_QUICK_REFERENCE.md) - Developer cheat sheet and code snippets

### API & Integration Guides

Backend integration and API documentation:

- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API reference
  - REST API endpoints for all providers
  - WebSocket events and payloads
  - Request/response schemas
  - Authentication methods

- **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** - Frontend API integration guide
  - How to integrate with REST APIs
  - WebSocket connection setup
  - OAuth flows (Email provider)
  - Error handling patterns

- **[SEARCH_API_FRONTEND_GUIDE.md](SEARCH_API_FRONTEND_GUIDE.md)** - Search implementation guide
  - Global search across conversations
  - In-conversation search
  - Highlighting and navigation
  - Performance optimization

### Specialized Guides

- **[direct-messages-archiving-guide.md](direct-messages-archiving-guide.md)** - Archiving conversations in DMs

### AI Agent Documentation

Located in [ai-agents/](ai-agents/) - Guides specifically for AI-assisted development:

- **[00-readme.md](ai-agents/00-readme.md)** - AI agent hub overview
- **[01-orientation.md](ai-agents/01-orientation.md)** - System orientation for agents
- **[02-feature-development-playbook.md](ai-agents/02-feature-development-playbook.md)** - Feature development workflow
- **[03-maintenance-bugfixing-guide.md](ai-agents/03-maintenance-bugfixing-guide.md)** - Maintenance and bug fixing
- **[04-data-integrations.md](ai-agents/04-data-integrations.md)** - Data integration patterns
- **[05-verification-checklists.md](ai-agents/05-verification-checklists.md)** - Quality assurance checklists

## 🗂️ Document Status

| Document | Status | Last Updated | Audience |
|----------|--------|--------------|----------|
| FRONTDESK_ARCHITECTURE.md | ✅ Current | 2024-01 | All developers |
| DEVELOPER_GUIDE.md | ✅ Current | 2024-01 | All developers |
| API_REFERENCE.md | ✅ Current | 2024-01 | Backend & Frontend |
| API_INTEGRATION_GUIDE.md | ✅ Current | 2024-01 | Frontend developers |
| TICKETS_PROVIDER_GUIDE.md | ✅ Current | 2024-01 | Tickets feature developers |
| tickets/* | ✅ Current | 2024-01 | Tickets backend integration |
| SEARCH_API_FRONTEND_GUIDE.md | ✅ Current | 2024-01 | Search feature developers |
| direct-messages-frontend.md | ✅ Current | 2024-01 | DM feature developers |
| direct-messages-archiving-guide.md | ✅ Current | 2024-01 | DM feature developers |
| ai-agents/* | ✅ Current | 2024-01 | AI-assisted development |

## 🏗️ Project Structure

```
docs/frontdesk/
├── README.md                            # This file - documentation index
│
├── FRONTDESK_ARCHITECTURE.md            # Complete system architecture
├── DEVELOPER_GUIDE.md                   # Quick developer reference
│
├── API_REFERENCE.md                     # Backend API documentation
├── API_INTEGRATION_GUIDE.md             # Frontend API integration
├── SEARCH_API_FRONTEND_GUIDE.md         # Search feature guide
│
├── direct-messages-frontend.md          # DM provider guide
├── direct-messages-archiving-guide.md   # DM archiving feature
├── TICKETS_PROVIDER_GUIDE.md            # Tickets provider overview
│
├── tickets/                             # Tickets backend integration docs
│   ├── README.md                        # Tickets documentation index
│   ├── INTEGRATION_SUMMARY.md           # Implementation overview
│   ├── TICKETS_BACKEND_INTEGRATION.md   # Complete technical guide
│   └── TICKETS_QUICK_REFERENCE.md       # Developer cheat sheet
│
└── ai-agents/                           # AI agent documentation
    ├── 00-readme.md
    ├── 01-orientation.md
    ├── 02-feature-development-playbook.md
    ├── 03-maintenance-bugfixing-guide.md
    ├── 04-data-integrations.md
    └── 05-verification-checklists.md
```

## 📖 How to Use This Documentation

### If you're new to FrontDesk:
1. Start with [FRONTDESK_ARCHITECTURE.md](FRONTDESK_ARCHITECTURE.md) to understand the system
2. Review [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for quick reference
3. Dive into provider-specific guides as needed

### If you're adding a new feature:
1. Check [FRONTDESK_ARCHITECTURE.md](FRONTDESK_ARCHITECTURE.md) for patterns to follow
2. Review the relevant provider guide
3. Refer to [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for API integration
4. Use [ai-agents/02-feature-development-playbook.md](ai-agents/02-feature-development-playbook.md) for workflow

### If you're fixing a bug:
1. Check [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for debugging tips
2. Review relevant provider documentation
3. Use [ai-agents/03-maintenance-bugfixing-guide.md](ai-agents/03-maintenance-bugfixing-guide.md) for systematic approach

### If you're integrating with APIs:
1. Review [API_REFERENCE.md](API_REFERENCE.md) for endpoint documentation
2. Follow [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for implementation patterns
3. Check provider-specific guides for examples

### If you're working on Tickets backend integration:
1. Start with [tickets/INTEGRATION_SUMMARY.md](tickets/INTEGRATION_SUMMARY.md) for overview
2. Follow [tickets/TICKETS_BACKEND_INTEGRATION.md](tickets/TICKETS_BACKEND_INTEGRATION.md) for complete guide
3. Use [tickets/TICKETS_QUICK_REFERENCE.md](tickets/TICKETS_QUICK_REFERENCE.md) as daily reference
4. Consult backend docs at `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`

## 🔄 Keeping Documentation Updated

Documentation should be updated when:
- New providers are added
- API endpoints change
- Architecture patterns evolve
- New features are implemented
- Known issues are resolved

**Update Process:**
1. Edit the relevant markdown file(s)
2. Update the "Last Updated" date in this README
3. If adding new docs, add them to the index above
4. Commit with descriptive message: `docs: update FrontDesk [topic] documentation`

## 📦 Archived Documentation

Outdated or superseded documentation is moved to `docs/archive/frontdesk docs/` to maintain history without cluttering active documentation.

Current archived items:
- Legacy improvement plans and task documents
- Old frontend guides superseded by current docs

## 🆘 Getting Help

**For development questions:**
- Check relevant documentation first
- Review code examples in the guides
- Look at existing provider implementations
- Check the codebase's CLAUDE.md file

**For architecture questions:**
- See [FRONTDESK_ARCHITECTURE.md](FRONTDESK_ARCHITECTURE.md)
- Review provider patterns and state management sections

**For API questions:**
- See [API_REFERENCE.md](API_REFERENCE.md) for backend contracts
- See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for frontend usage

**For Tickets integration questions:**
- See [tickets/README.md](tickets/README.md) for navigation
- See [tickets/TICKETS_BACKEND_INTEGRATION.md](tickets/TICKETS_BACKEND_INTEGRATION.md) for technical details
- See backend docs: `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`

## 🎯 Quick Links

- **Main codebase**: `src/widgets/frontdesk/`
- **State management**: `src/store/frontdesk/`
- **Services**: `src/services/frontdesk/` (REST APIs + WebSocket)
  - **API services**: `src/services/frontdesk/api/`
  - **WebSocket services**: `src/services/frontdesk/websocket/`
- **Root project guide**: `CLAUDE.md` (in project root)

## 📝 Document Conventions

All FrontDesk documentation follows these conventions:

- Use markdown for all documentation
- Include table of contents for documents > 100 lines
- Use code blocks with language identifiers
- Include practical examples where applicable
- Keep file names descriptive and consistent
- Use kebab-case for filenames (e.g., `feature-guide.md`)
- Update this README when adding/removing docs

---

*Last updated: January 2024*
*For the latest code and implementation details, always refer to the source code in `src/widgets/frontdesk/`*
