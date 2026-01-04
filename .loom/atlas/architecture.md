# System Architecture: FrontDesk Chatwoot

## Overview
FrontDesk is a unified messaging hub within the GoMake platform. The Chatwoot provider integrates the open-source Chatwoot customer support platform into FrontDesk.

## High-Level Data Flow
1.  **Client (FrontDesk)**: Next.js/React application.
2.  **Proxy (messaging-hub-v2)**: NestJS service that authenticates requests and forwards them to Chatwoot.
3.  **Backend (Chatwoot)**: Ruby on Rails application (v4.7.0) managing conversations, messages, and contacts.

## Authentication
-   **Mechanism**: JWT Bearer Token.
-   **Flow**:
    1.  FrontDesk sends request with GoMake JWT.
    2.  Proxy validates JWT via GoMake Users API.
    3.  Proxy auto-provisions Chatwoot User/Account if needed.
    4.  Proxy transforms request path.
    5.  Proxy forwards request to Chatwoot with internal access token.

## Key Components
-   **Provider View**: `ChatwootProviderView` (Main Router).
-   **State Management**: Recoil (Atoms/Selectors).
-   **Services**: `ChatwootService` (API Aggregator).
-   **WebSocket**: `ChatwootWebSocketService` (Real-time updates).
