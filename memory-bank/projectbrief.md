# Project Brief: gomake-web

## Overview

gomake-web is the **frontend application** for the gomake messaging system, specifically focused on the **FrontDesk feature** - a unified messaging hub that consolidates multiple communication channels (Direct Messages, Email, WhatsApp, Tickets) into a single, cohesive interface.

**Technology Stack:** Next.js 13, React 18, TypeScript 5.4.3, Recoil state management

**Repository Location:** `/Users/omarsabbah/Desktop/gomake-services/gomake-web`

## Core Requirements

1. **Unified Messaging Interface**: Provide a single interface for users to manage all communication channels
2. **Real-time Updates**: Support WebSocket connections for live message updates and presence indicators
3. **Provider Architecture**: Maintain modular, provider-based architecture for easy extension
4. **State Management**: Implement robust state management using Recoil with optimistic updates
5. **Three-Column Layout**: Deliver consistent UX across all providers using standardized layout
6. **Backend Integration**: Consume REST APIs and WebSocket events from Messaging-Hub backend

## Goals

1. **User Experience**: Create intuitive, responsive messaging interface for multi-channel communication
2. **Developer Experience**: Maintain clean, modular codebase that follows established patterns
3. **Performance**: Optimize for fast load times and smooth real-time interactions
4. **Maintainability**: Use TypeScript strictly, follow component patterns, comprehensive documentation
5. **Extensibility**: Make adding new providers straightforward with clear provider pattern

## Scope

### ✅ In Scope (FrontDesk Feature Only)

- `src/widgets/frontdesk/` - All FrontDesk UI components
- `src/store/frontdesk/` - FrontDesk Recoil state management
- `src/services/frontdesk/` - FrontDesk API and WebSocket services
- `docs/frontdesk/` - FrontDesk documentation
- Provider implementations: Internal DMs, Email, WhatsApp, Tickets, Unified Inbox
- Three-column layout system
- Centralized routing system
- Real-time messaging with WebSocket

### ❌ Out of Scope

- Other widgets in `src/widgets/*` (except frontdesk)
- Global shared components (without explicit approval)
- Build configurations and package.json (without approval)
- Backend Messaging-Hub code (separate project)

## Stakeholders

- **End Users**: Teams using the messaging system for customer communication
- **Developers**: Frontend and full-stack developers building on the FrontDesk platform
- **Backend Team**: Developers maintaining the Messaging-Hub API
- **Product Team**: Defining feature requirements and UX patterns

---

_Last Updated: October 20, 2025_
_Status: Active Development - FrontDesk Feature_
