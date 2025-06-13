# Testing Documentation

This document describes the testing setup for the Strapi 5 Plugin Variant Item.

## Overview

The project uses Jest as the testing framework with separate configurations for:
- **Frontend (React)**: Uses React Testing Library with jsdom environment
- **Backend (Node.js)**: Uses Node environment for server-side tests

## Test Structure

```
├── admin/src/components/__tests__/
│   ├── Input.test.jsx       # Tests for the main Input component
│   └── PluginIcon.test.jsx  # Tests for the PluginIcon component
├── server/src/
│   ├── controllers/__tests__/
│   │   └── controller.test.js  # Tests for API controllers
│   └── services/__tests__/
│       └── service.test.js     # Tests for business logic services
```

## Running Tests

### All Tests
```bash
npm test              # Runs both unit and build tests
npm run test:unit     # Runs only unit tests with coverage
npm run test:watch    # Runs tests in watch mode
npm run test:build    # Tests if the plugin builds correctly
```

### Linting
```bash
npm run lint          # Runs ESLint on all JavaScript files
```

## Test Coverage

Current coverage thresholds are set to 20% to allow for gradual improvement:
- Statements: 20%
- Branches: 20%
- Functions: 20%
- Lines: 20%

Coverage reports are generated in the `coverage/` directory after running tests.

## Writing Tests

### Frontend Tests

Frontend tests use React Testing Library with a custom render function that provides necessary Strapi providers:

```jsx
import { renderWithProviders as render, screen, waitFor } from '../../test-utils';

describe('Component', () => {
  it('should render correctly', async () => {
    render(<Component {...props} />);
    
    await waitFor(() => {
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });
});
```

### Backend Tests

Backend tests use standard Jest with mocked Strapi API:

```javascript
describe('Service', () => {
  const mockStrapi = {
    documents: jest.fn()
  };

  const service = require('../service')({ strapi: mockStrapi });

  it('should return expected data', async () => {
    mockStrapi.documents.mockReturnValue({
      findMany: jest.fn().mockResolvedValue([/* mock data */])
    });

    const result = await service.someMethod();
    expect(result).toEqual(/* expected result */);
  });
});
```

## Mocking

### API Calls
The `fetch` API is mocked globally for frontend tests:
```javascript
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => mockData
});
```

### LocalStorage
LocalStorage is mocked for authentication tokens:
```javascript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-jwt-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});
```

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:
1. Runs tests on multiple Node.js versions (18.x, 20.x)
2. Executes linting checks
3. Runs unit tests with coverage
4. Performs build tests
5. Uploads coverage reports to Codecov

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests
2. **Mock External Dependencies**: Always mock API calls and external services
3. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
4. **Test User Behavior**: For frontend tests, focus on testing user interactions rather than implementation details
5. **Handle Async Operations**: Always use `waitFor` or similar utilities when testing async behavior
6. **Clean Up**: Use `beforeEach` and `afterEach` to set up and clean up test state

## Troubleshooting

### Common Issues

1. **Styled Components Warnings**: These are expected and don't affect test functionality
2. **Console Errors in Tests**: Use `jest.spyOn(console, 'error').mockImplementation()` to suppress expected errors
3. **Async Test Failures**: Ensure all async operations are properly awaited using `waitFor`

## Future Improvements

1. Increase test coverage to 80%+ for critical components
2. Add integration tests for API endpoints
3. Implement E2E tests using Cypress or Playwright
4. Add visual regression tests for UI components
5. Set up mutation testing to ensure test quality