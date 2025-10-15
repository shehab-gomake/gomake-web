# Bug Fixing Guide

This playbook outlines a structured approach to debugging and fixing issues within the FrontDesk system.

1.  **Reproduce & Isolate**: Get a clear set of steps to reproduce the bug. Identify the layer where the failure is occurring (UI, state management, or service layer).

2.  **Enable Debugging**: Use the browser's local storage to enable verbose logging:
    ```javascript
    localStorage.setItem('FRONTDESK_DEBUG', 'true')
    ```
    This will print additional debug information to the console.

3.  **Triage**:
    *   **UI Glitch?** Check the provider's view components and inspect the CSS and component props.
    *   **Stale or Incorrect Data?** Use the browser's developer tools to inspect the Recoil state. Check the WebSocket event handlers to ensure that real-time updates are being processed correctly.
    *   **API Failure?** Inspect the Network tab in the developer tools. Check the relevant service class (`src/services/frontdesk/api/`) to ensure the correct payload shape and authentication headers are being used.

4.  **Fix Safely**: Apply the fix in the smallest responsible module. If possible, add a unit or integration test that covers the bug to prevent regressions.
