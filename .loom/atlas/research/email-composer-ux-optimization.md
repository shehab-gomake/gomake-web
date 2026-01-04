# Research: Email Composer UX Optimization

## Problem Description
The user requested an improvement to the "Send Email" UX in the Quote/Document flow. Previously, when clicking "Send Email", the application would wait for the data to load *before* opening the modal. This caused a perceived delay where nothing happened for a few seconds.

## Implementation Details

### 1. Refactored `useFrontDeskEmailIntegration`
-   **Old Behavior:**
    1.  Click "Send Email"
    2.  Wait for API response (UI frozen/unresponsive)
    3.  Open Modal with data
-   **New Behavior:**
    1.  Click "Send Email"
    2.  **Immediately** open Modal with `isLoading=true`
    3.  Fetch data in background
    4.  Update Modal with data when ready

### 2. State Management
-   Modified `src/pages-components/quotes/hooks/use-frontdesk-email-integration.ts` to set `setIsEmailComposerOpen(true)` immediately.
-   Exposed `isLoadingEmailData` state from the hook.

### 3. Component Updates
-   Updated `src/pages-components/quote-new/use-quote.tsx` to pass `isLoadingEmailData` through.
-   Updated `src/pages-components/quote-new/quote.tsx` to pass `isLoading` prop to `FrontDeskEmailComposerWrapper`.

## Benefits
-   **Instant Feedback:** User sees immediate action upon clicking the button.
-   **Better Perceived Performance:** The application feels faster even if the API call takes the same amount of time.
-   **Visual Indication:** The modal will show a loading state (skeleton/spinner) while data is being fetched.

## Verification
-   Click "Send" -> "Email" on a Quote/Order.
-   Modal should open instantly.
-   Loading state should be visible briefly.
-   Form should populate once data arrives.
