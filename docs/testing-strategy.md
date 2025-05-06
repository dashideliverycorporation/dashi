# Dashi Testing Strategy

## Overall Philosophy & Goals

Dashi follows a focused testing approach for the MVP, ensuring high-quality, reliable code while accelerating development. We employ a modified Testing Trophy approach, focusing heavily on integration tests while maintaining unit tests for complex business logic.

- Goal 1: Achieve 80% code coverage for critical components and business logic.
- Goal 2: Maintain high test performance to support rapid development cycles.
- Goal 3: Verify internationalization works correctly for both English and French content.

## Testing Levels

### Unit Tests

- **Scope:** Test individual functions, components, or hooks in isolation, focusing on business logic, calculations, and state management.
- **Tools:** Jest, React Testing Library, Jest DOM
- **Mocking/Stubbing:** Jest mocks for services, MSW for API mocking, Mock tRPC procedures
- **Location:** Tests are co-located with source files (`*.test.tsx` or `*.test.ts`)
- **Expectations:**
  - All utility functions should have unit tests
  - Complex state management logic should be thoroughly tested
  - Tests should be fast and not depend on external services
  - tRPC procedure input/output validation should be tested

### Integration Tests

- **Scope:** Verify the interaction between multiple components and the application's state management. Test user interactions and data flow within features.
- **Tools:** Jest, React Testing Library, MSW for API mocking
- **Location:** Tests are located in a `__tests__` folder within feature directories
- **Expectations:**
  - Focus on user interactions (clicking, typing, etc.)
  - Test component compositions as they would appear in the application
  - Validate proper rendering and behavior based on different props and state conditions
  - Test tRPC client-server integration with mock server
  - Cover critical user workflows across all three user types:
    - Customer: browsing restaurants, adding to cart, checkout process
    - Restaurant: viewing orders, updating order status, managing menu items
    - Admin: managing restaurants, viewing sales data
  - Test responsive behavior across desktop, tablet, and mobile viewports
  - Test both English and French language versions

## Test Data Management

- Mock data files are stored in `__mocks__` directory
- Fixtures for common API responses follow the same structure as the actual API
- Test data should represent realistic scenarios including edge cases
- Environment-specific test data is managed through environment variables
- Sample restaurant data, menu items, and orders are created for testing all three user roles

## CI/CD Integration

- Unit and integration tests run on every PR
- Test failures block PR merges
- Code coverage reports are generated and tracked over time
- Internationalization tests are run on PRs affecting text content

## Best Practices

1. Write tests that validate behavior, not implementation details
2. Keep tests fast and independent from each other
3. Follow the Arrange-Act-Assert pattern
4. Use realistic test data when possible
5. Test error states and edge cases, not just the happy path
6. Prefer testing user interactions over direct function calls
7. Test internationalization by switching languages
8. Ensure tests cover all three user roles (Customer, Restaurant, Admin)
9. Test tRPC procedures on both client and server sides
10. Add test IDs to components to make them easier to select in tests (`data-testid`)

## Note for MVP

For the MVP phase, we are focusing exclusively on unit and integration testing. End-to-end (E2E) testing, visual regression testing, and other specialized testing types have been intentionally excluded from the initial implementation to accelerate development while maintaining essential quality. These additional testing types will be added in future phases as the product matures.

## Change Log

| Change           | Date       | Version | Description                                            | Author         |
| ---------------- | ---------- | ------- | ------------------------------------------------------ | -------------- |
| Initial draft    | 2025-05-04 | 1.0     | Initial strategy                                       | Admin          |
| Update           | 2025-05-05 | 1.1     | Align with Dashi PRD and architecture doc              | GitHub Copilot |
| Simplify for MVP | 2025-05-06 | 1.2     | Remove E2E, visual regression, and specialized testing | GitHub Copilot |
