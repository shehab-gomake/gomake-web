# Research: Missing "Send Quote" Modal

## Problem Description
The user reported that the modal for sending a quote (choosing inbox, customer, and sending email) was missing. Previously, this modal would appear when clicking "Send" -> "Email".

## Investigation Findings

1.  **Legacy vs. New Flow:** The codebase contains two parallel flows for sending emails:
    -   **Legacy:** `sendDocumentToClientApi` (Backend-driven, no frontend composer).
    -   **FrontDesk:** `useFrontDeskEmailIntegration` (Frontend composer with inbox/customer selection).

2.  **The Disconnect:**
    -   The UI button (`SendBtnMenu`) calls `onClickSendQuoteToClient(MessageType.Email)`.
    -   This function was implemented to call the **Legacy API** directly:
        ```typescript
        await sendDocumentToClientApi(callApi, callBack, { ... });
        ```
    -   The new FrontDesk composer logic (`onClickSendEmailViaComposer`) existed in the hook but was **not connected** to this button.

3.  **Component Status:**
    -   `FrontDeskEmailComposerWrapper` is correctly rendered in `QuoteNewPageWidget`.
    -   `useFrontDeskEmailIntegration` is correctly initialized.
    -   The only missing link was the event handler redirection.

## Solution Applied
Modified `src/pages-components/quote-new/use-quote.tsx`:
-   Updated `onClickSendQuoteToClient` to check for `MessageType.Email`.
-   If Email is selected, it now calls `onClickSendEmailViaComposer()` instead of the legacy API.
-   This triggers `openEmailComposer`, which sets the state to show the `FrontDeskEmailComposerWrapper` modal.

## Verification
-   **Trigger:** Clicking "Send" -> "Email" on the Quote page.
-   **Expected Result:** The FrontDesk Email Composer modal opens, allowing the user to select Inbox, Customer, and edit the email before sending.