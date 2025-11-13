# FrontDesk Documentation Index

This directory contains documentation for the FrontDesk unified messaging hub feature.

## 📚 Documentation Files

### Architecture & Overview
- **[FRONTDESK_CHATWOOT_ARCHITECTURE.md](./FRONTDESK_CHATWOOT_ARCHITECTURE.md)** - Complete architecture guide for FrontDesk Chatwoot feature, workspace overview, and reference guide

### Provider-Specific Guides
- **[01-providers/chatwoot/](./01-providers/chatwoot/)** - Chatwoot provider documentation
  - `TEAM_CREATION_GUIDE.md` - Guide for team creation feature
  - `TEAM_CREATION_QUICK_REFERENCE.md` - Quick reference for team creation
  - `DASHBOARD_EVOLUTION_PLAN.md` - Three-phase plan for evolving the Chatwoot dashboard into a role-based, insight-driven command center

### Integration Guides
- **[CHATWOOT_CHANNEL_CONNECTION_FLOW.md](./CHATWOOT_CHANNEL_CONNECTION_FLOW.md)** - Channel connection flow documentation
- **[FRONTEND_CHANNEL_CONNECTION_IMPLEMENTATION.md](./FRONTEND_CHANNEL_CONNECTION_IMPLEMENTATION.md)** - Frontend channel connection implementation details

## 🚀 Quick Start

**New to FrontDesk Chatwoot?** Start with:
1. [FRONTDESK_CHATWOOT_ARCHITECTURE.md](./FRONTDESK_CHATWOOT_ARCHITECTURE.md) - Understand the overall architecture
2. Check the code organization in `src/widgets/frontdesk/providers/chatwoot/README.md`
3. Review API services in `src/services/frontdesk/api/chatwoot/README.md`

## 📖 Related Documentation

- **Code Documentation:**
  - `src/widgets/frontdesk/providers/chatwoot/README.md` - Chatwoot provider code organization
  - `src/services/frontdesk/api/chatwoot/README.md` - API service architecture

- **Workspace Documentation:**
  - `/Users/omarsabbah/Desktop/messaging/chatwoot/CLAUDE.md` - Chatwoot backend development guidelines
  - `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2/README.md` - Proxy service documentation

## 🎯 Key Concepts

- **FrontDesk** - Unified messaging hub consolidating multiple channels
- **Chatwoot Provider** - Chatwoot integration within FrontDesk
- **messaging-hub-v2** - NestJS proxy between FrontDesk and Chatwoot
- **Chatwoot Backend** - Rails-based customer support platform (reference implementation)

