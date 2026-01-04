# Database (Data Model)

## Chatwoot Data Model (Reference)
The frontend mirrors the Chatwoot data model.

### Key Entities
-   **Account**: Tenant isolation.
-   **User**: Agent/Admin.
-   **Inbox**: Communication channel (Email, WhatsApp, API).
-   **Conversation**: Session between Contact and Inbox.
-   **Message**: Individual communication unit.
-   **Contact**: End-user profile.
-   **Team**: Group of Agents.

### State Normalization
Recoil atoms store data in a normalized format to ensure consistency across views.
