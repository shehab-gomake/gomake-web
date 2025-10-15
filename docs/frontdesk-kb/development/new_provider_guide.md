# Adding a New Provider

This guide provides a step-by-step playbook for scaffolding a new communication provider for FrontDesk.

1.  **Create Directory Structure**:
    ```bash
    mkdir -p src/widgets/frontdesk/providers/{provider-name}/{components,hooks,types}
    ```

2.  **Define State**: Create the necessary Recoil atoms for your new provider in `src/store/frontdesk/atoms/{provider}.atoms.ts`.

3.  **Create API Service**: If your provider requires REST API communication, add a new service class in `src/services/frontdesk/api/`.

4.  **Create Provider Hook**: Implement the main logic for your provider in a `use-{provider}-provider.ts` hook. This hook is responsible for managing state, making API calls, and handling any other business logic.

5.  **Create Provider View**: Build the main React component for your provider's UI.

6.  **Register Provider**: Add a case for the new provider in the routing logic within `frontdesk-widget.tsx`.

7.  **Add Navigation**: Update the `NavigationSidebar` component to include an icon and link for the new provider.

8.  **Document**: Add a new document for your provider in `docs/frontdesk-kb/providers/` and update the `README.md` in that directory.
