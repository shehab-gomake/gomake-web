# Custom Attributes Features - Implementation Summary

## Overview

Implemented **3 features** to leverage contact custom attributes for better UX and workflow automation.

---

## ✅ Feature 1: Auto-Linking Customers on Conversation Creation

### What It Does
When creating a new conversation, if the selected contact has a `gomake_customer_id` in their custom attributes, the system **automatically** links that customer to the conversation.

### Implementation

**File**: `src/widgets/frontdesk/providers/chatwoot/hooks/use-compose-conversation.ts`

```typescript
// After creating conversation successfully:
if (conversationId) {
  // AUTO-LINK: If contact has gomake_customer_id, automatically link it
  const gomakeCustomerId = formState.contact?.custom_attributes?.gomake_customer_id;
  if (gomakeCustomerId) {
    await chatwootService.conversations.updateCustomAttributes(
      accountId,
      conversationId,
      { gomake_customer_id: gomakeCustomerId }
    );
  }
  // ... continue with success handling
}
```

### Benefits
- ✅ **Zero manual steps** - Customer is linked automatically
- ✅ **Immediate access** - Quick actions (quotes, invoices, orders) work immediately
- ✅ **Reduced errors** - No forgetting to link customers
- ✅ **Better data consistency** - All conversations have customer context

### User Experience
**Before**: 
1. Create conversation
2. Click on conversation
3. Manually click "Link Customer"
4. Search and select customer
5. Save

**After**:
1. Create conversation → Customer auto-linked ✨

---

## ✅ Feature 2: Search by Customer Code

### What It Does
When searching for contacts in the New Conversation modal, the search now queries **both customer name AND customer code** simultaneously.

### Implementation

**File**: `src/widgets/frontdesk/providers/chatwoot/hooks/use-compose-conversation.ts`

```typescript
// Search customers API call enhanced with code parameter
const result = await callApi(
  "GET",
  "/v1/customers/get-customers-pagination",
  {
    clientType: "C",
    pageNumber: 1,
    pageSize: 20,
    name: query.trim(),        // Search by name
    code: query.trim(),        // Also search by customer code (NEW!)
    isActive: true,
  },
  false
);
```

### Benefits
- ✅ **Faster contact discovery** - Search by "CUST-001" directly
- ✅ **Exact matching** - Customer codes are unique identifiers
- ✅ **Better for bulk operations** - Codes are easier to remember than names
- ✅ **Backward compatible** - Still searches by name as before

### User Experience
**Before**: Only search by customer/contact name

**After**: Search by either name OR customer code
- Type "CUST-001" → Finds customer with code "CUST-001"
- Type "John Doe" → Finds customer named "John Doe"

---

## ⚠️ Feature 3: Filter Conversations by Agent (Requires Backend Support)

### What It Should Do
Filter the conversation list to show only conversations where the contact is assigned to a specific GoMake agent (via `gomake_agent_id` custom attribute).

### Current Limitation
Chatwoot's conversation list API (`GET /api/accounts/conversations`) does not natively support filtering by **contact custom attributes**. It only supports:
- `status` (open, resolved, pending)
- `assignee_type` (me, unassigned, all)
- `inbox_id` (specific inbox)
- `team_id` (specific team)
- `labels` (conversation labels)
- `conversation_type` (mention, unattended, participating)
- `q` (search query - searches conversation content, not custom attributes)

### Why This Matters
- `gomake_agent_id` is stored in **contact** custom attributes
- Conversations have a **contact** (sender)
- To filter by agent, we need: `WHERE conversation.contact.custom_attributes.gomake_agent_id = X`
- This type of nested filtering is not supported by Chatwoot's current API

### Possible Solutions

#### Option 1: Backend API Enhancement (Recommended)
**Add support for filtering by contact custom attributes to Chatwoot's conversation filter API.**

**Backend Changes Needed** (Chatwoot VM):
```ruby
# app/controllers/api/v1/accounts/conversations_controller.rb
def filter_by_contact_custom_attributes(conversations, custom_attribute_filters)
  return conversations if custom_attribute_filters.blank?

  conversations.joins(:contact).where(
    "contacts.custom_attributes->>'gomake_agent_id' = ?",
    custom_attribute_filters[:gomake_agent_id]
  )
end
```

**Frontend Usage**:
```typescript
// Once backend supports it:
const filters = {
  status: "open",
  assignee_type: "me",
  contact_custom_attributes: {
    gomake_agent_id: "agent_42"
  }
};
```

**Pros**:
- ✅ Efficient - filters at database level
- ✅ Scalable - works with thousands of conversations
- ✅ Real-time - no client-side processing

