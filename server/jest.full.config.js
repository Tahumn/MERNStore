module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/tests-full'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  collectCoverageFrom: [
    '<rootDir>/routes/**/*.js',
    '<rootDir>/middleware/**/*.js',
    '<rootDir>/utils/**/*.js'
  ],
  coverageDirectory: '<rootDir>/coverage-full',
  moduleFileExtensions: ['js', 'json'],
  reporters: ['<rootDir>/tests/reporters/gtestReporter.js']
};
