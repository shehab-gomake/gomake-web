# Testing Guide

This document provides an overview of the testing processes for the FrontDesk feature.

## Running Tests

The following scripts are available for running tests:

-   **`npm run dev`**: Starts the development server for manual testing.
-   **`npm run lint`**: Runs static analysis to catch code style issues.
-   **`npm run test`**: Runs the full Jest test suite.
-   **`npm run test -- --watch`**: Runs the tests in watch mode, which is useful for TDD (Test-Driven Development).

## Verification Checklists

### For a New Feature:
- [ ] Does it build and run locally (`npm run dev`)?
- [ ] Does it pass all linting checks (`npm run lint`)?
- [ ] Do all existing tests pass, and have new tests been added to cover the feature (`npm run test`)?
- [ ] Is the UI responsive and accessible?
- [ ] Is the Recoil state managed correctly with safe defaults?
- [ ] Are all API and WebSocket contracts being met?

### For a Bugfix:
- [ ] Is the bug verifiably fixed?
- [ ] Have any regressions been introduced in related providers?
- [ ] Has a new test case been added that covers the original bug?
