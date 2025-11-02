# Chatwoot Provider Utilities

Shared utilities for the Chatwoot provider implementation.

## 📁 Files

### `api-response-extractors.ts`

Type-safe utilities for handling Chatwoot API responses.

#### Key Functions

**Type Guards:**
- `isValidConversation(value)` - Validates if object is a valid conversation
- `hasDataProperty(obj)` - Checks for nested data property
- `hasPayloadProperty(obj)` - Checks for payload property

**Extraction:**
- `extractConversation(response, fallback)` - Safely extracts conversation from various response shapes
- `tryExtractConversation(response)` - Returns Result type (success/failure)

**Merging:**
- `mergeConversationUpdate(base, updates)` - Deep merge for conversation updates
- `cloneConversation(conversation)` - Creates deep clone

**Error Handling:**
- `extractErrorMessage(error)` - Extracts human-readable error messages

#### Usage Examples

```typescript
// Basic extraction with fallback
const updated = extractConversation(apiResponse, currentConversation);
onConversationUpdate(updated);

// Result-based extraction (no fallback)
const result = tryExtractConversation(apiResponse);
if (result.success) {
  updateUI(result.data);
} else {
  showError(result.error);
}

// Safe merging
const merged = mergeConversationUpdate(conversation, {
  status: 'resolved',
  meta: { assignee: newAgent }
});

// Error handling
try {
  await chatwootService.updateConversation(...);
} catch (error) {
  const message = extractErrorMessage(error);
  showToast(message);
}
```

## 🏗️ Architecture Principles

1. **Type Safety First** - All functions use proper TypeScript guards
2. **Defensive Programming** - Validates all inputs before processing
3. **Immutability** - Never mutates original objects
4. **Single Responsibility** - Each function has one clear purpose
5. **DRY** - Eliminates duplicate response parsing across components

## 📚 Best Practices

### When to Use Each Function

| Function | Use Case |
|----------|----------|
| `extractConversation` | When you have a fallback value |
| `tryExtractConversation` | When you want explicit success/failure handling |
| `mergeConversationUpdate` | For partial updates with nested objects |
| `cloneConversation` | When you need to prevent mutations |
| `extractErrorMessage` | In all error catch blocks |

### Component Integration

```typescript
import {
  extractConversation,
  mergeConversationUpdate,
  extractErrorMessage
} from '../utils/api-response-extractors';

const handleUpdate = async (updates: Partial<ChatwootConversation>) => {
  try {
    const response = await chatwootService.updateConversation(...);
    const extracted = extractConversation(response, conversation);
    const merged = mergeConversationUpdate(conversation, extracted);
    onConversationUpdate?.(merged);
  } catch (error) {
    console.error('[handleUpdate]', extractErrorMessage(error));
  }
};
```

## 🔄 Response Shape Handling

The extractors handle multiple Chatwoot API response structures:

```typescript
// Shape 1: Nested payload
{ data: { payload: ChatwootConversation } }

// Shape 2: Direct data
{ data: ChatwootConversation }

// Shape 3: Top-level payload
{ payload: ChatwootConversation }

// Shape 4: Direct object
ChatwootConversation
```

## 🧪 Testing Guidelines

When writing tests, ensure coverage for:
- Invalid input types (null, undefined, wrong types)
- All response shape variants
- Deep merge scenarios
- Error message extraction for various error types
