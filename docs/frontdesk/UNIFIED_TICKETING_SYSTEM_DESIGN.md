# Unified Ticketing System: Building on Existing Architecture

## Executive Summary

A **Unified Ticketing System** that extends your existing `Conversation` and `ProviderChannel` models to support customer service ticketing. Instead of creating new models, we leverage your current messaging infrastructure where `Conversation` becomes the ticket container and `ProviderChannel` handles multi-channel communication (Email, WhatsApp, SMS).

**Core Principle**: Transform existing Conversations into Tickets by adding ticketing-specific fields and workflows with proper separation of concerns.

## Current Architecture Analysis

Your system already has:

- **`Conversation`**: Container for messages between users
- **`ConversationMember`**: Tracks participants
- **`ProviderChannel`**: Handles EMAIL, WHATSAPP, SMS, PUSH channels
- **`Message`**: Stores actual message content
- **`Provider`**: OAuth/API integrations (Google, Outlook, etc.)

We'll extend these models rather than replacing them.

## Data Model Extensions

### Create Ticket Extension Table (RECOMMENDED)

Keep `Conversation` clean and create a separate ticket details table for better separation of concerns, performance, and maintainability:

```prisma
model Ticket {
  id              String         @id @default(uuid())
  conversationId  String         @unique
  printHouseId    String
  ticketNumber    Int
  status          TicketStatus   @default(OPEN)
  priority        TicketPriority @default(MEDIUM)

  // Assignment & Management
  assigneeId      String?
  assignee        User?          @relation("AssignedTickets", fields: [assigneeId], references: [id])
  managerId       String?        // Manager who assigns tickets
  manager         User?          @relation("ManagedTickets", fields: [managerId], references: [id])
  assignedBy      String?        // Who assigned this ticket
  assignedAt      DateTime?      // When it was assigned

  // Customer info
  customerEmail   String?
  customerPhone   String?
  customerName    String?

  // Category linking
  categoryId      String?        // Foreign key to TicketCategory
  category        TicketCategory? @relation(fields: [categoryId], references: [id])
  tags            String[]

  // Timestamps
  firstResponseAt DateTime?
  resolvedAt      DateTime?
  closedAt        DateTime?
  reopenedAt      DateTime?      // Track if ticket was reopened
  reopenCount     Int            @default(0)

  // Relations
  conversation    Conversation   @relation(fields: [conversationId], references: [id])
  organization    Organization   @relation(fields: [printHouseId], references: [id])
  history         TicketHistory[]
  sla             TicketSLA?

  @@unique([printHouseId, ticketNumber])
  @@index([status, priority])
  @@index([assigneeId])
  @@index([managerId])
  @@map("tickets")
}

// Ticket history for complete audit trail
model TicketHistory {
  id              String   @id @default(uuid())
  ticketId        String
  userId          String   // ID of user who performed the action (or 'system')

  // Action types: "created", "assigned", "status_changed", "priority_changed",
  // "category_changed", "closed", "reopened", "merged"
  action          String

  // JSON fields storing before/after state
  // Examples:
  // Status change: oldValue: {status: "OPEN"}, newValue: {status: "IN_PROGRESS"}
  // Assignment: oldValue: null, newValue: {assigneeId: "123", assigneeName: "John"}
  // Priority: oldValue: {priority: "MEDIUM"}, newValue: {priority: "URGENT"}
  oldValue        Json?    // Previous state (null for new tickets)
  newValue        Json?    // New state after change

  comment         String?  // Optional human-readable description
  createdAt       DateTime @default(now())

  // Relations
  ticket          Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  user            User     @relation(fields: [userId], references: [id])

  @@index([ticketId, createdAt])
  @@map("ticket_history")
}

// Add SLA tracking
model TicketSLA {
  id                String   @id @default(uuid())
  ticketId          String   @unique
  categoryId        String?
  firstResponseDue  DateTime
  resolutionDue     DateTime
  firstResponseAt   DateTime?
  resolvedAt        DateTime?
  breached          Boolean  @default(false)
  breachedAt        DateTime?

  // Relations
  ticket            Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  category          TicketCategory? @relation(fields: [categoryId], references: [id])

  @@map("ticket_sla")
}

// Add ticket categories with SLA rules
model TicketCategory {
  id              String   @id @default(uuid())
  printHouseId    String
  name            String   // "billing", "technical", "shipping", "general"
  description     String?
  slaHours        Int      // Response time SLA in hours
  resolutionHours Int      // Resolution time SLA in hours
  autoAssignTo    String?  // Default assignee/manager for this category
  priority        TicketPriority @default(MEDIUM)
  isActive        Boolean  @default(true)

  // Relations
  organization    Organization @relation(fields: [printHouseId], references: [id])
  tickets         TicketSLA[]

  @@unique([printHouseId, name])
  @@map("ticket_categories")
}

// Update ConversationType enum to include TICKET
enum ConversationType {
  DM
  GROUP_DM
  TICKET
}

// Add ticket-specific enums
enum TicketStatus {
  OPEN
  PENDING
  IN_PROGRESS
  RESOLVED
  CLOSED
  REOPENED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## Data Model Relationships Explained

### Key Relationships:

1. **Ticket ↔ Conversation (1:1)**
   - Every ticket has exactly one conversation
   - Conversation stores the messages
   - Ticket stores the customer service metadata

2. **Ticket → TicketCategory (Many:1)**
   - Each ticket can have one category
   - Category defines SLA rules and default priority
   - Categories are reusable across tickets

3. **Ticket → TicketHistory (1:Many)**
   - Every change to a ticket creates a history entry
   - Tracks who made changes and when
   - Stores before/after values in JSON

4. **Ticket → User (Assignments)**
   - `assigneeId`: The agent working on the ticket
   - `managerId`: The manager overseeing the ticket
   - `assignedBy`: Who assigned the ticket

5. **Message Storage**
   - Initial inbound message creates the ticket
   - All messages stored in Conversation's messages
   - Messages linked via `conversationId`

## Multi-Channel Ticket Flow

### How It Works With Your Current Architecture

1. **Customer sends email to support@company.com**
   - Creates/updates `ProviderChannel` (type: EMAIL)
   - Creates `Conversation` (type: TICKET)
   - Links conversation to provider channel
   - Stores message in existing `Message` table

2. **Same customer sends WhatsApp message**
   - **If RELATED to existing ticket**: Links to same conversation
   - **If NEW ISSUE**: Creates separate ticket/conversation
   - Both tickets track same customer info

3. **Agent replies**
   - System checks last inbound message's `ProviderChannel`
   - Sends reply through same channel
   - Uses existing queue system for delivery

### Handling Multiple Tickets Per Customer

**The Problem**: A customer might have:

- Issue #1: "My invoice is wrong" (Ticket #1001)
- Issue #2: "I need a quote for new order" (Ticket #1002)
- Issue #3: "Where is my shipment?" (Ticket #1003)

**The Solution**: Priority-based ticket routing:

#### Routing Logic (in order of priority):

1. **Thread Continuity (HIGHEST PRIORITY)**
   - Same email thread ID = Same ticket
   - Same WhatsApp chat ID = Same ticket
   - **IMPORTANT**: If ticket is CLOSED:
     - No new messages are accepted
     - Only managers can reopen closed tickets
   - If ticket is RESOLVED, it can still receive messages

2. **Recent Activity**
   - Customer has 1 open ticket + last message < 48 hours ago = Same ticket
   - Multiple open tickets or old activity = New ticket

3. **Manual Override**
   - Agents can manually merge tickets if system got it wrong
   - Merge preserves all message history in target ticket

### Key Insight: One Conversation, Multiple ProviderChannels

```typescript
// Your current model supports this already!
conversation.providerChannels = [
  { type: 'EMAIL', identifier: 'customer@gmail.com' },
  { type: 'WHATSAPP', identifier: '+1234567890' },
  { type: 'SMS', identifier: '+1234567890' },
];
```

## Implementation Services

### 1. Ticket Service (Extends ConversationService)

```typescript
@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private providerChannelService: ProviderChannelService,
  ) {}

  async createTicketFromInboundMessage(
    message: InboundMessage,
    channel: ChannelType,
    identifier: string, // email or phone
  ): Promise<Ticket> {
    // Step 1: Check if message belongs to existing ticket
    const relatedTicket = await this.findRelatedTicket(
      identifier,
      message.content,
      message.threadId,
      message.subject,
    );

    if (relatedTicket) {
      // Don't create new ticket, add message to existing conversation
      return relatedTicket;
    }

    // Step 2: Create new conversation for the ticket
    const conversation = await this.prisma.conversation.create({
      data: {
        printHouseId: message.organizationId,
        type: 'TICKET',
        normalizedKey: `ticket-${Date.now()}`, // Temporary, will update
        participantCount: 2,
        name: message.subject || 'New Ticket',
      },
    });

    // Step 3: Create the ticket with details
    const ticketNumber = await this.getNextTicketNumber(message.organizationId);
    const ticket = await this.prisma.ticket.create({
      data: {
        conversationId: conversation.id,
        printHouseId: message.organizationId,
        ticketNumber,
        status: 'OPEN',
        priority: 'MEDIUM',
        customerEmail: channel === 'EMAIL' ? identifier : undefined,
        customerPhone:
          channel === 'WHATSAPP' || channel === 'SMS' ? identifier : undefined,
        customerName: message.fromName,
      },
    });

    // Update conversation with proper ticket number
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        normalizedKey: `ticket-${ticketNumber}`,
        name: message.subject || `Ticket #${ticketNumber}`,
      },
    });
  }

    // Step 4: Find or create provider channel
    let providerChannel = await this.providerChannelService.findByIdentifier(
      message.organizationId,
      identifier,
    );

    if (!providerChannel) {
      providerChannel = await this.providerChannelService.create({
        printHouseId: message.organizationId,
        type: channel,
        identifier,
        name: `${channel} - ${identifier}`,
      });
    }

    // Step 5: Link provider channel to conversation
    await this.linkProviderChannelToTicket(conversation.id, providerChannel.id);

    // Step 6: Store the initial message that created the ticket
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        providerChannelId: providerChannel.id,
        content: message.content,
        subject: message.subject,
        direction: 'INBOUND',
        metadata: {
          ...message.metadata,
          isTicketCreationMessage: true,
          originalFrom: identifier,
        },
      },
    });

    // Step 7: Create history entry for ticket creation
    await this.prisma.ticketHistory.create({
      data: {
        ticketId: ticket.id,
        userId: 'system',
        action: 'created',
        newValue: {
          source: channel,
          from: identifier,
          subject: message.subject,
          ticketNumber,
        },
        comment: `Ticket created from ${channel} message`,
      },
    });

    return ticket;
  }

  async findRelatedTicket(
    identifier: string,
    messageContent: string,
    threadId?: string, // Email thread ID or WhatsApp chat ID
    subject?: string,
  ): Promise<Conversation | null> {
    // PRIORITY 1: Check thread/conversation continuity
    if (threadId) {
      // Find ticket with same thread ID
      const threadTicket = await this.prisma.ticket.findFirst({
        where: {
          conversation: {
            type: 'TICKET',
            messages: {
              some: {
                metadata: {
                  path: '$.threadId',
                  equals: threadId,
                },
              },
            },
          },
        },
        include: {
          conversation: {
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

      if (threadTicket) {
        // Check if ticket is closed
        if (threadTicket.status === 'CLOSED') {
          // Send auto-response about closed ticket
          await this.sendAutoResponse(
            identifier,
            `Ticket #${threadTicket.ticketNumber} is closed. Please create a new ticket for new issues.`,
            threadId,
          );
          return null; // Don't accept messages for closed tickets
        }

        // If resolved, can still receive messages but may trigger reopening
        if (threadTicket.status === 'RESOLVED') {
          // Automatically reopen the ticket when customer responds
          await this.reopenTicket(threadTicket.id);
        }

        return threadTicket.conversation; // Continue with existing ticket
      }
    }

    // PRIORITY 2: Check for explicit ticket reference
    const ticketMatch = messageContent.match(/#(\d+)/);
    if (ticketMatch) {
      const ticketNumber = parseInt(ticketMatch[1]);
      const referencedTicket = await this.prisma.conversation.findFirst({
        where: {
          type: 'TICKET',
          ticketNumber: ticketNumber,
          ticketStatus: { in: ['OPEN', 'PENDING'] },
        },
      });

      if (referencedTicket) {
        return referencedTicket;
      }
    }

    // PRIORITY 3: Find recent open tickets for this customer
    const customerTickets = await this.prisma.conversation.findMany({
      where: {
        type: 'TICKET',
        ticketStatus: { in: ['OPEN', 'PENDING'] },
        OR: [{ customerEmail: identifier }, { customerPhone: identifier }],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // If only one open ticket and recent activity, assume it's related
    if (customerTickets.length === 1) {
      const ticket = customerTickets[0];
      const lastMessage = ticket.messages[0];
      const hoursSinceLastMessage =
        (Date.now() - lastMessage?.createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastMessage < 48) {
        return ticket; // Recent activity, probably same issue
      }
    }

    // No clear match - create new ticket
    return null;
  }

  async mergeTickets(
    sourceTicketId: string,
    targetTicketId: string,
  ): Promise<void> {
    // Move all messages from source to target
    await this.prisma.message.updateMany({
      where: { conversationId: sourceTicketId },
      data: { conversationId: targetTicketId },
    });

    // Update source ticket status
    await this.prisma.conversation.update({
      where: { id: sourceTicketId },
      data: {
        ticketStatus: 'CLOSED',
        metadata: {
          mergedInto: targetTicketId,
          mergedAt: new Date(),
        },
      },
    });

    // Add event to target ticket
    await this.prisma.message.create({
      data: {
        conversationId: targetTicketId,
        content: `Ticket merged from #${sourceTicketId}`,
        direction: 'INTERNAL',
        metadata: { systemMessage: true },
      },
    });
  }

  // Manager assigns ticket to agent
  async assignTicket(
    ticketId: string,
    assigneeId: string,
    managerId: string,
  ): Promise<void> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { assignee: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check if user is a manager
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager || (manager.role !== 'MANAGER' && manager.role !== 'ADMIN')) {
      throw new ForbiddenException('Only managers can assign tickets');
    }

    // Update ticket assignment
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId,
        managerId,
        assignedBy: managerId,
        assignedAt: new Date(),
        status: 'IN_PROGRESS',
      },
    });

    // Create history entry
    await this.prisma.ticketHistory.create({
      data: {
        ticketId,
        userId: managerId,
        action: 'assigned',
        oldValue: ticket.assignee
          ? { assigneeId: ticket.assigneeId, name: ticket.assignee.name }
          : null,
        newValue: { assigneeId, assignedBy: managerId },
        comment: `Ticket assigned to agent ${assigneeId}`,
      },
    });

    // Send notification to assigned agent
    await this.notificationService.notifyAgentAssignment(assigneeId, ticketId);
  }

  // Reopen a closed ticket (manager only)
  async reopenTicket(
    ticketId: string,
    userId?: string,
    isAutoReopen: boolean = false,
  ): Promise<void> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // If not auto-reopen, check permissions
    if (!isAutoReopen && userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
        throw new ForbiddenException(
          'Only managers can manually reopen closed tickets',
        );
      }
    }

    // Update ticket status
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'REOPENED',
        reopenedAt: new Date(),
        reopenCount: { increment: 1 },
      },
    });

    // Create history entry
    await this.prisma.ticketHistory.create({
      data: {
        ticketId,
        userId: userId || 'system',
        action: 'reopened',
        oldValue: { status: ticket.status },
        newValue: { status: 'REOPENED' },
        comment: isAutoReopen
          ? 'Auto-reopened due to customer response'
          : 'Manually reopened by manager',
      },
    });
  }

  async sendReply(ticketId: string, content: string, userId: string) {
    // Get ticket with channels
    const ticket = await this.prisma.conversation.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          where: { direction: 'INBOUND' },
        },
      },
    });

    // Use the channel from last inbound message
    const lastInboundChannel = ticket.messages[0]?.providerChannelId;

    // Send through existing provider channel system
    await this.queueService.add('send-message', {
      providerChannelId: lastInboundChannel,
      content,
      conversationId: ticketId,
    });

    // Update ticket status
    await this.prisma.conversation.update({
      where: { id: ticketId },
      data: { ticketStatus: 'PENDING' },
    });
  }
}
```

### 2. Inbox Monitoring (Using Existing Providers)

```typescript
@Injectable()
export class InboxMonitorService {
  constructor(
    private providerService: ProviderService,
    private ticketService: TicketService,
  ) {}

