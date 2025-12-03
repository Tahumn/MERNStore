module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/app', '<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/../server/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': '<rootDir>/test/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/test/fileMock.js',
    '^@testing-library/jest-dom$': '<rootDir>/test/jest-dom-stub.js'
  },
  testMatch: ['**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/']
};
