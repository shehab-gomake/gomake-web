# Chatwoot Team Creation - Quick Reference

## 📋 Summary

**Endpoint:** `POST /api/v1/accounts/{account_id}/teams`  
**Service Method:** `chatwootService.teams.createTeam(accountId, payload)`

---

## 🔑 Key Points

1. **Request Format:** Payload must be wrapped in `team` key
2. **Required Field:** `name` (string, unique per account)
3. **Optional Fields:** `description`, `allow_auto_assign` (default: true)
4. **Name Normalization:** Server automatically lowercases team name
5. **Account Scoping:** Team belongs to account specified in URL path

---

## 📝 Request DTO

```typescript
interface TeamCreateUpdatePayload {
  name: string;                   // Required
  description?: string;           // Optional
  allow_auto_assign?: boolean;    // Optional (default: true)
}
```

**Request Body (sent to API):**
```json
{
  "team": {
    "name": "Support Team",
    "description": "Handles customer support",
    "allow_auto_assign": true
  }
}
```

---

## 📥 Response DTO

```typescript
interface Team {
  id: number;                     // Server-assigned
  name: string;                   // Lowercased by server
  description: string | null;
  allow_auto_assign: boolean;
  account_id: number;             // From URL path
  is_member: boolean;             // Computed (current user membership)
}
```

---

## 💻 Usage Example

```typescript
import { chatwootService } from "@/services/frontdesk";

// Simple usage
const team = await chatwootService.teams.createTeam(123, {
  name: "Support Team",
  description: "Customer support team",
  allow_auto_assign: true
});

console.log(`Created team: ${team.name} (ID: ${team.id})`);
```

---

## ⚠️ Validations

- **Name:** Required, must be unique per account (case-insensitive)
- **Name Length:** Typically max 255 characters
- **Account:** Must exist and user must have permission

---

## 🚨 Common Errors

| Error | Status | Message |
|-------|--------|---------|
| Missing name | 400 | "Name can't be blank" |
| Duplicate name | 422 | "Name has already been taken" |
| Unauthorized | 401 | "Unauthorized" |
| Account not found | 404 | "Account not found" |

---

## 📚 Full Documentation

See [TEAM_CREATION_GUIDE.md](./TEAM_CREATION_GUIDE.md) for complete details, examples, and error handling patterns.

