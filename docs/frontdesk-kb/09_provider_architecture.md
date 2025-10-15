# Provider Architecture

The FrontDesk feature is built on a modular "provider" architecture. Each communication channel (Internal DMs, Email, Tickets, etc.) is implemented as a self-contained provider. This makes the system extensible and easy to maintain.

## 1. The Provider Interface (`provider.interface.ts`)

-   **Location**: `src/widgets/frontdesk/providers/base/provider.interface.ts`
-   **Description**: This file defines the standard interface that all providers are intended to implement. This allows for polymorphism, where different providers can be treated interchangeably by the UI.

## 2. The Adapter Pattern

To allow for gradual migration and to handle the inconsistencies between the legacy providers, a **Provider Adapter** pattern is used.

-   **Location**: `src/widgets/frontdesk/providers/base/adapters/`
-   **Description**: This directory contains adapter classes that wrap the legacy provider hooks (e.g., `use-email-provider.ts`) and make them conform to the standard `UnifiedProvider` interface.
-   **Key Adapters**:
    -   `email-provider.adapter.ts`
    -   `internal-provider.adapter.ts`

This pattern is what will enable the **Unified Inbox** to function. The Unified Inbox will be able to consume a list of providers that all conform to the same interface, allowing it to aggregate their data seamlessly.

## 3. The Goal: Direct Implementation

While the adapter pattern is a useful bridge, the long-term goal is for all providers to **directly implement the `UnifiedProvider` interface** in their main hooks. The **Tickets Provider** and the refactored **Internal (DM) Provider** are the closest to achieving this goal.
