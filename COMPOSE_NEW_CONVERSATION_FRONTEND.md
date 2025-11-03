# Compose New Conversation - Frontend Implementation Guide

## Overview

Feature to send a message to a contact, creating a new conversation. This is a single-contact feature (for bulk messaging, use Campaigns API).

## UI Flow

1. User clicks "New Conversation" button
2. **Contact Selection**: Search/select contact (or create new)
3. **Inbox Selection**: Select channel (Email, WhatsApp, SMS, etc.)
4. **Message Composition**: 
   - Email: Subject, CC, BCC, Message, Attachments
   - WhatsApp: Message or Template
   - SMS: Message only
   - Web Widget: Message + Attachments
5. **Send**: Create conversation with initial message

## API Endpoints

### 1. Search Contacts

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/filter`

**Request**:
```json
{
  "payload": [
    {
      "attribute_key": "email",
      "filter_operator": "contains",
      "values": ["search_term"],
      "attribute_model": "standard",
      "query_operator": "or"
    },
    {
      "attribute_key": "name",
      "filter_operator": "contains",
      "values": ["search_term"],
      "attribute_model": "standard"
    }
  ]
}
```

**Response**:
```json
{
  "payload": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "thumbnail": "https://..."
    }
  ]
}
```

### 2. Get Contactable Inboxes

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:contact_id/contactable_inboxes`

**Response**:
```json
{
  "payload": [
    {
      "source_id": "user@example.com",
      "inbox": {
        "id": 1,
        "name": "Support Email",
        "channel_type": "Channel::Email",
        "inbox_type": "Email"
      }
    }
  ]
}
```

### 3. Create Contact (if needed)

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890"
}
```

### 4. Create Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations`

**Content-Type**: `multipart/form-data` (if attachments) or `application/json`

**Request**:
```typescript
// FormData for multipart/form-data
{
  inbox_id: number;                    // Required
  contact_id: number;                  // Required
  source_id: string;                    // Required: email or phone from contactable_inboxes
  assignee_id?: number;                 // Optional: current user ID
  team_id?: number;                    // Optional
  status?: 'open' | 'pending';         // Optional: defaults to 'open'
  additional_attributes?: {
    mail_subject?: string;              // Required for email inboxes
  };
  message?: {
    content: string;                    // Required if message present
    cc_emails?: string;                 // Optional: comma-separated emails
    bcc_emails?: string;                // Optional: comma-separated emails
    attachments?: File[];               // Optional: file attachments
    template_params?: {                 // Optional: for WhatsApp
      name: string;
      category: string;
      language: string;
      namespace?: string;
      processed_params?: object;
    };
    private?: boolean;                  // Optional: private message
    echo_id?: string;                   // Optional: frontend tracking ID
  };
}
```

**Response**:
```json
{
  "id": 123,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "account_id": 1,
  "inbox_id": 2,
  "contact_id": 3,
  "status": "open",
  "created_at": 1704067200,
  "messages": [
    {
      "id": 456,
      "content": "Hello!",
      "message_type": 1,
      "created_at": 1704067200
    }
  ],
  "meta": {
    "sender": { "id": 3, "name": "John Doe" },
    "channel": "Channel::Email"
  }
}
```

## Form Validation

### Required Fields
- **Contact**: Must be selected
- **Inbox**: Must be selected
- **Message**: Required (except WhatsApp with template_params)
- **Subject**: Required for email inboxes

### Contact Search Logic
- If input starts with `+`: Treat as phone number
- If input contains `@`: Treat as email
- Otherwise: Search by name, email, or phone

### Inbox Filtering
- Only show inboxes where contact can be reached:
  - Email inboxes: Contact must have email
  - WhatsApp/SMS: Contact must have phone_number
- Filter by user permissions

## Channel-Specific Fields

### Email Inbox
```typescript
{
  subject: string;        // Required
  ccEmails?: string;      // Optional: comma-separated
  bccEmails?: string;     // Optional: comma-separated
  message: string;        // Required
  attachments?: File[];   // Optional
}
```

### WhatsApp Inbox
```typescript
{
  message?: string;       // Optional if template_params provided
  template_params?: {     // Optional: pre-approved template
    name: string;
    category: string;
    language: string;
    processed_params?: object;
  };
}
```

### SMS/Twilio Inbox
```typescript
{
  message: string;       // Required: plain text only
}
```

### Web Widget Inbox
```typescript
{
  message: string;       // Required
  attachments?: File[];   // Optional
}
```

## Implementation Steps

### Step 1: Build Form Component

```typescript
interface ComposeFormState {
  contact: Contact | null;
  inbox: Inbox | null;
  message: string;
  subject?: string;        // Email only
  ccEmails?: string;      // Email only
  bccEmails?: string;     // Email only
  attachments: File[];    // Email/Web Widget only
}

const [formState, setFormState] = useState<ComposeFormState>({
  contact: null,
  inbox: null,
  message: '',
  attachments: []
});
```

### Step 2: Contact Search (Debounced)

```typescript
const searchContacts = debounce(async (query: string) => {
  if (!query.trim()) return [];
  
  const response = await api.post(
    `/api/v1/accounts/${accountId}/contacts/filter`,
    {
      payload: [
        {
          attribute_key: 'email',
          filter_operator: 'contains',
          values: [query],
          attribute_model: 'standard',
          query_operator: 'or'
        },
        {
          attribute_key: 'name',
          filter_operator: 'contains',
          values: [query],
          attribute_model: 'standard'
        }
      ]
    }
  );
  
  return response.data.payload;
}, 300);
```

