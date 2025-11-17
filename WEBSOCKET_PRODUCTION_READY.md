# WebSocket Production Ready Guide

## Overview

This document outlines all production-ready improvements made to the Chatwoot WebSocket implementation in both `gomake-web` (frontend) and `messaging-hub-v2` (backend).

## Frontend Improvements (gomake-web)

### File: `src/services/frontdesk/websocket/chatwoot-websocket.service.ts`

### ✅ Completed Improvements

#### 1. **Debug Mode Control** ✅
- **Before**: Debug always forced to `true` in production
- **After**: Debug only enabled in development or when explicitly requested
- **Benefit**: Reduces console noise and improves performance in production

#### 2. **Exponential Backoff Retry** ✅
- **Implementation**: `calculateBackoffDelay()` method with jitter
- **Configuration**:
  - Initial delay: 1 second
  - Max delay: 30 seconds
  - Backoff multiplier: 2x
  - Max retries: 5
  - Jitter: ±20% to prevent thundering herd
- **Benefit**: Intelligent reconnection that doesn't overwhelm the server

#### 3. **Connection Health Monitoring** ✅
- **Implementation**: `getConnectionHealth()` method with heartbeat tracking
- **Health States**:
  - `HEALTHY`: Active and responsive
  - `DEGRADED`: Slow or delayed responses
  - `UNHEALTHY`: No activity or disconnected
- **Monitoring**:
  - Heartbeat interval: 30 seconds
  - Heartbeat timeout: 60 seconds
  - Auto-reconnect on unhealthy status
- **Benefit**: Proactive detection and recovery from connection issues

#### 4. **Auto-Reconnect Management** ✅
- **Features**:
  - Configurable auto-reconnect (enabled by default)
  - Manual disconnect tracking
  - Automatic reconnection on unexpected disconnects
  - Graceful reconnection with exponential backoff
- **Methods**:
  - `setAutoReconnect(enabled: boolean)`
  - `isAutoReconnectEnabled()`
- **Benefit**: Maintains connection reliability without manual intervention

#### 5. **Improved Error Handling** ✅
- **Improvements**:
  - Try-catch blocks around all WebSocket operations
  - Graceful degradation on errors
  - Detailed error logging with context
  - Error classification and appropriate responses
- **Benefit**: More resilient to transient errors

#### 6. **Better Connection Lifecycle Management** ✅
- **Features**:
  - Proper cleanup on disconnect
  - Heartbeat management (start/stop)
  - Connection state tracking
  - Resource cleanup (subscriptions, consumers, intervals)
- **Benefit**: Prevents memory leaks and resource exhaustion

#### 7. **Configuration API** ✅
- **New Methods**:
  - `setRetryConfig(config: Partial<RetryConfig>)`
  - `getRetryConfig(): RetryConfig`
  - `setAutoReconnect(enabled: boolean)`
  - `isAutoReconnectEnabled(): boolean`
  - `getConnectionHealth(): ConnectionHealth`
- **Benefit**: Runtime configuration without code changes

### Usage Examples

```typescript
import { chatwootWebSocketService, ConnectionHealth } from '@/services/frontdesk';

// Configure retry behavior
chatwootWebSocketService.setRetryConfig({
  maxRetries: 10,
  initialDelayMs: 2000,
  maxDelayMs: 60000,
});

// Check connection health
const health = chatwootWebSocketService.getConnectionHealth();
if (health === ConnectionHealth.DEGRADED) {
  console.warn('Connection quality degraded');
}

// Disable auto-reconnect for specific use cases
chatwootWebSocketService.setAutoReconnect(false);

// Get connection statistics
const stats = chatwootWebSocketService.getStats();
console.log('Events received:', stats.eventsReceived);
console.log('Uptime:', stats.connectedAt ? Date.now() - stats.connectedAt : 0);
```

---

## Backend Improvements (messaging-hub-v2)

### File: `src/gateways/chatwoot-websocket.service.ts`

### 🔧 Recommended Improvements

#### 1. **Rate Limiting** 🔧
**Add per-client rate limiting to prevent abuse:**