  async pollInboxes() {
    // Get all email providers
    const emailProviders = await this.providerService.findByType('EMAIL');

    for (const provider of emailProviders) {
      // Use existing OAuth tokens
      const messages = await this.fetchNewMessages(provider);

      for (const message of messages) {
        await this.ticketService.createTicketFromInboundMessage(
          message,
          'EMAIL',
          message.from,
        );
      }
    }
  }
}
```

### 3. Multi-Channel Contact Resolution

```typescript
@Injectable()
export class ContactResolver {
  async resolveCustomer(identifier: string, ticket: Conversation) {
    // Check if this identifier belongs to existing ticket's customer
    const existingTicket = await this.prisma.conversation.findFirst({
      where: {
        type: 'TICKET',
        id: { not: ticket.id },
        OR: [{ customerEmail: identifier }, { customerPhone: identifier }],
      },
    });

    if (existingTicket) {
      // Merge customer info
      await this.prisma.conversation.update({
        where: { id: ticket.id },
        data: {
          customerEmail: existingTicket.customerEmail || ticket.customerEmail,
          customerPhone: existingTicket.customerPhone || ticket.customerPhone,
          customerName: existingTicket.customerName || ticket.customerName,
        },
      });
    }
  }
}
```

## API Endpoints

### Ticket Management (Extends Conversation Controller)

```typescript
@Controller('tickets')
export class TicketController {
  @Get()
  async listTickets(@Query() filters: TicketFilters) {
    return this.conversationService.findAll({
      where: {
        type: 'TICKET',
        ticketStatus: filters.status,
        assigneeId: filters.assigneeId,
      },
      include: {
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
        providerChannels: true,
      },
    });
  }

  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('MANAGER', 'ADMIN')
  async assignTicket(
    @Param('id') id: string,
    @Body() dto: { assigneeId: string },
    @CurrentUser() user: User,
  ) {
    return this.ticketService.assignTicket(id, dto.assigneeId, user.id);
  }

