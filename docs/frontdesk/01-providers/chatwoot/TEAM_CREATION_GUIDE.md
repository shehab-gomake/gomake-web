# Chatwoot Team Creation Guide

This guide explains how to create a new team in Chatwoot, including the model structure, API endpoints, DTOs, and implementation steps.

## Table of Contents

1. [Overview](#overview)
2. [Model Structure](#model-structure)
3. [API Endpoint](#api-endpoint)
4. [Request DTO](#request-dto)
5. [Response DTO](#response-dto)
6. [Implementation Steps](#implementation-steps)
7. [Example Usage](#example-usage)
8. [Validations & Constraints](#validations--constraints)
9. [Error Handling](#error-handling)

---

## Overview

Teams in Chatwoot are used to organize agents and manage conversation assignments. A team belongs to an account and can have multiple members (agents).

**Key Points:**
- Teams are account-scoped (each team belongs to one account)
- Team names must be unique within an account
- Teams can auto-assign conversations to agents
- Teams can have multiple members (agents)

---

## Model Structure

### Database Schema (Rails)

```ruby
# Table: teams
- id                :bigint (primary key)
- name              :string (required, unique per account)
- description       :text (optional)
- allow_auto_assign :boolean (default: true)
- account_id        :bigint (required, foreign key)
- created_at        :datetime
- updated_at        :datetime

# Indexes
- index_teams_on_account_id
- index_teams_on_name_and_account_id (unique)
```

### Rails Model Relationships

```ruby
class Team < ApplicationRecord
  belongs_to :account
  has_many :team_members, dependent: :destroy_async
  has_many :members, through: :team_members, source: :user
  has_many :conversations, dependent: :nullify
end
```

### TypeScript Interface

```typescript
export interface Team {
  id?: number;                    // Team ID (assigned by server)
  name?: string;                  // Team name (required)
  description?: string;           // Team description (optional)
  allow_auto_assign?: boolean;    // Auto-assign conversations (default: true)
  account_id?: number;            // Account ID (set by server)
  is_member?: boolean;            // Current user is member (computed)
}
```

---

## API Endpoint

### Endpoint Details

```
POST /api/v1/accounts/{account_id}/teams
```

**HTTP Method:** `POST`  
**Authentication:** Required (Bearer token)  
**Content-Type:** `application/json`

**Path Parameters:**
- `account_id` (number, required) - The numeric ID of the account

**Request Body:** See [Request DTO](#request-dto) below

**Response:** See [Response DTO](#response-dto) below

---

## Request DTO

### Request Body Structure

The request body must be wrapped in a `team` key (Rails strong parameters pattern):

```typescript
{
  team: {
    name: string;                 // Required, unique per account
    description?: string;          // Optional
    allow_auto_assign?: boolean;   // Optional, default: true
  }
}
```

### TypeScript Interface

```typescript
export interface TeamCreateUpdatePayload {
  name: string;                   // Team name (required, unique per account)
  description?: string;           // Team description (optional)
  allow_auto_assign?: boolean;    // Auto-assign conversations (optional, default: true)
}
```

### Example Request

```json
{
  "team": {
    "name": "Support Team",
    "description": "Handles customer support inquiries",
    "allow_auto_assign": true
  }
}
```

**Minimal Request (only required field):**

```json
{
  "team": {
    "name": "Support Team"
  }
}
```

---

## Response DTO

### Success Response (200 OK)

```typescript
{
  id: number;                     // Newly created team ID
  name: string;                   // Team name (lowercased by server)
  description: string | null;     // Team description
  allow_auto_assign: boolean;      // Auto-assign setting
  account_id: number;             // Account ID
  is_member: boolean;             // Whether current user is a member
}
```

### Example Response

```json
{
  "id": 789,
  "name": "support team",
  "description": "Handles customer support inquiries",
  "allow_auto_assign": true,
  "account_id": 123,
  "is_member": false
}
```

**Note:** The server automatically lowercases the team name before saving.

---

## Implementation Steps

### Step 1: Import the Service

```typescript
import { chatwootService } from "@/services/frontdesk";
// or
import { ChatwootTeamsService } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";
```

### Step 2: Prepare the Payload

```typescript
const payload: TeamCreateUpdatePayload = {
  name: "Support Team",                    // Required
  description: "Customer support team",    // Optional
  allow_auto_assign: true                  // Optional
};
```

### Step 3: Call the API

```typescript
const accountId = 123; // Get from your app state/context

try {
  const newTeam = await chatwootService.teams.createTeam(accountId, payload);
  console.log("Team created:", newTeam);
} catch (error) {
  console.error("Failed to create team:", error);
}
```

### Step 4: Handle the Response

The response contains the created team with all fields including the server-assigned `id`.

---

## Example Usage

### Complete Example with Error Handling

```typescript
import { chatwootService } from "@/services/frontdesk";
import type { TeamCreateUpdatePayload, Team } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";

async function createNewTeam(
  accountId: number,
  teamName: string,
  description?: string
): Promise<Team> {
  const payload: TeamCreateUpdatePayload = {
    name: teamName,
    description: description,
    allow_auto_assign: true
  };

  try {
    const team = await chatwootService.teams.createTeam(accountId, payload);
    
    // Refresh teams list or update state
    // await refreshTeamsList(accountId);
    
    return team;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific errors
      if (error.message.includes("already exists")) {
        throw new Error("A team with this name already exists");
      }
      if (error.message.includes("name")) {
        throw new Error("Team name is required");
      }
    }
    throw error;
  }
}

// Usage
const team = await createNewTeam(123, "Marketing Team", "Handles marketing inquiries");
console.log(`Created team: ${team.name} (ID: ${team.id})`);
```

### React Hook Example

```typescript
import { useState } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { Team, TeamCreateUpdatePayload } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";

export function useCreateTeam(accountId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTeam = async (payload: TeamCreateUpdatePayload): Promise<Team | null> => {
    setLoading(true);
    setError(null);

    try {
      const team = await chatwootService.teams.createTeam(accountId, payload);
      return team;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create team");
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTeam, loading, error };
}

// Usage in component
function CreateTeamForm({ accountId }: { accountId: number }) {
  const { createTeam, loading, error } = useCreateTeam(accountId);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const team = await createTeam({ name });
    if (team) {
      console.log("Team created:", team);
      // Reset form or navigate
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Team name"
        required
      />
      {error && <div>Error: {error.message}</div>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
}
```

---

## Validations & Constraints

### Server-Side Validations (Rails)

1. **Name is required:** Cannot be blank
2. **Name uniqueness:** Must be unique per account (case-insensitive)
3. **Name normalization:** Server automatically lowercases the name before validation
4. **Account association:** Team is automatically associated with the account from the URL

### Client-Side Recommendations

Before sending the request, validate:

```typescript
function validateTeamPayload(payload: TeamCreateUpdatePayload): string[] {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length === 0) {
    errors.push("Team name is required");
  }

  if (payload.name && payload.name.length > 255) {
    errors.push("Team name must be less than 255 characters");
  }

  return errors;
}
```

---

## Error Handling

### Common Error Scenarios

1. **Missing Team Name (400 Bad Request)**
   ```json
   {
     "message": "Name can't be blank"
   }
   ```

2. **Duplicate Team Name (422 Unprocessable Entity)**
   ```json
   {
     "message": "Name has already been taken"
   }
   ```

3. **Unauthorized (401 Unauthorized)**
   ```json
   {
     "message": "Unauthorized"
   }
   ```

4. **Account Not Found (404 Not Found)**
   ```json
   {
     "message": "Account not found"
   }
   ```

### Error Handling Example

```typescript
try {
  const team = await chatwootService.teams.createTeam(accountId, payload);
} catch (error) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes("can't be blank") || message.includes("required")) {
      // Handle validation error
      console.error("Team name is required");
    } else if (message.includes("already been taken") || message.includes("already exists")) {
      // Handle duplicate name error
      console.error("A team with this name already exists");
    } else if (message.includes("unauthorized") || message.includes("401")) {
      // Handle authentication error
      console.error("You are not authorized to create teams");
    } else {
      // Handle other errors
      console.error("Failed to create team:", error.message);
    }
  }
}
```

---

## Service Method Reference

### `ChatwootTeamsService.createTeam()`

```typescript
async createTeam(
  accountId: number,
  payload: TeamCreateUpdatePayload
): Promise<Team>
```

**Parameters:**
- `accountId` (number, required) - The account ID
- `payload` (TeamCreateUpdatePayload, required) - Team creation data

**Returns:**
- Promise resolving to the created `Team` object

**Throws:**
- Error if request fails (network, validation, authorization, etc.)

**Implementation:**

```typescript
async createTeam(
  accountId: number,
  payload: TeamCreateUpdatePayload
): Promise<Team> {
  // Chatwoot API expects the payload wrapped in a "team" key
  const requestBody = { team: payload };
  return await this.post<Team>(
    this.accountScopedUrl(accountId, "teams"),
    requestBody
  );
}
```

---

## Summary

**To create a team in Chatwoot:**

1. **Endpoint:** `POST /api/v1/accounts/{account_id}/teams`
2. **Request:** `{ team: { name: string, description?: string, allow_auto_assign?: boolean } }`
3. **Response:** `Team` object with `id`, `name`, `description`, `allow_auto_assign`, `account_id`, `is_member`
4. **Validations:** Name is required and must be unique per account
5. **Service Method:** `chatwootService.teams.createTeam(accountId, payload)`

**Key Points:**
- Team name is automatically lowercased by the server
- Team name must be unique within the account
- Account ID comes from the URL path, not the request body
- The request body must wrap the payload in a `team` key
- Response includes server-assigned `id` and computed `is_member` field