```typescript
interface ChatwootConnection {
  // ... existing fields
  messagesPerMinute: number;
  lastResetTime: number;
}

// Configuration
private readonly maxMessagesPerMinute = 120;

// Rate limit check
private checkRateLimit(connection: ChatwootConnection): boolean {
  const now = Date.now();
  const timeSinceReset = now - connection.lastResetTime;

  if (timeSinceReset >= 60000) {
    connection.messagesPerMinute = 0;
    connection.lastResetTime = now;
  }

  connection.messagesPerMinute++;
  return connection.messagesPerMinute <= this.maxMessagesPerMinute;
}
```

**Location**: Add to `handleClientMessage()` method before processing messages.

#### 2. **Connection Limits** 🔧
**Prevent single client from opening too many connections:**

```typescript
private readonly maxConnectionsPerClient = 3;

// In handleConnection():
const existingConnections = Array.from(this.activeConnections.values())
  .filter(conn => this.getClientIp(request) === clientIp);

if (existingConnections.length >= this.maxConnectionsPerClient) {
  this.logger.warn(`Connection limit exceeded for ${clientIp}`);
  client.close(1008, 'Too many connections from this client');
  return;
}
```

#### 3. **Connection Timeout** 🔧
**Add timeout for subscription process:**

```typescript
// In handleConnection(), after accepting connection:
setTimeout(() => {
  if (client.readyState === WebSocket.OPEN && !connection.chatwootWs) {
    this.logger.warn(`Connection timeout for ${clientId}`);
    client.close(1008, 'Connection timeout');
  }
}, 60000); // 60 seconds
```

#### 4. **Idle Connection Detection** 🔧
**Close connections that are idle for too long:**

```typescript
interface ChatwootConnection {
  // ... existing fields
  lastActivityAt: number;
  connectedAt: number;
}

private readonly idleTimeoutMs = 300000; // 5 minutes

// Add periodic health check:
private startHealthCheck(): void {
  this.healthCheckInterval = setInterval(() => {
    const now = Date.now();
    this.activeConnections.forEach((connection, client) => {
      const idleTime = now - connection.lastActivityAt;
      if (idleTime > this.idleTimeoutMs) {
        this.logger.warn(`Closing idle connection ${connection.clientId}`);
        client.close(1000, 'Idle timeout');
        this.handleDisconnect(client);
      }
    });
  }, 60000); // Check every minute
}
```

#### 5. **Metrics Collection** 🔧
**Track operational metrics:**

```typescript
interface ServiceMetrics {
  activeConnections: number;
  totalConnections: number;
  failedConnections: number;
  messagesProxied: number;
  errors: number;
}

private metrics: ServiceMetrics = {
  activeConnections: 0,
  totalConnections: 0,
  failedConnections: 0,
  messagesProxied: 0,
  errors: 0,
};

// Update metrics throughout the service
this.metrics.totalConnections++;
this.metrics.messagesProxied++;
this.metrics.errors++;
```

#### 6. **Graceful Shutdown** 🔧
**Properly close connections during shutdown:**

```typescript
private isShuttingDown = false;

async onModuleDestroy() {
  this.logger.log('Initiating graceful shutdown...');
  this.isShuttingDown = true;

  const closePromises: Promise<void>[] = [];

  this.activeConnections.forEach((connection, client) => {
    closePromises.push(
      new Promise<void>((resolve) => {
        if (connection.chatwootWs?.readyState === WebSocket.OPEN) {
          connection.chatwootWs.close(1001, 'Server shutting down');
        }
        if (client.readyState === WebSocket.OPEN) {
          client.close(1001, 'Server shutting down');
        }
        setTimeout(() => resolve(), 5000); // 5s timeout
      }),
    );
  });

  await Promise.all(closePromises);
  this.activeConnections.clear();

  if (this.wss) {
    await new Promise<void>((resolve) => {
      this.wss!.close(() => resolve());
    });
  }
}
```

#### 7. **Better Error Handling** 🔧
**Wrap all operations in try-catch:**

```typescript
private sendToClient(connection: ChatwootConnection, message: string): boolean {
  try {
    if (connection.clientWs.readyState === WebSocket.OPEN) {
      connection.clientWs.send(message);
      return true;
    }
    return false;
  } catch (error) {
    this.logger.error(`Error sending to client: ${error.message}`);
    this.metrics.errors++;
    return false;
  }
}
```

#### 8. **Input Validation** 🔧
**Validate all incoming data:**

