const fs = require('fs');
const path = require('path');

const reportDir = path.resolve('reports');

const suites = [
  {
    key: 'server-regression',
    name: 'Server Regression (17 tests)',
    resultPath: path.join(reportDir, 'server-regression.json'),
    coveragePath: null
  },
  {
    key: 'server-full',
    name: 'Server Full Suite (58 tests)',
    resultPath: path.join(reportDir, 'server-full.json'),
    coveragePath: path.resolve('server/coverage-full/coverage-final.json')
  },
  {
    key: 'client',
    name: 'Client UI Suite (11 tests)',
    resultPath: path.join(reportDir, 'client.json'),
    coveragePath: path.resolve('client/coverage/coverage-final.json')
  }
];

const readJson = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required report not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const computeCoveragePercentages = coverageData => {
  const totals = {
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 }
  };

  Object.values(coverageData).forEach(file => {
    const statements = file.s || {};
    totals.statements.covered += Object.values(statements).filter(v => v > 0)
      .length;
    totals.statements.total += Object.keys(statements).length;

    const branches = file.b || {};
    Object.values(branches).forEach(branchHits => {
      totals.branches.total += branchHits.length;
      totals.branches.covered += branchHits.filter(v => v > 0).length;
    });

    const functions = file.f || {};
    totals.functions.covered += Object.values(functions).filter(v => v > 0)
      .length;
    totals.functions.total += Object.keys(functions).length;

  });

  const pct = metric =>
    metric.total > 0 ? (metric.covered / metric.total) * 100 : 0;

  return {
    statements: pct(totals.statements),
    branches: pct(totals.branches),
    functions: pct(totals.functions),
    lines: pct(totals.statements)
  };
};

const buildSummary = () => {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const rows = [];
  rows.push('## Test Suites');
  rows.push('');
  rows.push('| Suite | Tests | Passed | Failed | Duration (s) | Statements % |');
  rows.push('| --- | ---: | ---: | ---: | ---: | ---: |');

  const suiteSummaries = suites.map(suite => {
    const result = readJson(suite.resultPath);
    const coverageSummary =
      suite.coveragePath && fs.existsSync(suite.coveragePath)
        ? computeCoveragePercentages(readJson(suite.coveragePath))
        : null;

    const runtimeMs = Array.isArray(result.testResults)
      ? result.testResults.reduce(
          (total, testFile) => {
            if (testFile.perfStats && testFile.perfStats.runtime) {
              return total + testFile.perfStats.runtime;
            }
            if (
              typeof testFile.startTime === 'number' &&
              typeof testFile.endTime === 'number'
            ) {
              return total + (testFile.endTime - testFile.startTime);
            }
            return total;
          },
          0
        )
      : 0;

    const suiteData = {
      key: suite.key,
      name: suite.name,
      totalTests: result.numTotalTests,
      passed: result.numPassedTests,
      failed: result.numFailedTests,
      pending: result.numPendingTests,
      runtimeMs,
      coverage: coverageSummary || null
    };

    const durationSec = (suiteData.runtimeMs / 1000).toFixed(2);
    const statementPct = suiteData.coverage
      ? `${suiteData.coverage.statements.toFixed(1)}%`
      : '—';

    rows.push(
      `| ${suiteData.name} | ${suiteData.totalTests} | ${suiteData.passed} | ${suiteData.failed} | ${durationSec} | ${statementPct} |`
    );

    return suiteData;
  });

  const metadata = {
    generatedAt: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || null,
    workflow: process.env.GITHUB_WORKFLOW || null,
    runId: process.env.GITHUB_RUN_ID || null,
    suites: suiteSummaries
  };

  const summaryPath = path.join(reportDir, 'test-summary.md');
  const metricsPath = path.join(reportDir, 'test-metrics.json');

  fs.writeFileSync(summaryPath, `${rows.join('\n')}\n`, 'utf8');
  fs.writeFileSync(metricsPath, JSON.stringify(metadata, null, 2), 'utf8');

  console.log(`Wrote summary to ${summaryPath}`);
  console.log(`Wrote metrics to ${metricsPath}`);
};

try {
  buildSummary();
} catch (error) {
  console.error(error);
  process.exit(1);
}
