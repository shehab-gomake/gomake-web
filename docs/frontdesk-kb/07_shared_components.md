# Shared Components

In addition to the formal Design System, the `src/widgets/frontdesk/components/` directory contains a number of shared components that are used across different providers.

## Key Shared Components

-   `components/conversation/`: A collection of components for building the main conversation view, including:
    -   `conversation-header.tsx`
    -   `conversation-reply-box.tsx`
    -   `conversation-thread.tsx`

-   `components/providers/`: A set of base components to help standardize the look and feel of provider views, including:
    -   `base-provider-view.tsx`: A base layout for a provider.
    -   `base-conversation-list.tsx`: A reusable conversation list.

-   `components/shared/`: A collection of other shared components, such as:
    -   `BaseMessageViewer.tsx`
    -   `BaseConversationList.tsx`
    -   `InlineReplySection.tsx`
