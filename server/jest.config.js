module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  collectCoverageFrom: [
    '<rootDir>/routes/**/*.js',
    '<rootDir>/middleware/**/*.js',
    '<rootDir>/utils/**/*.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: ['js', 'json'],
  moduleNameMapper: {
    '^debug$': '<rootDir>/tests/mocks/debug.js'
  },
  reporters: ['<rootDir>/tests/reporters/gtestReporter.js']
};
