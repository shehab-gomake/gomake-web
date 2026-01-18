# Employee Invitation Implementation Guide

This document outlines the implementation of the employee invitation feature across the GoMake workspace.

## Overview

The employee invitation feature allows administrators to invite employees without immediately creating AWS Cognito users. The invited employee receives an email with a link to set their password and complete account setup.

## Frontend Implementation (gomake-web)

### Components Created

1. **Invite Employee Modal** (`src/widgets/settings-users/users/components/invite-employee/`)
   - Modal component with form fields: First name, Last name, Email, Role
   - Validates input before submission
   - Calls `inviteEmployeeApi` endpoint

2. **Invitation Acceptance Page** (`src/pages/invite/[token].page.tsx`)
   - Public page accessible via invitation link
   - Allows employee to set password
   - Calls `acceptInvitationApi` endpoint
   - Redirects to login page after successful acceptance

3. **API Endpoints** (`src/services/api-service/users/users-api.ts`)
   - `inviteEmployeeApi`: POST `/v1/crm-service/employee/invite-employee`
   - `acceptInvitationApi`: POST `/v1/crm-service/employee/accept-invitation`

### UI Changes

- Added "Invite" button to the users-settings page header
- Modal opens when clicking the invite button
- Form validation ensures all required fields are filled
- Success/error messages displayed via snackbar

## Backend Implementation Required

### 1. gomake-crm-service

#### Endpoint: `POST /v1/crm-service/employee/invite-employee`

**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "roleID": "string"
}
```

**Implementation Requirements:**
1. Create employee record in database WITHOUT creating AWS Cognito user
2. Set employee status to "waiting for invitation" (or equivalent status field)
3. Generate a unique invitation token (UUID or JWT token)
4. Store the invitation token with the employee record (with expiration, e.g., 7 days)
5. Return success response with invitation token (or let communication service handle email sending)

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "string",
    "invitationToken": "string"
  }
}
```

**Error Cases:**
- Email already exists: Return status code 96 (as per existing pattern)
- Invalid roleID: Return appropriate error
- Database errors: Return appropriate error

#### Endpoint: `POST /v1/crm-service/employee/accept-invitation`

**Request Body:**
```json
{
  "token": "string",
  "password": "string"
}
```

**Implementation Requirements:**
1. Validate the invitation token (check if exists, not expired, not already used)
2. Find employee by invitation token
3. Validate password (minimum 8 characters, or your password policy)
4. Create AWS Cognito user with:
   - Email (from employee record)
   - Password (from request)
   - Other required Cognito attributes
5. Link Cognito user ID to employee record
6. Update employee status to "active" (or equivalent)
7. Mark invitation token as used/expired
8. Return success response

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "string",
    "message": "Invitation accepted successfully"
  }
}
```

**Error Cases:**
- Invalid/expired token: Return error message
- Password doesn't meet requirements: Return error message
- Cognito user creation fails: Return error message
- Employee already has Cognito user: Return error message

**Database Schema Changes (if needed):**
- Add `invitationToken` field to employee table
- Add `invitationTokenExpiry` field (datetime)
- Add `invitationTokenUsed` field (boolean)
- Ensure `status` field supports "waiting for invitation" state

### 2. gomake-communication-service

#### Email Template: Employee Invitation

**Trigger:** After successful employee invitation creation in CRM service

**Email Content:**
- Subject: "You've been invited to join [Company Name]"
- Body: Include invitation link: `{frontend_url}/invite/{invitationToken}`
- Instructions: "Click the link below to set your password and complete your account setup"
- Expiration notice: "This invitation link will expire in 7 days"

**Implementation:**
- Listen for employee invitation event from CRM service (or use webhook/queue)
- Send email with invitation link
- Use existing email sending infrastructure

### 3. gomake-ui-backend (Proxy)

**No changes required** - The proxy should forward requests to CRM service as-is.

## Integration Flow

```
1. Admin clicks "Invite" button in gomake-web
   ↓
2. Frontend calls: POST /v1/crm-service/employee/invite-employee
   ↓
3. CRM Service:
   - Creates employee record (no Cognito user)
   - Generates invitation token
   - Sets status to "waiting for invitation"
   ↓
4. Communication Service:
   - Receives invitation event
   - Sends email with invitation link
   ↓
5. Employee clicks link: {frontend_url}/invite/{token}
   ↓
6. Frontend calls: POST /v1/crm-service/employee/accept-invitation
   ↓
7. CRM Service:
   - Validates token
   - Creates Cognito user
   - Updates employee status to "active"
   ↓
8. Frontend redirects to login page
```

## Security Considerations

1. **Token Security:**
   - Use cryptographically secure random tokens (UUID v4 or JWT)
   - Set expiration (recommended: 7 days)
   - One-time use tokens (mark as used after acceptance)
   - Store tokens securely (hashed if possible)

2. **Password Requirements:**
   - Enforce minimum password length (8+ characters)
   - Consider password complexity requirements
   - Validate password before creating Cognito user

3. **Rate Limiting:**
   - Limit invitation requests per admin user
   - Limit invitation acceptance attempts per token

4. **Email Verification:**
   - Ensure email is valid before sending invitation
   - Consider email verification flow if not already implemented

## Testing Checklist

### Frontend (gomake-web)
- [ ] Invite button appears on users-settings page
- [ ] Modal opens and closes correctly
- [ ] Form validation works (required fields, email format)
- [ ] API calls are made correctly
- [ ] Success/error messages display correctly
- [ ] Invitation page loads with token from URL
- [ ] Password form validation works
- [ ] Password confirmation matches
- [ ] Redirect to login page after successful acceptance
- [ ] Error handling for invalid/expired tokens

### Backend (gomake-crm-service)
- [ ] Employee created without Cognito user
- [ ] Invitation token generated and stored
- [ ] Employee status set correctly
- [ ] Token validation works
- [ ] Cognito user creation works
- [ ] Employee status updated after acceptance
- [ ] Error handling for all error cases
- [ ] Token expiration enforced
- [ ] One-time use tokens enforced

### Backend (gomake-communication-service)
- [ ] Email sent with correct invitation link
- [ ] Email template looks correct
- [ ] Link contains correct token
- [ ] Email sent to correct recipient

## Notes

- The implementation follows existing patterns in the codebase
- Uses existing API structure and error handling patterns
- Reuses existing employee creation functions where possible (without Cognito user creation)
- Follows existing translation patterns for i18n support