### Step 3: Fetch Contactable Inboxes

```typescript
const fetchContactableInboxes = async (contactId: number) => {
  const response = await api.get(
    `/api/v1/accounts/${accountId}/contacts/${contactId}/contactable_inboxes`
  );
  return response.data.payload;
};
```

### Step 4: Prepare Payload

```typescript
const preparePayload = (): FormData | object => {
  const { contact, inbox, message, subject, ccEmails, bccEmails, attachments } = formState;
  
  // Use FormData if attachments exist
  const hasAttachments = attachments.length > 0;
  const payload = hasAttachments ? new FormData() : {};
  
  // Required fields
  if (hasAttachments) {
    payload.append('inbox_id', inbox!.id.toString());
    payload.append('contact_id', contact!.id.toString());
    payload.append('source_id', inbox!.sourceId);
    payload.append('assignee_id', currentUser.id.toString());
    
    // Message
    if (message) {
      payload.append('message[content]', message);
    }
    
    // Email-specific
    if (inbox!.channel_type === 'Channel::Email') {
      if (subject) {
        payload.append('additional_attributes[mail_subject]', subject);
      }
      if (ccEmails) {
        payload.append('message[cc_emails]', ccEmails);
      }
      if (bccEmails) {
        payload.append('message[bcc_emails]', bccEmails);
      }
    }
    
    // Attachments
    attachments.forEach(file => {
      payload.append('message[attachments][]', file);
    });
  } else {
    // JSON payload (no attachments)
    Object.assign(payload, {
      inbox_id: inbox!.id,
      contact_id: contact!.id,
      source_id: inbox!.sourceId,
      assignee_id: currentUser.id,
      message: {
        content: message,
        ...(inbox!.channel_type === 'Channel::Email' && {
          cc_emails: ccEmails,
          bcc_emails: bccEmails
        })
      },
      ...(inbox!.channel_type === 'Channel::Email' && {
        additional_attributes: {
          mail_subject: subject
        }
      })
    });
  }
  
  return payload;
};
```

### Step 5: Send Request

```typescript
const handleSubmit = async () => {
  // Validate
  if (!formState.contact || !formState.inbox) {
    return;
  }
  
  if (formState.inbox.channel_type === 'Channel::Email' && !formState.subject) {
    showError('Subject is required for email');
    return;
  }
  
  if (!formState.message && formState.inbox.channel_type !== 'Channel::Whatsapp') {
    showError('Message is required');
    return;
  }
  
  try {
    const payload = preparePayload();
    const isFormData = payload instanceof FormData;
    
    const response = await api.post(
      `/api/v1/accounts/${accountId}/conversations`,
      payload,
      {
        headers: isFormData 
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' }
      }
    );
    
    // Success
    showSuccess('Conversation created');
    navigate(`/conversations/${response.data.id}`);
    resetForm();
  } catch (error) {
    showError(error.response?.data?.error || 'Failed to create conversation');
  }
};
```

## Error Handling

```typescript
// 422 Unprocessable Entity
if (error.response?.status === 422) {
  const errorMessage = error.response.data.error;
  // Show validation error
}

// 404 Not Found
if (error.response?.status === 404) {
  // Contact or inbox not found
}

// 403 Forbidden
if (error.response?.status === 403) {
  // Permission denied
}
```

## UI Components Needed

1. **ContactSelector**: Searchable dropdown with create option
2. **InboxSelector**: Dropdown showing contactable inboxes
3. **MessageEditor**: Rich text editor (for email/web widget) or plain text
4. **EmailOptions**: Subject, CC, BCC inputs (for email only)
5. **FileUpload**: Attachment upload (for email/web widget)
6. **SendButton**: Submit button with loading state

## source_id Rules

Get `source_id` from `contactable_inboxes` response:
- **Email**: Email address (`user@example.com`)
- **WhatsApp**: Phone number without `+` (`1234567890`)
- **SMS/Twilio**: Phone number with `+` (`+1234567890`)
- **API/Web Widget**: UUID or custom identifier

## Quick Reference

### Required Fields Matrix

| Field | Email | WhatsApp | SMS | Web Widget |
|-------|-------|----------|-----|------------|
| Contact | ✅ | ✅ | ✅ | ✅ |
| Inbox | ✅ | ✅ | ✅ | ✅ |
| Message | ✅ | ⚠️* | ✅ | ✅ |
| Subject | ✅ | ❌ | ❌ | ❌ |
| CC/BCC | ⚠️ | ❌ | ❌ | ❌ |
| Attachments | ⚠️ | ❌ | ❌ | ⚠️ |

*⚠️ Required unless template_params provided

## Example Complete Flow

```typescript
// 1. User searches for contact
const contacts = await searchContacts('john');

// 2. User selects contact
const selectedContact = contacts[0];

// 3. Fetch contactable inboxes
const inboxes = await fetchContactableInboxes(selectedContact.id);

// 4. User selects inbox
const selectedInbox = inboxes[0];

// 5. User fills form
formState = {
  contact: selectedContact,
  inbox: selectedInbox.inbox,
  message: 'Hello!',
  subject: 'Test Subject', // if email
  sourceId: selectedInbox.source_id
};

// 6. Submit
await createConversation(formState);
```

