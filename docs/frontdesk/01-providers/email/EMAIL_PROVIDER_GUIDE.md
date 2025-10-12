# Frontend Email Integration Guide

This guide outlines the steps for integrating the email functionalities into the frontend application. The system allows a single user to connect multiple email accounts (e.g., multiple Gmail accounts) and interact with them.

## Authentication

All API endpoints listed below are protected. You must include a valid JWT in the `Authorization` header of every request.

**Example Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## Flow 1: Connecting a New Email Account

This is a three-step process initiated by the user.

### Step 1: Get the Google Authentication URL

To begin, the frontend must request a unique authentication URL from the backend. This URL is specific to the user and includes a secure state token.

*   **Endpoint:** `GET /auth/oauth/google`
*   **Method:** `GET`

**Request:**
```bash
curl --location 'http://localhost:3000/auth/oauth/google' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN_HERE'
```

**Response:**
The backend will respond with a JSON object containing the URL.
```json
{
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&state=...",
    "state": "...",
    "provider": "gmail"
}
```

### Step 2: Redirect User to Google

Your application should redirect the user to the `url` received in the previous step. This can be done by setting `window.location.href`.

```javascript
window.location.href = response.url;
```

The user will then see Google's consent screen and approve the connection.

### Step 3: Handle the Redirect Back

After the user approves the connection, Google will redirect them back to the backend. The backend handles the entire callback process (exchanging the code for tokens, creating the account, etc.).

Once complete, the backend will redirect the user to a simple success or failure page on the backend server itself:

*   **On Success:** `http://localhost:3000/email/auth/success`
*   **On Failure:** `http://localhost:3000/email/auth/failure`

Your application does not need to handle the callback from Google directly. The user can simply close the success/failure page to return to your application.

---

## Flow 2: Interacting with Email Accounts

Once a user has connected one or more accounts, you can interact with them using the following endpoints.

### Listing All Connected Accounts

This is the primary endpoint for managing multiple accounts. It provides the `accountId` needed for all other actions.

*   **Endpoint:** `GET /email/accounts`
*   **Method:** `GET`

**Usage:**
Fetch this endpoint to get a list of all email accounts the current user has connected. The UI should use this list to allow the user to select which account they want to view or send from.

**Request:**
```bash
curl --location 'http://localhost:3000/email/accounts' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN_HERE'
```

**Response:**
An array of account objects.
```json
[
    {
        "id": "52259942-57ba-4de1-a49c-4edeaa91122a",
        "provider": "gmail",
        "email": "user@gmail.com",
        "displayName": "User Name",
        "isActive": true,
        "isPrimary": true,
        "createdAt": "2025-09-18T12:28:11.449Z",
        "updatedAt": "2025-09-18T12:38:52.645Z"
    }
]
```

### Reading Messages (Conversations)

Fetch a list of conversations (threads) from a specific email account.

*   **Endpoint:** `GET /email/accounts/:accountId/messages`
*   **Method:** `GET`

**URL Parameters:**
*   `:accountId` (required): The `id` of the email account, obtained from the "Listing Accounts" endpoint.

**Query Parameters:**
*   `limit` (optional): The number of conversations to return. Defaults to 20.
*   `pageToken` (optional): The token for fetching the next page of results.
*   `query` (optional): A search query string, following Gmail's search syntax (e.g., `"from:boss@company.com is:unread"`).

**Request:**
```bash
curl --location 'http://localhost:3000/email/accounts/52259942-57ba-4de1-a49c-4edeaa91122a/messages?limit=10' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN_HERE'
```

### Sending an Email

Send an email from a specific account.

*   **Endpoint:** `POST /email/accounts/:accountId/send`
*   **Method:** `POST`

**URL Parameters:**
*   `:accountId` (required): The `id` of the email account to send from.

**Request Body (JSON):**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello from the API",
  "html": "<p>This is the <b>HTML</b> body of the email.</p>",
  "text": "This is the plain text body of the email.",
  "replyToMessageId": null, // or the ID of the message you are replying to
  "threadId": null // or the ID of the thread to reply within
}
```

**Request:**
```bash
curl --location 'http://localhost:3000/email/accounts/52259942-57ba-4de1-a49c-4edeaa91122a/send' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "to": "recipient@example.com",
    "subject": "Hello from the API",
    "html": "<p>This is a test.</p>"
}'
```
