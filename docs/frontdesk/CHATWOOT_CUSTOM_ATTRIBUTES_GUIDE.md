# Chatwoot Custom Attributes Guide

## Overview

Chatwoot supports **custom attributes** for storing additional metadata on contacts and conversations. We use these extensively to bridge GoMake CRM data with Chatwoot's contact system.

---

## Contact Custom Attributes (What We Store)

### Current Implementation

We store **5 GoMake-specific fields** in contact `custom_attributes`:

| Attribute Key | Type | Purpose | Example |
|--------------|------|---------|---------|
| `gomake_contact_id` | string | Contact DTO ID from GoMake CRM | `"contact_12345"` |
| `gomake_customer_id` | string | Customer/Client ID from GoMake CRM | `"customer_67890"` |
| `gomake_client_code` | string | Customer code from GoMake CRM | `"CUST-001"` |
| `gomake_agent_id` | string | Sales agent ID assigned to customer | `"agent_42"` |
| `gomake_is_main_contact` | boolean | Whether this is the primary contact for the customer | `true` |

**Location in Code**: `src/widgets/frontdesk/providers/chatwoot/hooks/use-compose-conversation.ts`

```typescript
export interface GomakeContact extends ContactDetail {
  gomake_contact_id?: string;    // Contact DTO id from GoMake
  gomake_customer_id?: string;   // Customer/Client ID
  gomake_client_code?: string;   // Customer code
  gomake_agent_id?: string;      // Sales agent ID
  gomake_is_main_contact?: boolean; // Is primary contact
}
```

---

## Why We Use Custom Attributes

### 1. **Data Synchronization**
- Chatwoot has its own contact schema (id, name, email, phone)
- GoMake CRM has different IDs and structure
- **Solution**: Store GoMake IDs in `custom_attributes` to maintain bidirectional sync

### 2. **Contact Deduplication**
- When creating a conversation from GoMake contact, we search by `gomake_contact_id` first
- Prevents duplicate Chatwoot contacts for the same GoMake contact
- **Flow**:
  1. Search by `gomake_contact_id` in custom attributes
  2. If found → use existing Chatwoot contact
  3. If not found → create new contact with GoMake IDs stored

### 3. **Customer Linking**
- Link Chatwoot conversations to GoMake customers
- Enables "Create Quote", "Create Invoice" quick actions
- Stored in `gomake_customer_id` custom attribute

### 4. **Contact Hierarchy**
- One customer can have multiple contacts
- `gomake_is_main_contact` identifies the primary contact
- Useful for prioritization and routing

---

## Where We Use Custom Attributes

### ✅ Currently Used

1. **New Conversation Modal** (`use-compose-conversation.ts`)
   - Filter contacts by `gomake_contact_id`
   - Store GoMake IDs when creating new contacts

```typescript
// Search for existing contact by gomake_contact_id
const filters = [
  {
    attribute_key: "gomake_contact_id",
    filter_operator: "equal_to",
    values: [contact.gomake_contact_id],
    attribute_model: "standard",
  },
];
const result = await chatwootService.contacts.filterContacts(accountId, { payload: filters });
```

2. **Customer Linking** (`chatwoot-conversation-detail-panel.tsx`)
   - Read `gomake_customer_id` from contact custom attributes
   - Display linked customer info
   - Enable quick actions (quotes, invoices, orders)

```typescript
const customerId = 
  (conversation?.meta?.sender?.custom_attributes?.gomake_customer_id as string | undefined) ||
  (conversation?.custom_attributes?.gomake_customer_id as string | undefined);
```

3. **Contact Identification** (`ContactSelector.tsx`)
   - Use `gomake_contact_id` as unique key
   - Compare contacts by `gomake_contact_id` first, then email/phone

```typescript
getOptionKey={(option) => {
  const contact = option as GomakeContact;
  return contact.gomake_contact_id || 
         contact.id?.toString() || 
         contact.email || 
         contact.phone_number;
}}
```

---

## Where We DON'T Use Them (But Should Consider)

### 🤔 Potential Improvements

#### 1. **Advanced Contact Search**
**Current State**: We only search by email/phone/name  
**Opportunity**: Could search by `gomake_client_code` or `gomake_customer_id`

```typescript
// Example: Search by customer code
const filters = [
  {
    attribute_key: "gomake_client_code",
    filter_operator: "equal_to",
    values: ["CUST-001"],
    attribute_model: "standard",
  },
];
```

**Use Case**: "Show me all contacts for customer CUST-001"

---

#### 2. **Agent-Based Filtering**
**Current State**: No filtering by assigned agent  
**Opportunity**: Filter conversations by `gomake_agent_id`

```typescript
// Example: Filter by agent
const filters = [
  {
    attribute_key: "gomake_agent_id",
    filter_operator: "equal_to",
    values: ["agent_42"],
    attribute_model: "standard",
  },
];
```

