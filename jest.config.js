module.exports = {
  // Test environment setup
  projects: [
    {
      displayName: 'admin',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/admin/**/*.test.{js,jsx}'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }]
          ]
        }]
      }
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
    }
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'admin/src/**/*.{js,jsx}',
    'server/src/**/*.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.test.{js,jsx}'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  }
};