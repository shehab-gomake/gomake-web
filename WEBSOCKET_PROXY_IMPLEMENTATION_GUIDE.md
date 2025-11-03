# WebSocket Proxy Implementation Guide

## Current State Analysis

### Current Limitations

- **Controller**: Uses `@All()` decorator which only handles HTTP methods (GET, POST, etc.)
- **Service**: Uses Axios/HttpService which is HTTP-only
- **No WebSocket Gateway**: Missing `@WebSocketGateway` implementation
- **No WS Upgrade Handling**: Cannot handle WebSocket upgrade requests

### What Chatwoot Requires

Chatwoot uses **ActionCable** (Rails WebSocket library) which requires:

1. **WebSocket endpoint**: `/cable` (the standard ActionCable endpoint)
2. **Protocol**: WebSocket upgrade from HTTP
3. **Authentication**: `pubsub_token` in connection params
4. **Channel subscription**: `RoomChannel` with `pubsub_token`, `account_id`, `user_id`

---

## Implementation Plan

### Phase 1: Add WebSocket Gateway

Create a new WebSocket gateway that handles the `/cable` endpoint:

```typescript
// src/gateways/chatwoot-websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import * as WebSocket from "ws";

@WebSocketGateway({
  namespace: "/cable",
  path: "/cable",
  transports: ["websocket"],
})
export class ChatwootWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatwootWebSocketGateway.name);
  private chatwootWsUrl: string;
  private activeConnections = new Map<string, WebSocket>();

  constructor() {
    // Get Chatwoot WebSocket URL from config
    this.chatwootWsUrl = process.env.CHATWOOT_WS_URL || "ws://localhost:3000/cable";
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connecting: ${client.id}`);

    // Extract authentication info from handshake
    const { pubsub_token, account_id, user_id } = client.handshake.query;

    if (!pubsub_token) {
      this.logger.warn(`Connection rejected: missing pubsub_token`);
      client.disconnect();
      return;
    }

    // Create WebSocket connection to Chatwoot
    try {
      const chatwootWs = await this.createChatwootConnection(pubsub_token, account_id, user_id, client);

      this.activeConnections.set(client.id, chatwootWs);
      this.logger.log(`Proxy connection established: ${client.id}`);
    } catch (error) {
      this.logger.error(`Failed to connect to Chatwoot: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnecting: ${client.id}`);

    const chatwootWs = this.activeConnections.get(client.id);
    if (chatwootWs) {
      chatwootWs.close();
      this.activeConnections.delete(client.id);
    }
  }

  private createChatwootConnection(
    pubsubToken: string,
    accountId: string,
    userId: string,
    clientSocket: Socket
  ): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      // Build ActionCable connection URL with query params
      const url = `${this.chatwootWsUrl}?pubsub_token=${pubsubToken}&account_id=${accountId}&user_id=${userId}`;

      const ws = new WebSocket(url, {
        headers: {
          Origin: process.env.FRONTEND_URL || "http://localhost:3004",
        },
      });

      ws.on("open", () => {
        this.logger.log(`Connected to Chatwoot WebSocket for client ${clientSocket.id}`);
        resolve(ws);
      });

      ws.on("message", (data: WebSocket.Data) => {
        // Forward messages from Chatwoot to client
        try {
          const message = JSON.parse(data.toString());
          clientSocket.emit("message", message);
        } catch (error) {
          // If not JSON, forward as-is (ActionCable protocol)
          clientSocket.emit("message", data.toString());
        }
      });

      ws.on("error", (error) => {
        this.logger.error(`Chatwoot WebSocket error: ${error.message}`);
        clientSocket.emit("error", { message: "WebSocket connection error" });
      });

      ws.on("close", () => {
        this.logger.log(`Chatwoot WebSocket closed for client ${clientSocket.id}`);
        clientSocket.disconnect();
      });

      // Forward messages from client to Chatwoot
      clientSocket.on("message", (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          const message = typeof data === "string" ? data : JSON.stringify(data);
          ws.send(message);
        }
      });

      ws.on("error", reject);
    });
  }
}
```

### Phase 2: Update Module Registration

```typescript
// src/app.module.ts or your feature module
import { Module } from "@nestjs/common";
import { ChatwootWebSocketGateway } from "./gateways/chatwoot-websocket.gateway";

