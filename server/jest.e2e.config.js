module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests-e2e'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  collectCoverageFrom: [
    '<rootDir>/routes/**/*.js',
    '<rootDir>/middleware/**/*.js',
    '<rootDir>/utils/**/*.js'
  ],
  coverageDirectory: '<rootDir>/coverage-e2e',
  moduleFileExtensions: ['js', 'json'],
  reporters: ['<rootDir>/tests/reporters/gtestReporter.js']
};

