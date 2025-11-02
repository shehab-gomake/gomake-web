# FrontDesk Knowledge Base

Welcome to the FrontDesk Knowledge Base. This collection of documents provides a comprehensive guide to the FrontDesk unified messaging hub.

This knowledge base is designed to give developers a deep understanding of the architecture, components, data flows, and development patterns required to build, maintain, and extend the feature.

## Quick Navigation

### New to FrontDesk?
Start with these essential documents:
1. **[System Architecture](./01_architecture.md)** - Understand the overall structure
2. **[Provider Architecture](./09_provider_architecture.md)** - Learn the provider pattern
3. **[Adding a New Provider](./development/new_provider_guide.md)** - Hands-on walkthrough

### Common Tasks
- **Adding a feature?** → [Development Guides](./development/README.md)
- **Fixing a bug?** → [Bug Fixing Guide](./development/bug_fixing.md)
- **Writing tests?** → [Testing Guide](./development/testing.md)
- **Understanding tickets?** → [Ticket Lifecycle Playbook](./development/playbook_ticket_lifecycle.md)

---

## Table of Contents

### 1. Core Concepts
*   **[System Architecture](./01_architecture.md)** ✅ Comprehensive
    - Complete architecture overview with diagrams
    - Three-column layout architecture
    - State management patterns
    - Services layer organization
    - Data flow patterns
    - Integration points

*   **[Routing System](./02_routing.md)**
    - Centralized, type-safe routing
    - Deep linking support
    - Route parsing and building
    - Navigation patterns

### 2. Providers
*   **[Provider Guides](./providers/README.md)**
    - Internal DMs (Direct Messages)
    - Email (Gmail integration)
    - WhatsApp (Mock implementation)
    - Tickets (Full backend integration)
    - Unified Inbox

### 3. Development
*   **[Development Guides](./development/README.md)** ✅ Enhanced

#### Core Guides (Comprehensive)
*   **[Adding a New Provider](./development/new_provider_guide.md)** ✅ Fully Updated
    - 12 detailed steps with code examples
    - Complete TypeScript integration
    - State management setup
    - API and WebSocket services
    - Component creation and testing

*   **[Bug Fixing Guide](./development/bug_fixing.md)** ✅ Fully Updated
    - Structured debugging methodology
    - Layer-by-layer troubleshooting
    - Browser DevTools usage
    - React and Recoil debugging
    - Provider-specific issues
    - Verification checklists

*   **[Testing Guide](./development/testing.md)** ✅ Fully Updated
    - Complete testing strategy
    - Unit and integration testing
    - Testing patterns and best practices
    - Mock data and WebSocket testing
    - State testing with Recoil
    - Comprehensive checklists

#### Feature Playbooks
*   **[Playbook: Ticket Lifecycle](./development/playbook_ticket_lifecycle.md)**
    - Deep dive into ticket creation/editing
    - Code-level walkthroughs
    - Tag management patterns

*   **[Playbook: Search Feature](./development/playbook_search_feature.md)**
    - Global and in-conversation search
    - Smart message loading
    - Jump-to-message functionality

### 4. API
*   **[API Reference](./03_api_reference.md)**
    - REST API endpoints
    - WebSocket events
    - Authentication patterns

### 5. Design System
*   **[Design System](./04_design_system.md)**
    - UI components library
    - Design tokens
    - Shared patterns

### 6. State Management
*   **[State Management](./05_state_management.md)**
    - Recoil atoms and selectors
    - State persistence
    - Optimistic updates

### 7. Services
*   **[Services Layer](./06_services.md)**
    - REST API services
    - WebSocket services
    - Service patterns

### 8. Shared Components
*   **[Shared Components](./07_shared_components.md)**
    - Reusable components
    - Component patterns
    - Usage examples

### 9. Real-time Architecture
*   **[Real-time Architecture](./08_realtime_architecture.md)**
    - WebSocket integration
    - Event handling
    - Connection management

### 10. Provider Architecture
*   **[Provider Architecture](./09_provider_architecture.md)**
    - Provider pattern overview
    - Adapter pattern
    - Unified interface

---

## Recent Updates

**January 2025** - Major documentation enhancement:
- ✅ **New Provider Guide**: Expanded from 8 steps to 12 comprehensive steps with full code examples
- ✅ **Bug Fixing Guide**: Completely rewritten with debugging tools, layer-specific troubleshooting, and provider-specific sections
- ✅ **Testing Guide**: Enhanced with testing strategies, patterns, mock examples, and detailed checklists
- ✅ **Development README**: Updated with quick start guide, common tasks, and resources
- ✅ **Main README**: Improved navigation and status indicators