**Use Case**: "Show me conversations assigned to Agent John (agent_42)"

---

#### 3. **Main Contact Prioritization**
**Current State**: We store `gomake_is_main_contact` but don't use it for sorting  
**Opportunity**: Prioritize main contacts in search results

```typescript
// Example: Sort by main contact
const sortedContacts = contacts.sort((a, b) => {
  const aIsMain = a.custom_attributes?.gomake_is_main_contact;
  const bIsMain = b.custom_attributes?.gomake_is_main_contact;
  return (bIsMain ? 1 : 0) - (aIsMain ? 1 : 0);
});
```

**Use Case**: When searching for customer contacts, show main contact first

---

#### 4. **Customer Grouping**
**Current State**: Contacts are shown flat  
**Opportunity**: Group contacts by `gomake_customer_id`

**Use Case**: "Show all contacts grouped by customer"

---

#### 5. **Automatic Customer Linking**
**Current State**: Manual linking via UI  
**Opportunity**: Auto-link when creating conversation if `gomake_customer_id` is present

```typescript
// When creating conversation, if contact has gomake_customer_id:
if (contact.custom_attributes?.gomake_customer_id) {
  // Automatically update conversation custom attributes
  await chatwootService.conversations.updateCustomAttributes(
    accountId,
    conversationId,
    { gomake_customer_id: contact.custom_attributes.gomake_customer_id }
  );
}
```

**Use Case**: Reduce manual steps when creating conversations from GoMake contacts

---

## Conversation Custom Attributes (Different)

**Note**: Conversation custom attributes are **different** from contact custom attributes.

### Currently Used for Conversations

```typescript
// From: src/widgets/frontdesk/constants/chatwoot-attributes.ts
export const CHATWOOT_CUSTOM_ATTRIBUTES = {
  CUSTOMER_ID: 'gomake_customer_id',
  
  // Linked documents
  LINKED_QUOTE_ID: 'linked_quote_id',
  LINKED_INVOICE_ID: 'linked_invoice_id',
  LINKED_ORDER_ID: 'linked_order_id',
  LINKED_RECEIPT_ID: 'linked_receipt_id',
  LINKED_DELIVERY_NOTE_ID: 'linked_delivery_note_id',
  LINKED_PURCHASE_ORDER_ID: 'linked_purchase_order_id',
  LINKED_PURCHASE_INVOICE_ID: 'linked_purchase_invoice_id',
};
```

**Usage**: Store linked GoMake documents (quotes, invoices, orders) on conversations.

---

## Best Practices

### ✅ Do

1. **Always check both levels** when reading customer ID:
   ```typescript
   // Priority: contact-level > conversation-level
   const customerId = 
     conversation?.meta?.sender?.custom_attributes?.gomake_customer_id ||
     conversation?.custom_attributes?.gomake_customer_id;
   ```

2. **Store GoMake IDs when creating contacts**:
   ```typescript
   custom_attributes: {
     gomake_contact_id: contact.gomake_contact_id,
     gomake_customer_id: contact.gomake_customer_id,
     // ... other fields
   }
   ```

3. **Use filter API for custom attribute searches**:
   ```typescript
   await chatwootService.contacts.filterContacts(accountId, {
     payload: [{
       attribute_key: "gomake_contact_id",
       filter_operator: "equal_to",
       values: [contactId],
       attribute_model: "standard",
     }]
   });
   ```

### ❌ Don't

1. **Don't use Chatwoot fields for GoMake IDs**
   - ❌ Store `gomake_customer_id` in `identifier` field
   - ✅ Use `custom_attributes` instead

2. **Don't forget to sync on updates**
   - When updating contact in GoMake, update custom attributes in Chatwoot

3. **Don't rely solely on email matching**
   - Always check `gomake_contact_id` first for accuracy

---

## Summary

### What We Have ✅
- 5 custom attributes for GoMake CRM integration
- Contact deduplication by `gomake_contact_id`
- Customer linking via `gomake_customer_id`
- Stored on contact creation/update

### What We Use ✅
- Search by `gomake_contact_id` (filter API)
- Display customer linkage in UI
- Contact comparison and unique keys

### What We Could Improve 🤔
1. Search by customer code
2. Filter by assigned agent
3. Prioritize main contacts
4. Group contacts by customer
5. Auto-link customer on conversation creation

---

## Related Files

- **Types**: `src/services/frontdesk/api/chatwoot/types/contacts.types.ts`
- **Hook**: `src/widgets/frontdesk/providers/chatwoot/hooks/use-compose-conversation.ts`
- **Constants**: `src/widgets/frontdesk/constants/chatwoot-attributes.ts`
- **Service**: `src/services/frontdesk/api/chatwoot/services/chatwoot-contacts.service.ts`

---

**Date**: November 19, 2025