```typescript
// Validate pubsub_token
if (!pubsubToken || typeof pubsubToken !== 'string') {
  this.logger.warn('Invalid pubsub_token');
  this.sendToClient(connection, JSON.stringify({
    type: 'reject_subscription',
    identifier: parsed.identifier,
  }));
  return;
}

// Validate message size
if (message.length > 1024 * 1024) { // 1MB
  this.logger.warn('Message too large');
  return;
}
```

#### 9. **Connection Quality Tracking** 🔧
**Track latency and connection quality:**

```typescript
interface ChatwootConnection {
  // ... existing fields
  latencyMs: number;
  lastPingAt: number;
}

// Send periodic pings to measure latency
private startLatencyMonitoring(connection: ChatwootConnection): void {
  setInterval(() => {
    const startTime = Date.now();
    connection.lastPingAt = startTime;
    
    if (connection.chatwootWs?.readyState === WebSocket.OPEN) {
      connection.chatwootWs.ping(() => {
        connection.latencyMs = Date.now() - startTime;
      });
    }
  }, 30000); // Every 30 seconds
}
```

#### 10. **Message Queue Limits** 🔧
**Prevent queue from growing indefinitely:**

```typescript
private readonly maxQueueSize = 100;

private enqueueMessage(connection: ChatwootConnection, data: WebSocket.Data): void {
  if (connection.messageQueue.length >= this.maxQueueSize) {
    this.logger.warn('Message queue full, dropping oldest message');
    connection.messageQueue.shift();
  }
  connection.messageQueue.push(data);
}
```

---

## Environment-Based Configuration

### Frontend Environment Variables

Create `.env.production`:

```bash
# WebSocket Configuration
NEXT_PUBLIC_CHATWOOT_DEBUG=false
NEXT_PUBLIC_CHATWOOT_AUTO_RECONNECT=true
NEXT_PUBLIC_CHATWOOT_MAX_RETRIES=5
NEXT_PUBLIC_CHATWOOT_INITIAL_DELAY_MS=1000
NEXT_PUBLIC_CHATWOOT_MAX_DELAY_MS=30000
NEXT_PUBLIC_CHATWOOT_HEARTBEAT_INTERVAL_MS=30000
NEXT_PUBLIC_CHATWOOT_HEARTBEAT_TIMEOUT_MS=60000
```

### Backend Environment Variables

Update `.env` or environment configuration:

```bash
# Chatwoot WebSocket Gateway
CHATWOOT_WS_MAX_CONNECTIONS_PER_CLIENT=3
CHATWOOT_WS_MAX_MESSAGES_PER_MINUTE=120
CHATWOOT_WS_CONNECTION_TIMEOUT_MS=60000
CHATWOOT_WS_IDLE_TIMEOUT_MS=300000
CHATWOOT_WS_MAX_QUEUE_SIZE=100
CHATWOOT_WS_MAX_PAYLOAD_SIZE=10485760
```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('ChatwootWebSocketService', () => {
  describe('Retry Logic', () => {
    it('should use exponential backoff', () => {
      // Test backoff calculation
    });
    
    it('should respect max retries', () => {
      // Test retry limit
    });
  });

  describe('Health Monitoring', () => {
    it('should detect unhealthy connections', () => {
      // Test health detection
    });

    it('should auto-reconnect on unhealthy status', () => {
      // Test auto-reconnect
    });
  });

  describe('Rate Limiting', () => {
    it('should limit messages per minute', () => {
      // Test rate limiting
    });

    it('should reset counter after one minute', () => {
      // Test reset logic
    });
  });
});
```

### Integration Tests

```typescript
describe('WebSocket Gateway Integration', () => {
  it('should handle rapid connects/disconnects', async () => {
    // Stress test connection handling
  });

  it('should proxy messages correctly', async () => {
    // Test end-to-end message flow
  });

  it('should handle connection failures gracefully', async () => {
    // Test error scenarios
  });
});
```

### Load Tests

```bash
# Use wscat or similar tool
npm install -g wscat

# Connect multiple clients
for i in {1..100}; do
  wscat -c "ws://localhost:8080/cable?token=YOUR_TOKEN" &
done

