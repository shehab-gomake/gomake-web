# Development Guides

This section contains comprehensive playbooks and guides for common development tasks related to the FrontDesk feature.

## Quick Start

New to FrontDesk development? Start here:
1. Read the [System Architecture](../01_architecture.md) to understand the overall structure
2. Review the [Provider Architecture](../09_provider_architecture.md) to understand the provider pattern
3. Follow the [Adding a New Provider](./new_provider_guide.md) guide for hands-on learning

## Development Guides

### Core Guides

#### [Adding a New Provider](./new_provider_guide.md)
**Status**: ✅ Comprehensive
**What's covered**:
- Complete step-by-step walkthrough with code examples
- Directory structure creation
- TypeScript type definitions
- Recoil state management setup
- API and WebSocket service integration
- Provider hook implementation
- React component creation
- Routing and navigation integration
- Testing and documentation

**When to use**: Creating a new communication provider (Slack, Telegram, etc.)

#### [Bug Fixing Guide](./bug_fixing.md)
**Status**: ✅ Comprehensive
**What's covered**:
- Structured debugging methodology
- Layer-by-layer troubleshooting (UI, State, Service)
- Browser DevTools usage
- React and Recoil debugging
- WebSocket debugging
- Provider-specific common issues
- Testing your fix

**When to use**: Investigating and fixing bugs in FrontDesk

#### [Testing Guide](./testing.md)
**Status**: ✅ Comprehensive
**What's covered**:
- Testing strategy and test pyramid
- Unit testing (components, utils, services)
- Integration testing (hooks, state)
- Testing patterns (AAA, builders, custom hooks)
- Mock data creation
- WebSocket testing
- State testing with Recoil
- Comprehensive verification checklists

**When to use**: Writing tests for new features or fixing bugs

### Feature Playbooks

#### [Playbook: The Ticket Lifecycle](./playbook_ticket_lifecycle.md)
**Status**: ✅ Complete
**What's covered**:
- Deep dive into ticket creation and editing
- Code-level walkthrough of the entire flow
- Hook and component interactions
- API call sequences
- Tag management during ticket operations

**When to use**: Understanding or modifying the ticket creation/editing flow

#### [Playbook: The Search Feature](./playbook_search_feature.md)
**Status**: ✅ Complete
**What's covered**:
- Global search architecture
- In-conversation search implementation
- Search API integration
- Jump-to-message functionality
- Smart message loading

**When to use**: Understanding or modifying search functionality

## Development Workflow

### Day-to-Day Development

```bash
# 1. Start development server
npm run dev

# 2. Make your changes
# (Edit files in src/widgets/frontdesk/)

# 3. Run linting
npm run lint

# 4. Run tests
npm run test

# 5. Build for production
npm run build
```

### Adding a New Feature

1. **Plan**: Review architecture docs to understand where your feature fits
2. **Create**: Follow the appropriate guide (provider, component, etc.)
3. **Test**: Write tests as you develop (TDD encouraged)
4. **Document**: Update knowledge base if needed
5. **Review**: Self-review using verification checklists
6. **Submit**: Create PR with descriptive title and summary

### Fixing a Bug

1. **Reproduce**: Follow the [Bug Fixing Guide](./bug_fixing.md) reproduce steps
2. **Isolate**: Identify which layer (UI/State/Service) has the issue
3. **Debug**: Use debugging tools and techniques from the guide
4. **Fix**: Apply the fix in the smallest responsible module
5. **Test**: Add a test case that covers the bug
6. **Verify**: Run all tests and manual verification

## Common Tasks

### Task: Add a New UI Component

**Files to modify**:
- `src/widgets/frontdesk/components/` - Create new component
- `src/widgets/frontdesk/design-system/` - If it's a design system component

**Steps**:
1. Create component file with TypeScript types
2. Implement component with Material-UI
3. Add Storybook story (if design system component)
4. Write unit tests
5. Import and use in provider views

### Task: Add a New API Endpoint

**Files to modify**:
- `src/services/frontdesk/api/{provider}.service.ts` - Add method
- `src/services/frontdesk/api/index.ts` - Export if new service

**Steps**:
1. Add method to service class
2. Define TypeScript types for request/response
3. Add authentication headers
4. Handle errors appropriately
5. Write service tests
6. Update provider hook to use new method

### Task: Add a New WebSocket Event

**Files to modify**:
- `src/services/frontdesk/websocket/{provider}-socket.service.ts` - Add event handler
- Provider hook - Add event subscription

**Steps**:
1. Add event handler method to WebSocket service
2. Subscribe to event in provider hook's `useEffect`
3. Update Recoil state when event received
4. Test with mock WebSocket events

### Task: Add a New Recoil Atom

**Files to modify**:
- `src/store/frontdesk/atoms/{provider}.atoms.ts` - Add atom
- `src/store/frontdesk/index.ts` - Export atom

**Steps**:
1. Define atom with proper key naming: `frontdesk.{provider}.{data}`
2. Set appropriate default value
3. Add localStorage persistence if needed (atom effects)
4. Export from index.ts
5. Use in provider hook with `useRecoilState`

## Resources

### Internal Documentation
- [System Architecture](../01_architecture.md) - Complete architecture overview
- [Routing System](../02_routing.md) - Centralized routing guide
- [Provider Guides](../providers/README.md) - Provider-specific documentation
- [API Reference](../03_api_reference.md) - REST API and WebSocket events
- [Design System](../04_design_system.md) - UI components and patterns

### External Resources
- [React Documentation](https://react.dev/)
- [Recoil Documentation](https://recoiljs.org/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

## Getting Help

### Before Asking
1. Search the knowledge base docs
2. Check the verification checklists
3. Review similar provider implementations
4. Look at existing test examples

### When Stuck
1. **Documentation**: Check if the issue is covered in KB
2. **Debugging**: Use the Bug Fixing Guide systematically
3. **Code Review**: Look at similar working implementations
4. **Ask**: Provide context, what you've tried, and error messages

## Contributing

When contributing to FrontDesk:
- Follow the established patterns and conventions
- Write tests for new features
- Update documentation when adding features
- Use TypeScript strictly (no `any` types)
- Keep components focused and reusable
- Follow the PR template guidelines

---

**Last Updated**: January 2025
**Maintainer**: FrontDesk Team
