# Task: Unify the Frontdesk Feature Architecture

### **Objective**

The primary goal of this task is to refactor the Frontdesk feature to use a single, consistent layout architecture. This will resolve significant user experience (UX) inconsistencies and reduce code duplication, making the feature more stable, scalable, and easier to maintain.

### **Background & Context**

The Frontdesk is a messaging hub designed to integrate multiple communication providers (Direct Messages, Email, WhatsApp) into a unified interface.

A thorough investigation of the feature has revealed a critical architectural flaw: the lack of a consistent layout. Currently, there are four different layouts in use:

1.  **Main Application Shell**: A two-column layout (`Navigation Sidebar` | `Content Area`).
2.  **Direct Messages Provider**: A unique three-pane layout.
3.  **Email Provider**: A different three-pane layout.
4.  **WhatsApp Provider**: A two-pane layout.

This fragmentation creates a jarring user experience when navigating between providers and makes the codebase difficult to manage. The core layout component, `ThreeColumnLayout.tsx`, is misleadingly named as it currently implements a two-column structure.

For a complete understanding of the issues and the overall architecture, please review the following documents before starting:
*   `docs/frontdesk/FRONTDESK_ARCHITECTURE.md`
*   `docs/frontdesk/FRONTDESK_IMPROVEMENT_PLAN.md`

### **The Task: Step-by-Step Implementation Plan**

Your task is to refactor the feature to standardize on a single, consistent layout.

**Step 1: Establish a Standard Three-Column Layout**
The standard for the application will be a three-column layout: `Navigation` | `List` | `Content`.

Your first action is to refactor the existing `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx` component. It should be modified to be a true, generic three-column layout component that accepts React nodes as props for each of its three columns.

**Step 2: Refactor Each Provider to Use the Unified Layout**
This is the core of the task. You will need to go into each provider's main view component and replace its custom layout structure with the newly refactored `ThreeColumnLayout`.

*   **Direct Messages Provider:**
    *   **File:** `src/widgets/frontdesk/providers/internal/direct-messages-provider-view.tsx`
    *   **Action:** This view currently has three panes (`ConversationList`, the main message area, and `UserPresence`). Map these panes to the three columns of the unified layout. The `UserPresence` panel is a good candidate for the optional third column.

*   **Email Provider:**
    *   **File:** `src/widgets/frontdesk/providers/email/email-provider-view.tsx`
    *   **Action:** This view also has three panes (`EmailSidebar`, `EmailConversationList`, `EmailMessageViewer`). Map these to the unified layout. The `EmailSidebar` and `EmailConversationList` could potentially be combined into the second (`List`) column.

*   **WhatsApp Provider:**
    *   **File:** `src/widgets/frontdesk/providers/whatsapp/whatsapp-provider-view.tsx`
    *   **Action:** This view has two panes (`WhatsAppConversationList` and the message area). These will map to the second (`List`) and third (`Content`) columns of the new layout.

**Step 3: Update the Main Widget**
The main widget, `src/widgets/frontdesk/frontdesk-widget.tsx`, orchestrates which provider is displayed. You will need to update its rendering logic to correctly pass the components from each provider into the new, unified `ThreeColumnLayout`.

### **Key Files to Investigate**

*   **Core Layout Component (to be refactored):**
    *   `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`
*   **Main Orchestrator (to be updated):**
    *   `src/widgets/frontdesk/frontdesk-widget.tsx`
*   **Provider Views (to be refactored):**
    *   `src/widgets/frontdesk/providers/internal/direct-messages-provider-view.tsx`
    *   `src/widgets/frontdesk/providers/email/email-provider-view.tsx`
    *   `src/widgets/frontdesk/providers/whatsapp/whatsapp-provider-view.tsx`

### **Acceptance Criteria (Definition of Done)**

*   All providers (Email, Direct Messages, WhatsApp) render within the single, consistent, refactored `ThreeColumnLayout` component.
*   The user can navigate between different providers, and the core layout structure remains consistent.
*   Provider-specific layout code (e.g., custom `Stack` components creating panes) has been removed and replaced by the unified layout.
*   All features within each provider (sending messages, listing conversations, etc.) remain fully functional after the refactor.
*   The application is responsive and works correctly on different screen sizes.

Thank you for your work on this critical refactoring. This will significantly improve the quality and consistency of the Frontdesk feature.