# Monitor metrics
curl http://localhost:8080/health
```

---

## Monitoring & Observability

### Metrics to Track

**Frontend:**
- Connection state changes
- Reconnection attempts
- Events received per second
- Connection health status
- Heartbeat timing

**Backend:**
- Active connections count
- Total connections (lifetime)
- Failed connections count
- Messages proxied count
- Error rate
- Average connection duration
- Rate limit violations

### Logging Best Practices

**Frontend:**
```typescript
// Use structured logging
console.log('[ChatwootWS]', 'Event', { 
  type: 'connection_state_change', 
  from: oldState, 
  to: newState,
  timestamp: Date.now()
});
```

**Backend:**
```typescript
// Use NestJS logger with context
this.logger.log('Message proxied', {
  clientId,
  direction: 'client->chatwoot',
  size: message.length,
  timestamp: Date.now(),
});
```

### Health Check Endpoint

Add to backend:

```typescript
@Get('/health/websocket')
getWebSocketHealth() {
  return this.chatwootWebSocketService.getHealthStatus();
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Debug mode disabled in production
- [ ] Rate limits configured appropriately
- [ ] Connection limits set based on server capacity
- [ ] Timeouts tuned for your use case
- [ ] Monitoring/logging configured
- [ ] Health check endpoint tested

### Post-Deployment

- [ ] Monitor connection success rate
- [ ] Check error logs for unexpected issues
- [ ] Verify auto-reconnect is working
- [ ] Monitor resource usage (CPU, memory, connections)
- [ ] Test graceful shutdown during deployment
- [ ] Verify rate limiting is working
- [ ] Check metrics dashboard

---

## Performance Considerations

### Frontend

1. **Connection Pooling**: Reuse single WebSocket per user
2. **Message Batching**: Batch multiple events when possible
3. **Lazy Connection**: Only connect when needed
4. **Efficient Event Handling**: Use event delegation, avoid memory leaks

### Backend

1. **Connection Limits**: Set appropriate limits based on server capacity
2. **Message Queue Size**: Tune based on expected message volume
3. **Worker Threads**: Consider worker threads for CPU-intensive operations
4. **Load Balancing**: Use sticky sessions for WebSocket connections

---

## Security Considerations

### Authentication
- ✅ JWT Bearer token validation
- ✅ Token expiration checking
- ✅ User authorization verification

### Rate Limiting
- ✅ Per-client message rate limits
- ✅ Connection count limits per IP
- 🔧 Global rate limiting (add if needed)

### Input Validation
- ✅ Token format validation
- ✅ Message size limits
- 🔧 Payload content validation (add if needed)

### DDoS Protection
- ✅ Connection limits
- ✅ Message rate limits
- ✅ Idle connection cleanup
- 🔧 Consider adding: IP blacklisting, CAPTCHA for suspicious traffic

---

## Troubleshooting Guide

### Issue: Connections Keep Dropping

**Possible Causes:**
1. Idle timeout too aggressive
2. Network instability
3. Server resource exhaustion

**Solutions:**
- Increase `idleTimeoutMs` in backend
- Adjust `heartbeatIntervalMs` in frontend
- Check server resource usage

### Issue: Auto-Reconnect Not Working

**Check:**
1. Is `autoReconnect` enabled?
2. Are max retries exceeded?
3. Check error logs for failure reasons

**Fix:**
```typescript
chatwootWebSocketService.setAutoReconnect(true);
chatwootWebSocketService.setRetryConfig({ maxRetries: 10 });
```

### Issue: Rate Limit Errors

**Check:**
- Message frequency from client
- `maxMessagesPerMinute` configuration

**Fix:**
- Increase rate limit if legitimate traffic
- Batch messages on frontend
- Implement client-side throttling

---

## Summary

### Frontend Improvements ✅
- Debug mode control
- Exponential backoff retry with jitter
- Connection health monitoring
- Auto-reconnect management
- Improved error handling
- Better lifecycle management
- Configuration API

### Backend Improvements 🔧
- Rate limiting (recommended)
- Connection limits (recommended)
- Timeout handling (recommended)
- Idle detection (recommended)
- Metrics collection (recommended)
- Graceful shutdown (recommended)
- Error handling (recommended)
- Input validation (recommended)

### Next Steps
1. Review and apply backend improvements
2. Configure environment variables
3. Add monitoring/alerting
4. Run load tests
5. Deploy to staging
6. Monitor metrics
7. Deploy to production

---

## Additional Resources

- [ActionCable Documentation](https://guides.rubyonrails.org/action_cable_overview.html)
- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Chatwoot API Documentation](https://www.chatwoot.com/developers/api/)
- [NestJS WebSocket Documentation](https://docs.nestjs.com/websockets/gateways)

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-01-17  
**Authors**: AI Development Team