@Module({
  imports: [
    // ... other imports
  ],
  providers: [
    ChatwootWebSocketGateway,
    // ... other providers
  ],
})
export class AppModule {}
```

### Phase 3: ActionCable Protocol Support

Since Chatwoot uses ActionCable protocol, you need to handle ActionCable-specific messages:

```typescript
// src/gateways/chatwoot-websocket.gateway.ts (enhanced version)

import { ActionCableProtocolHandler } from './handlers/actioncable-protocol.handler';

// Add to ChatwootWebSocketGateway class:

private protocolHandler: ActionCableProtocolHandler;

constructor() {
  this.chatwootWsUrl = process.env.CHATWOOT_WS_URL || 'ws://localhost:3000/cable';
  this.protocolHandler = new ActionCableProtocolHandler();
}

private createChatwootConnection(...) {
  // ... existing code ...

  ws.on('message', (data: WebSocket.Data) => {
    const message = this.protocolHandler.parseMessage(data);

    // Handle ActionCable protocol messages
    if (message.type === 'welcome') {
      clientSocket.emit('connected', { status: 'connected' });
    } else if (message.type === 'ping') {
      // Echo ping back
      clientSocket.emit('message', message);
    } else if (message.type === 'message') {
      // Forward actual application messages
      clientSocket.emit('message', message.data);
    } else {
      // Forward other protocol messages
      clientSocket.emit('message', message);
    }
  });

  // Handle client messages
  clientSocket.on('message', (data: any) => {
    if (ws.readyState === WebSocket.OPEN) {
      const actionCableMessage = this.protocolHandler.formatMessage(data);
      ws.send(actionCableMessage);
    }
  });
}
```

### Phase 4: ActionCable Protocol Handler

```typescript
// src/gateways/handlers/actioncable-protocol.handler.ts

export class ActionCableProtocolHandler {
  /**
   * Parse ActionCable protocol messages
   * ActionCable uses JSON messages with specific structure
   */
  parseMessage(data: WebSocket.Data): any {
    try {
      const str = data.toString();
      const message = JSON.parse(str);

      // ActionCable message types:
      // - {"type":"welcome"} - connection established
      // - {"type":"ping","message":1234567890} - keepalive
      // - {"type":"confirm_subscription","identifier":"..."} - subscription confirmed
      // - {"identifier":"...","message":{...}} - actual data

      return message;
    } catch (error) {
      // If not JSON, return as-is
      return { type: "raw", data: data.toString() };
    }
  }

  /**
   * Format client message for ActionCable protocol
   */
  formatMessage(clientMessage: any): string {
    if (typeof clientMessage === "string") {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(clientMessage);
        return JSON.stringify(parsed);
      } catch {
        // If not JSON, wrap in ActionCable format
        return JSON.stringify({ command: "message", data: clientMessage });
      }
    }

    return JSON.stringify(clientMessage);
  }
}
```

### Phase 5: Authentication & Authorization

Add JWT validation before allowing WebSocket connections:

```typescript
// src/gateways/chatwoot-websocket.gateway.ts

