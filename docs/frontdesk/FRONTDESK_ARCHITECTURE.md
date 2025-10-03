# FrontDesk Messaging Hub - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Current Architecture](#current-architecture)
3. [File Structure](#file-structure)
4. [Core Features](#core-features)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Architectural Issues and Recommendations](#architectural-issues-and-recommendations)
8. [Development Guide](#development-guide)

---

## Overview

FrontDesk is a messaging hub designed to consolidate multiple communication channels into a single interface. The goal is to provide a seamless experience for managing all customer communications from one centralized location.

### Key Benefits
- **Multi-Provider Support**: The system is designed to support multiple communication providers. Currently, it has implementations for **Direct Messages**, **Email**, and **WhatsApp**.
- **Real-time Updates**: The Direct Messages provider uses WebSockets for real-time communication, including typing indicators and user presence.
- **Component-Based Architecture**: The UI is built with React and Material-UI, with a good level of componentization within each provider.

---

## Current Architecture

The current architecture of the Frontdesk feature is fragmented, with significant inconsistencies in the layout and structure of the different providers.

### Main Application Layout

The main application layout, defined in `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`, is a **two-column layout**, consisting of a navigation sidebar and a main content area.

```
┌────────────┬────────────────────────────┐
│            │                            │
│ Navigation │      Content Area          │
│  (100px)   │        (Flexible)          │
│            │                            │
├────────────┼────────────────────────────┤
│ • Channels │ • Provider-specific view   │
│ • System   │                            │
└────────────┴────────────────────────────┘
```

### Provider-Specific Layouts

Each provider implements its own layout, which is inconsistent with the main application layout and with other providers.

*   **Direct Messages**: Implements a **three-pane layout** (Conversation List, Message Area, User Presence).
*   **Email**: Implements a **three-pane layout** (Email Sidebar, Conversation List, Message Viewer).
*   **WhatsApp**: Implements a **two-pane layout** (Conversation List, Message Area).

This architectural fragmentation leads to a disjointed user experience and increases the complexity of maintenance and development.

---

## File Structure

```
src/widgets/frontdesk/
├── frontdesk-widget.tsx                 # Main widget entry point
│
├── layouts/                             # Layout components
│   ├── three-column/
│   │   ├── ThreeColumnLayout.tsx       # Main two-column layout
│
├── providers/                           # Communication providers
│   ├── email/                          # Email provider
│   ├── internal/                       # Direct Messages provider
│   ├── whatsapp/                       # WhatsApp provider
│   └── unified/                        # Unified inbox provider (partially implemented)
│
├── components/                          # Shared components
│
├── hooks/                               # Custom hooks
│
src/store/frontdesk/                    # State management (Recoil)
│
src/services/api-service/frontdesk/     # API services
```

---

## Core Features

*   **Multi-Provider Support**: Separate views for Direct Messages, Email, and WhatsApp.
*   **Real-time Messaging**: The Direct Messages provider supports real-time messaging, typing indicators, and user presence via WebSockets.
*   **Custom Hooks**: Each provider uses a custom React hook (`useDirectMessages`, `useEmailProvider`, `useWhatsAppProvider`) to encapsulate its logic and state management.
*   **Authentication**: The Email provider includes support for OAuth authentication.

---

## State Management

The application uses **Recoil** for state management. The state is well-granularized, with separate atoms and selectors for each provider. This is a good practice that helps to keep the state organized and performant.

---

## API Integration

Each provider has its own API service for handling REST API calls. The Direct Messages provider also uses a WebSocket service for real-time communication. This separation of concerns is a good architectural pattern.

---

## Architectural Issues and Recommendations

The Frontdesk feature has a solid foundation, but it is held back by significant architectural inconsistencies. The following recommendations are intended to address these issues and create a more robust and maintainable application.

### 1. Unify the Layout

The most critical issue is the lack of a consistent layout.

*   **Recommendation**: Decide on a single, consistent layout for all providers. A three-column layout (Navigation, Conversation List, Message Area) is a common and effective pattern for messaging applications.
*   **Action Items**:
    *   Refactor the `ThreeColumnLayout.tsx` component to be a true three-column layout.
    *   Refactor all providers to use the unified `ThreeColumnLayout` component. This will involve removing the provider-specific layout code and adapting the components to fit into the new layout.

### 2. Increase Code Sharing

There is an opportunity to increase code sharing between providers.

*   **Recommendation**: Create and use more shared components for common UI elements.
*   **Action Items**:
    *   Create generic `ConversationList` and `MessageViewer` components that can be used by all providers.
    *   Abstract the common logic for fetching and managing conversations and messages into a base hook or service that can be extended by each provider.

### 3. Implement Missing Features

The documentation mentions several features that are not fully implemented.

*   **Recommendation**: Prioritize the implementation of the Unified Inbox to deliver on the core promise of the Frontdesk feature.
*   **Action Items**:
    *   Complete the implementation of the `UnifiedProvider` to aggregate conversations from all providers into a single view.
    *   Implement global search and keyboard shortcuts to improve usability.

### 4. Update This Document

This document should be kept up-to-date to reflect the current state of the architecture.

*   **Recommendation**: After implementing the recommended changes, update this document to accurately describe the new, unified architecture.

---

## Development Guide

### Adding a New Provider

1.  **Create Provider Directory**: Create a new directory for the provider in `src/widgets/frontdesk/providers/`.
2.  **Implement Provider Logic**: Create a custom hook to manage the provider's state and logic.
3.  **Create Provider View**: Create the main view component for the provider. This component should use the unified `ThreeColumnLayout` and other shared components.
4.  **Register Provider**: Register the new provider in `frontdesk-widget.tsx`.
5.  **Add to Navigation**: Add the new provider to the `NavigationSidebar`.
6.  **Update State**: Add any necessary Recoil atoms and selectors for the new provider.
7.  **Add API Service**: Create an API service for the new provider.
8.  **Write Documentation**: Update this document to include the new provider.