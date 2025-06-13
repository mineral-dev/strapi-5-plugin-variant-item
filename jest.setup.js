// Jest setup file
// Add custom jest matchers for React Testing Library
if (typeof window !== 'undefined') {
  require('@testing-library/jest-dom');
}

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});