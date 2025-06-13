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
    '!**/*.test.{js,jsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/index.js' // Exclude index files as they are mostly exports
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 20,
      branches: 20,
      functions: 20,
      lines: 20
    }
  }
};