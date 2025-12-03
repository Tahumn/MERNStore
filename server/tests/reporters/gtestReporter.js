const path = require('path');

class GTestReporter {
  constructor() {
    this.startTime = null;
    this.buffer = [];
  }

  log(message = '') {
    process.stdout.write(`${message}\n`);
  }

  add(message = '') {
    this.buffer.push(message);
  }

  onRunStart() {
    this.startTime = Date.now();
    this.buffer = [];
  }

  onTestResult(test, testResult) {
    const suiteName = path.basename(testResult.testFilePath);
    const testsInSuite = testResult.testResults.length;
    const runtime =
      (testResult?.perfStats?.runtime &&
        `${testResult.perfStats.runtime} ms total`) ||
      '0 ms total';

    this.add(`[----------] ${testsInSuite} tests from ${suiteName}`);

    testResult.testResults.forEach(testCase => {
      const duration =
        typeof testCase.duration === 'number'
          ? `${testCase.duration} ms`
          : '0 ms';
      const name = testCase.fullName;

      this.add(`[ RUN      ] ${name}`);

      if (testCase.status === 'passed') {
        this.add(`[       OK ] ${name} (${duration})`);
      } else if (testCase.status === 'failed') {
        this.add(`[  FAILED  ] ${name}`);
        testCase.failureMessages.forEach(message => this.add(message));
      } else if (testCase.status === 'pending' || testCase.status === 'skipped') {
        this.add(`[  SKIPPED ] ${name}`);
      }
    });

    this.add(`[----------] ${testsInSuite} tests from ${suiteName} (${runtime})`);
    if (testResult.failureMessage) {
      this.add(testResult.failureMessage);
    }
  }

  onRunComplete(contexts, results) {
    const elapsed = this.startTime ? Date.now() - this.startTime : 0;
    this.log(
      `[==========] Running ${results.numTotalTests} tests from ${results.numTotalTestSuites} test suites.`
    );
    this.log('[----------] Global test environment set-up.');
    this.buffer.forEach(line => this.log(line));
    this.log('[----------] Global test environment tear-down.');
    this.log(
      `[==========] ${results.numTotalTests} tests from ${results.numTotalTestSuites} test suites ran. (${elapsed} ms total)`
    );
    const status = results.numFailedTests === 0 ? 'PASSED' : 'FAILED';
    const summaryCount =
      status === 'PASSED'
        ? results.numPassedTests
        : results.numFailedTests;
    this.log(`[ ${status} ] ${summaryCount} tests.`);
  }
}

module.exports = GTestReporter;