  @Post(':id/reopen')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('MANAGER', 'ADMIN')
  async reopenTicket(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ticketService.reopenTicket(id, user.id, false);
  }

  @Post(':id/reply')
  async replyToTicket(
    @Param('id') id: string,
    @Body() dto: { content: string },
  ) {
    return this.ticketService.sendReply(id, dto.content, this.userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: { status: TicketStatus },
  ) {
    return this.conversationService.update(id, {
      ticketStatus: dto.status,
      resolvedAt: dto.status === 'RESOLVED' ? new Date() : undefined,
    });
  }

  @Post(':id/merge')
  async mergeTickets(
    @Param('id') sourceId: string,
    @Body() dto: { targetTicketId: string },
  ) {
    // Merge source ticket into target
    await this.ticketService.mergeTickets(sourceId, dto.targetTicketId);

    return {
      success: true,
      message: `Ticket ${sourceId} merged into ${dto.targetTicketId}`,
    };
  }

  @Get('/customer/:identifier')
  async getCustomerTickets(@Param('identifier') identifier: string) {
    // Get all tickets for a customer (by email or phone)
    return this.conversationService.findAll({
      where: {
        type: 'TICKET',
        OR: [{ customerEmail: identifier }, { customerPhone: identifier }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

## Manager Dashboard & Workflows

### Manager Capabilities

Managers have enhanced permissions for ticket management:

1. **Ticket Assignment**
   - View unassigned tickets queue
   - Assign tickets to agents
   - Reassign tickets between agents
   - Set ticket priority and categories

2. **Ticket Oversight**
   - View all tickets across the team
   - Monitor SLA compliance
   - Reopen closed tickets when needed
   - Escalate tickets to higher priority

3. **Team Management**
   - View agent workload and performance
   - Monitor response times

### Closed Ticket Behavior

**When a ticket is CLOSED:**

- No new messages are accepted from customers
- Only managers/admins can manually reopen
- All message history is preserved but read-only

**When a ticket is RESOLVED:**

- Customer can still send messages
- New customer message auto-reopens the ticket
- Ticket status changes to REOPENED
- Agent gets notified of reopening

### Agent Assignment Workflow

```typescript
// Manager dashboard endpoint
@Get('/dashboard/unassigned')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('MANAGER', 'ADMIN')
async getUnassignedTickets(@Query() filters: { priority?: string, category?: string }) {
  return this.ticketService.findAll({
    where: {
      assigneeId: null,
      status: { in: ['OPEN', 'REOPENED'] },
      priority: filters.priority,
      category: filters.category
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' } // Oldest first
    ]
  });
}

// Get agent workload
@Get('/agents/workload')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('MANAGER', 'ADMIN')
async getAgentWorkload() {
  return this.ticketService.getAgentWorkloadStats();
}

// Bulk assign tickets
@Post('/bulk-assign')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('MANAGER', 'ADMIN')
async bulkAssignTickets(
  @Body() dto: { ticketIds: string[], assigneeId: string },
  @CurrentUser() manager: User
) {
  return this.ticketService.bulkAssignTickets(dto.ticketIds, dto.assigneeId, manager.id);
}
```

## Key Improvements & Optimizations

### Performance Optimizations

1. **Separate Ticket Table**: Better performance than extending Conversation
2. **Compound Indexes**: Optimized queries for ticket filtering

### Enhanced Features

1. **Manager Role**: Dedicated role for ticket assignment and management
2. **Closed Ticket Protection**: Prevents messages to closed tickets with auto-response
3. **Auto-Reopening**: Smart reopening for resolved tickets when customer responds
4. **Audit Trail**: Complete history tracking with TicketHistory showing all changes
5. **SLA Management**: Automated SLA tracking and breach alerts based on categories
6. **Message Handling**: Initial message saved on ticket creation, subsequent messages in conversation

### Inbound Message Processing (New)

```typescript
@Processor('inbound')
export class InboundProcessor {
  async processInboundEmail(job: Job<InboundEmailData>) {
    const { from, subject, body, threadId } = job.data;

    // 1. Identify customer
    const customer = await this.identifyCustomer(from);

    // 2. Find or create ticket
    const ticket = await this.ticketService.findRelatedTicket(
      from,
      body,
      threadId,
      subject,
    );

    if (!ticket) {
      // Create new ticket
      await this.ticketService.createTicketFromInboundMessage({
        from,
        subject,
        body,
        channel: 'EMAIL',
      });
    }
  }
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

- ✅ Create separate Ticket model with relations
- ✅ Add TicketHistory, TicketSLA, TicketCategory models
- ✅ Implement manager role and permissions
- ✅ Create database migrations

### Phase 2: Core Services (Week 2)

- Create TicketService with CRUD operations
- Implement ticket assignment logic
- Add closed/resolved ticket handling
- Build inbound message processor

### Phase 3: API & Integration (Week 3)

- Create ticket management endpoints
- Add manager dashboard endpoints
- Implement WebSocket events for real-time updates
- Integrate with existing queue system

## Conclusion

This enhanced design provides a production-ready ticketing system that:

1. **Maintains clean architecture** with separate Ticket model
2. **Supports manager workflow** for ticket assignment
3. **Handles closed tickets properly** with auto-response
4. **Tracks complete history** for audit and compliance
5. **Enables multi-channel support** using existing infrastructure
6. **Scales efficiently** with proper indexing and archiving

The system leverages your existing messaging infrastructure while adding enterprise-grade ticketing capabilities suitable for production use.
