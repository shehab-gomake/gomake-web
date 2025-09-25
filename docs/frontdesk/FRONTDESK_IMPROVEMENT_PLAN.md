# Frontdesk Improvement and Refactoring Plan

## Overview

This document outlines the necessary fixes and improvements for the Frontdesk feature. The feature has a solid foundation with robust real-time capabilities and a well-designed state management system. However, it suffers from significant architectural inconsistencies and incomplete features that hinder its maintainability and user experience.

This plan prioritizes the issues from most to least critical. Addressing these points will lead to a more stable, maintainable, and consistent application.

---

### 1. Architectural Unification: Standardize the Layout (Priority: Critical)

**Problem:**
The application lacks a consistent layout. There are four different layouts currently in use:
1.  **Main App:** A two-column layout (`Navigation Sidebar` | `Content Area`).
2.  **Direct Messages Provider:** A three-pane layout (`Conversation List` | `Message Area` | `User Presence`).
3.  **Email Provider:** A three-pane layout (`Email Sidebar` | `Conversation List` | `Message Viewer`).
4.  **WhatsApp Provider:** A two-pane layout (`Conversation List` | `Message Area`).

**Context:**
This fragmentation creates a jarring and inconsistent user experience. It also significantly increases the maintenance overhead, as each layout is managed independently. The main layout component, `ThreeColumnLayout.tsx`, is misnamed as it actually implements a two-column layout, which adds to the confusion.

**Solution:**
A single, unified layout should be adopted across the entire Frontdesk feature.

1.  **Decide on a Standard Layout:** A three-column layout (`Navigation` | `List` | `Content`) is a standard and effective pattern for this type of application.
2.  **Refactor `ThreeColumnLayout.tsx`:** Update this component to be a true, generic three-column layout that can be configured by the providers.
3.  **Refactor All Providers:**
    *   Modify the **Direct Messages**, **Email**, and **WhatsApp** providers to use the unified `ThreeColumnLayout`.
    *   Remove the provider-specific layout logic and adapt their components to fit into the standardized columns. For example, the `User Presence` pane from Direct Messages could be an optional third column.

---

### 2. Complete WhatsApp Provider Implementation (Priority: High)

**Problem:**
The WhatsApp provider is currently a mock implementation and is not functional.

**Context:**
The `use-whatsapp-provider.ts` hook uses hardcoded data (`MOCK_CONVERSATIONS`, `MOCK_MESSAGES`) and simulates API calls with `setTimeout`. There is no real API or WebSocket integration. This is misleading and leaves a core feature of the application incomplete.

**Solution:**
The mock implementation needs to be replaced with a fully functional provider.

1.  **API Integration:** Connect the provider to the actual WhatsApp API service.
2.  **WebSocket Integration:** Implement real-time updates for messages and presence, similar to the Direct Messages provider.
3.  **State Management:** Integrate the provider with the Recoil state management system, creating the necessary atoms and selectors in `src/store/frontdesk`.
4.  **Layout:** Ensure the provider uses the new, unified layout as described in the first point.

---

### 3. Complete the Unified Inbox Feature (Priority: Medium)

**Problem:**
The Unified Inbox can aggregate conversations from all providers but cannot display the messages of a selected conversation.

**Context:**
The `UnifiedProvider.tsx` is a good start, but it's incomplete. When a user clicks on a conversation in the unified list, it only shows a placeholder instead of loading the appropriate message viewer from the corresponding provider. This leaves the core feature of the Unified Inbox unfinished.

**Solution:**
Implement the logic to dynamically render the correct message viewer.

1.  **Dynamic Component Loading:** In the `UnifiedProvider`, when a conversation is selected, determine its provider (e.g., from a `provider` property on the conversation object).
2.  **Render Provider's Viewer:** Dynamically render the message viewer component from the correct provider (e.g., `EmailMessageViewer`, `MessageList` for Direct Messages).
3.  **Pass Correct Props:** Ensure that the necessary props (e.g., `conversationId`, `messages`) are passed to the dynamically loaded component.

---

### 4. Increase Code Sharing with Generic Components (Priority: Medium)

**Problem:**
There is significant code duplication in the UI layer due to the lack of truly generic, shared components.

**Context:**
The shared components in `src/widgets/frontdesk/components/conversation/` are not generic enough to be used by all providers. For example, `ConversationThread` has hardcoded logic for a "me vs. them" model, which doesn't work for multi-participant email or group chat threads. This has led to each provider implementing its own version of these components.

**Solution:**
Refactor the shared components to be truly generic and reusable.

1.  **Abstract Component Logic:** Remove provider-specific logic from the shared components.
2.  **Improve Prop Flexibility:** Update the component props to accept more flexible data structures. For example, instead of a `fromName` string, a `ConversationHeader` could accept an array of participant objects.
3.  **Create a Base Component Library:** Establish a set of base components (e.g., `BaseConversationList`, `BaseMessageViewer`) that can be configured and styled by each provider to meet their specific needs.
4.  **Refactor Providers to Use Shared Components:** Update the providers to use these new, generic components, removing the duplicated code.
