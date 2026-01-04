# Backend Architecture (API Integration)

## Service Layer (`src/services/frontdesk/api/chatwoot`)
The frontend interacts with the backend via a structured service layer.

### Core Services
-   `chatwoot.service.ts`: Main entry point.
-   `chatwoot-http-client.ts`: HTTP Client with Interceptors.

### API Modules
-   `profile`: User profile management.
-   `conversations`: CRUD for conversations.
-   `messages`: Send/Receive messages.
-   `inboxes`: Channel management.
-   `contacts`: CRM features.
-   `notifications`: Alert management.

## Proxy Integration
-   **Base URL**: `http://localhost:8080` (Dev) / Cloud Run URL (Prod).
-   **Path Transformation**: The proxy handles mapping `/api/conversations` to `/api/v1/accounts/{id}/conversations`.
