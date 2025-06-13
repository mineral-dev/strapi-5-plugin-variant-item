# Strapi 5 Plugin Variant Item

A Strapi 5 plugin for managing product variants with attributes like color, size, and other customizable options.

## Features

- Dynamic variant attribute management
- Support for multiple variant types (Button, Select, etc.)
- React-based admin interface
- RESTful API endpoints for variant data

## Installation

```bash
npm install strapi-5-plugin-variant-item
# or
yarn add strapi-5-plugin-variant-item
```

## Development

### Prerequisites

- Node.js >= 18
- npm or yarn
- Strapi 5.x

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mineral-dev/strapi-5-plugin-variant-item.git
cd strapi-5-plugin-variant-item
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

## Testing

This project includes comprehensive unit tests and build tests for both frontend and backend components.

### Test Structure

```
├── admin/
│   └── src/
│       └── components/
│           └── __tests__/        # Frontend component tests
├── server/
│   └── src/
│       ├── services/
│       │   └── __tests__/       # Backend service tests
│       └── controllers/
│           └── __tests__/       # Backend controller tests
```

### Running Tests

```bash
# Run all tests (unit + build)
npm test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run build test
npm run test:build

# Run linter
npm run lint
```

### Test Coverage

The project maintains test coverage thresholds:
- Branches: 60%
- Functions: 60%
- Lines: 60%
- Statements: 60%

Coverage reports are generated in the `coverage/` directory after running tests.

### Writing Tests

#### Frontend Tests (React Components)

Frontend tests use React Testing Library and Jest. Example:

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### Backend Tests (Services/Controllers)

Backend tests use Jest with mocked Strapi context. Example:

```javascript
const service = require('../service');

describe('Service', () => {
  const mockStrapi = {
    // Mock strapi methods
  };
  
  it('should return data', async () => {
    const result = await service({ strapi: mockStrapi }).getData();
    expect(result).toBeDefined();
  });
});
```

### Continuous Integration

The project uses GitHub Actions for CI/CD. Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

Tests run on Node.js versions: 18.x and 20.x

## Development Scripts

```bash
# Build the plugin
npm run build

# Watch for changes during development
npm run watch

# Watch and link for local development
npm run watch:link

# Verify the plugin
npm run verify
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Zulfa Nafi <zul@mineral.co.id>