import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@WebSocketGateway({
  namespace: "/cable",
  path: "/cable",
  transports: ["websocket"],
})
export class ChatwootWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // ... existing code ...

  async handleConnection(client: Socket) {
    // Extract JWT token from handshake
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      this.logger.warn(`Connection rejected: missing token`);
      client.disconnect();
      return;
    }

    // Validate JWT token
    try {
      const user = await this.validateToken(token);
      if (!user) {
        client.disconnect();
        return;
      }

      // Get pubsub_token from user or generate it
      const pubsubToken = await this.getPubsubToken(user);

      // Continue with connection...
      const { account_id, user_id } = client.handshake.query;
      // ... rest of connection logic
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`);
      client.disconnect();
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    // Try Authorization header first
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Try query parameter
    return (client.handshake.query.token as string) || null;
  }

  private async validateToken(token: string): Promise<any> {
    // Your JWT validation logic
    // Return user object or null
  }

  private async getPubsubToken(user: any): Promise<string> {
    // Fetch or generate pubsub_token for the user
    // This should match Chatwoot's pubsub_token format
  }
}
```

### Phase 6: Environment Configuration

```bash
# .env

# Chatwoot Configuration
CHATWOOT_API_URL=http://localhost:3000
CHATWOOT_WS_URL=ws://localhost:3000/cable
CHATWOOT_API_KEY=your_api_key_here

# Frontend URL (for WebSocket Origin header)
FRONTEND_URL=http://localhost:3004
```

### Phase 7: Update HTTP Proxy (Keep Existing)

Your existing HTTP proxy should remain unchanged for REST API calls:

```typescript
// src/controllers/chatwoot-proxy.controller.ts (existing)
import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";

@Controller("api/v1")
export class ChatwootProxyController {
  constructor(private readonly httpService: HttpService) {}

  @All("*")
  async proxy(@Req() req: Request, @Res() res: Response) {
    // Your existing HTTP proxy logic
    // This handles all HTTP requests (GET, POST, etc.)
    // WebSocket upgrade requests will NOT reach here
  }
}
```

---

## File Structure

```
src/
├── gateways/
│   ├── chatwoot-websocket.gateway.ts      # Main WebSocket gateway
│   └── handlers/
│       └── actioncable-protocol.handler.ts # ActionCable protocol handling
├── controllers/
│   └── chatwoot-proxy.controller.ts       # Existing HTTP proxy (unchanged)
├── services/
│   └── chatwoot-proxy.service.ts          # HTTP proxy service (unchanged)
└── app.module.ts                          # Register gateway
```

---

## Dependencies Required

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io ws
npm install --save-dev @types/ws
```

---

## Testing

### Test WebSocket Connection

```typescript
// test/websocket.test.ts
import { io } from "socket.io-client";

describe("Chatwoot WebSocket Gateway", () => {
  it("should connect to /cable endpoint", async () => {
    const socket = io("http://localhost:3000/cable", {
      query: {
        pubsub_token: "test_token",
        account_id: "1",
        user_id: "1",
      },
      transports: ["websocket"],
    });

    await new Promise((resolve) => {
      socket.on("connect", () => {
        expect(socket.connected).toBe(true);
        resolve(null);
      });
    });

    socket.disconnect();
  });
});
```

---

## Key Differences: HTTP vs WebSocket

| Aspect               | HTTP Proxy                 | WebSocket Gateway      |
| -------------------- | -------------------------- | ---------------------- |
| **NestJS Decorator** | `@Controller()` + `@All()` | `@WebSocketGateway()`  |
| **Protocol**         | HTTP (GET, POST, etc.)     | WebSocket (upgrade)    |
| **Library**          | Axios/HttpService          | `ws` + Socket.IO       |
| **Connection**       | Request/Response           | Persistent connection  |
| **Path**             | `/api/v1/*`                | `/cable`               |
| **Authentication**   | Bearer token header        | Query params + headers |

---

## Migration Steps

1. ✅ **Install dependencies**: `npm install @nestjs/websockets ws socket.io`
2. ✅ **Create gateway**: Implement `ChatwootWebSocketGateway`
3. ✅ **Add protocol handler**: Implement ActionCable protocol handling
4. ✅ **Add authentication**: Integrate JWT validation
5. ✅ **Register in module**: Add gateway to module providers
6. ✅ **Test connection**: Verify WebSocket upgrade works
7. ✅ **Update frontend**: Point frontend to new WebSocket endpoint

---

## Frontend Changes

Your frontend should now connect to YOUR proxy instead of Chatwoot directly:

```typescript
// Before (direct to Chatwoot)
const cable = ActionCable.createConsumer("ws://chatwoot-server:3000/cable");

// After (through your proxy)
const cable = ActionCable.createConsumer("ws://your-proxy:3000/cable");
```

---

## Security Considerations

1. **Validate JWT tokens** before allowing WebSocket connections
2. **Rate limiting** on WebSocket connections
3. **Connection pooling** to prevent resource exhaustion
4. **Origin validation** to prevent unauthorized connections
5. **Pubsub token validation** matches Chatwoot's format

---

## Troubleshooting

### Connection fails immediately

- Check WebSocket URL format (`ws://` not `http://`)
- Verify ActionCable endpoint is `/cable`
- Check authentication tokens

### Messages not forwarding

- Verify ActionCable protocol parsing
- Check message format matches ActionCable spec
- Enable logging to see raw messages

### High memory usage

- Implement connection cleanup on disconnect
- Add connection limits per user
- Monitor active connections map size