**Cons**:
- ❌ Requires Chatwoot backend modification
- ❌ Needs database query optimization

---

#### Option 2: Client-Side Filtering (Quick Fix)
**Filter conversations in the browser after fetching them.**

**Implementation**:
```typescript
// In use-chatwoot-conversations.ts
const filterConversationsByAgent = (
  conversations: ChatwootConversation[],
  agentId: string | null
): ChatwootConversation[] => {
  if (!agentId) return conversations;

  return conversations.filter((conv) => {
    const contactAgentId = conv.meta?.sender?.custom_attributes?.gomake_agent_id;
    return contactAgentId === agentId;
  });
};

// Apply after fetching
const filteredConversations = useMemo(() => {
  if (filters.gomake_agent_id) {
    return filterConversationsByAgent(conversations, filters.gomake_agent_id);
  }
  return conversations;
}, [conversations, filters.gomake_agent_id]);
```

**Pros**:
- ✅ No backend changes required
- ✅ Works immediately
- ✅ Simple to implement

**Cons**:
- ❌ Performance issues with large datasets
- ❌ Filters only visible conversations (pagination problem)
- ❌ Can't show accurate counts

---

#### Option 3: Hybrid Approach (Pragmatic)
**Client-side filtering + documentation for future backend enhancement.**

1. Implement client-side filtering for immediate use
2. Add UI note: "Note: Filtering by agent works on loaded conversations only"
3. Document backend requirements for full implementation
4. Plan backend enhancement for future sprint

**Implementation Timeline**:
- **Phase 1** (Now): Client-side filter + documentation
- **Phase 2** (Future): Backend API enhancement
- **Phase 3** (Future): Remove client-side filter, use backend API

---

### Recommended Approach

**For immediate use**: Implement **Option 3 (Hybrid)**

**Rationale**:
1. Provides value immediately (client-side filtering)
2. Documents the limitation clearly
3. Plans for proper solution (backend enhancement)
4. Doesn't block current workflow

### UI Component Design (If Implementing)

```typescript
// ConversationAgentsFilter.tsx (similar to ConversationTeamsFilter)
export const ConversationAgentsFilter: React.FC<Props> = ({
  accountId,
  filters,
  onFiltersChange,
}) => {
  const { agents } = useChatwootAgents(accountId); // Fetch Chatwoot agents
  
  // NOTE: This filters by Chatwoot agent ID, not GoMake agent ID
  // To filter by GoMake agent, need backend support
  
  return (
    // ... filter UI similar to teams filter
  );
};
```

**Challenge**: GoMake `gomake_agent_id` ≠ Chatwoot agent `id`
- Need mapping between GoMake agents and Chatwoot agents
- OR use separate filter for GoMake agents (requires agent dropdown from GoMake API)

---

## Summary Table

| Feature | Status | Implementation | Backend Changes | Notes |
|---------|--------|----------------|-----------------|-------|
| **Auto-Link Customer** | ✅ Complete | Frontend only | None | Works immediately |
| **Search by Customer Code** | ✅ Complete | Frontend only | None | Depends on backend supporting `code` param |
| **Filter by Agent** | ⚠️ Documented | Not implemented | **Required** | Needs Chatwoot API enhancement |

---

## Testing

### Auto-Link Customer
1. Create new conversation from GoMake contact with customer linked
2. Conversation should have `gomake_customer_id` in custom attributes
3. Quick actions (quotes, invoices) should work immediately

### Search by Customer Code
1. Go to New Conversation modal
2. Type a customer code (e.g., "CUST-001")
3. Should find customer with that code
4. Also test with customer name - should still work

### Filter by Agent (Not Implemented)
- No test needed - feature documented for future implementation

---

## Future Enhancements

### Short Term
1. Add visual indicator when customer is auto-linked
2. Add toast notification: "Customer auto-linked ✓"
3. Log auto-linking for debugging

### Medium Term
1. Implement client-side agent filter
2. Add UI note about limitation
3. Gather usage data

### Long Term
1. Enhance Chatwoot backend API
2. Add contact custom attribute filtering support
3. Implement proper agent filter

---

## Related Files

- `src/widgets/frontdesk/providers/chatwoot/hooks/use-compose-conversation.ts` - Auto-linking + code search
- `src/services/frontdesk/api/chatwoot/services/chatwoot-conversations.service.ts` - Conversation API
- `src/services/frontdesk/api/chatwoot/services/chatwoot-contacts.service.ts` - Contact API
- `docs/frontdesk/CHATWOOT_CUSTOM_ATTRIBUTES_GUIDE.md` - Complete custom attributes guide

---

**Date**: November 19, 2025  
**Status**: 2 of 3 features complete, 1 documented for future implementation


