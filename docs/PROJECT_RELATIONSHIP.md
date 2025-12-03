# Project Relationship Summary

## Overview
`gomake-web` and `messaging-hub-v2` are part of a microservices architecture where `gomake-web` acts as the frontend client and `messaging-hub-v2` serves as a backend WebSocket gateway/proxy.

## gomake-web
- **Type**: Frontend Application (Next.js)
- **Role**: Client
- **Connection**: Connects to `messaging-hub-v2` via HTTP and WebSocket.
- **Key Files**:
    - `src/services/frontdesk/api/chatwoot/chatwoot.service.ts`: Defines the HTTP connection to `http://localhost:8080`.
    - `src/services/frontdesk/websocket/chatwoot-websocket.service.ts`: Defines the WebSocket connection to `ws://localhost:8080/cable`.
    - `WEBSOCKET_PROXY_IMPLEMENTATION_GUIDE.md`: Documentation describing the implementation of the WebSocket proxy.

## messaging-hub-v2
- **Type**: Backend Application (NestJS)
- **Role**: WebSocket Gateway / Proxy
- **Port**: Listens on port `8080`.
- **Endpoints**:
    - HTTP: `http://localhost:8080`
    - WebSocket: `/cable` (Standard ActionCable endpoint, used by Chatwoot)
- **Function**: It appears to proxy Chatwoot functionality, allowing `gomake-web` to communicate with Chatwoot (or a compatible service) via this hub.

## Interaction
1.  **Configuration**: `gomake-web` uses the `CHATWOOT_SERVER` environment variable or defaults to `http://localhost:8080`.
2.  **WebSocket Handshake**: `gomake-web` initiates a WebSocket connection to `messaging-hub-v2` at the `/cable` endpoint.
3.  **Protocol**: They communicate using a protocol compatible with ActionCable (used by Chatwoot), as evidenced by the endpoint name and the client libraries used.
