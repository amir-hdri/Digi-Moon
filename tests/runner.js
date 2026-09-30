#!/usr/bin/env node

/**
 * Executable Test Runner for Dijimoon Storefront
 * Evaluates Tiers 1-4 requirement-driven opaque tests.
 * Usage:
 *   node tests/runner.js           # Run all 4 tiers
 *   node tests/runner.js tier1     # Run only Tier 1
 *   node tests/runner.js tier2     # Run only Tier 2
 *   node tests/runner.js tier3     # Run only Tier 3
 *   node tests/runner.js tier4     # Run only Tier 4
 */

import { pathToFileURL } from 'node:url';
import * as path from 'node:path';
import { register } from 'node:module';
import { TestRegistry } from './harness.ts';

// Resolve the `@/` tsconfig alias for specs that import real app modules.
register('./alias-hooks.mjs', pathToFileURL(path.join(process.cwd(), 'tests', 'runner.js')));

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

async function main() {
  const args = process.argv.slice(2);
  const targetFilter = args[0] ? args[0].toLowerCase() : null;

  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  DIJIMOON E2E TEST RUNNER — OPAQUE REQUIREMENT VERIFICATION  ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  const rootDir = process.cwd();
  const testFiles = [
    { tier: 'tier1', path: path.join(rootDir, 'tests', 'e2e', 'tier1_feature_coverage.spec.ts') },
    { tier: 'tier2', path: path.join(rootDir, 'tests', 'e2e', 'tier2_boundary_corner.spec.ts') },
    { tier: 'tier3', path: path.join(rootDir, 'tests', 'e2e', 'tier3_pairwise_combinations.spec.ts') },
    { tier: 'tier4', path: path.join(rootDir, 'tests', 'e2e', 'tier4_real_world_scenarios.spec.ts') },
    { tier: 'tier5', path: path.join(rootDir, 'tests', 'e2e', 'tier5_shared_foundations.spec.ts') },
  ];

  // Load test suites
  for (const file of testFiles) {
    if (!targetFilter || targetFilter === file.tier || targetFilter === 'all') {
      try {
        await import(pathToFileURL(file.path).href);
      } catch (err) {
        console.error(`${colors.red}Error loading spec file ${file.path}:${colors.reset}`, err);
        process.exit(1);
      }
    }
  }

  const allTests = TestRegistry.getInstance().getTests();
  const filteredTests = targetFilter && targetFilter !== 'all'
    ? allTests.filter((t) => t.tier === targetFilter)
    : allTests;

  if (filteredTests.length === 0) {
    console.log(`${colors.yellow}No tests matched the filter "${targetFilter}".${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.dim}Executing ${filteredTests.length} test cases across requested tiers...${colors.reset}\n`);

  const results = [];
  let currentGroup = '';
  let currentTier = '';
  const startTime = Date.now();

  const tierNames = {
    tier1: 'Tier 1: Feature Coverage (Core Requirements)',
    tier2: 'Tier 2: Boundary & Corner Cases (Extreme Inputs)',
    tier3: 'Tier 3: Cross-Feature Combinations (Pairwise)',
    tier4: 'Tier 4: Real-World Application Scenarios (E2E Flows)',
  };

  for (const t of filteredTests) {
    if (t.tier !== currentTier) {
      currentTier = t.tier;
      console.log(`\n${colors.bold}${colors.magenta}▶ ${tierNames[currentTier] || currentTier.toUpperCase()}${colors.reset}`);
      console.log(`${colors.dim}──────────────────────────────────────────────────────────────────────${colors.reset}`);
    }

    if (t.groupName !== currentGroup) {
      currentGroup = t.groupName;
      console.log(`\n  ${colors.bold}${currentGroup}${colors.reset}`);
    }

    const tStart = Date.now();
    let passed = false;
    let error;

    try {
      await t.fn();
      passed = true;
    } catch (err) {
      passed = false;
      error = err;
    }
    const durationMs = Date.now() - tStart;

    results.push({
      name: t.name,
      groupName: t.groupName,
      tier: t.tier,
      passed,
      durationMs,
      error,
    });

    const statusBadge = passed
      ? `${colors.green}  ✓${colors.reset}`
      : `${colors.red}  ✗${colors.reset}`;
    const durationText = `${colors.dim}(${durationMs}ms)${colors.reset}`;

    console.log(`${statusBadge} ${t.name} ${durationText}`);

    if (!passed && error) {
      console.log(`\n      ${colors.red}${colors.bold}Assertion Failure:${colors.reset} ${colors.red}${error.message}${colors.reset}`);
      if (error.stack) {
        const stackLines = error.stack
          .split('\n')
          .slice(1, 4)
          .map((line) => `      ${colors.dim}${line.trim()}${colors.reset}`)
          .join('\n');
        console.log(stackLines);
      }
      console.log();
    }
  }

  const totalTime = Date.now() - startTime;
  const totalPassed = results.filter((r) => r.passed).length;
  const totalFailed = results.filter((r) => !r.passed).length;

  // Breakdown by Tier
  const tiers = ['tier1', 'tier2', 'tier3', 'tier4'];
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}                         TEST EXECUTION SUMMARY                       ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}`);

  for (const tier of tiers) {
    const tierResults = results.filter((r) => r.tier === tier);
    if (tierResults.length === 0) continue;
    const tierPassed = tierResults.filter((r) => r.passed).length;
    const tierFailed = tierResults.filter((r) => !r.passed).length;
    const rate = ((tierPassed / tierResults.length) * 100).toFixed(0);
    const color = tierFailed === 0 ? colors.green : colors.red;
    console.log(
      `  ${tier.padEnd(8)} : ${color}${tierPassed}/${tierResults.length} passed (${rate}%)${colors.reset}`
    );
  }

  console.log(`${colors.dim}──────────────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.bold}Total Test Cases : ${results.length}${colors.reset}`);
  console.log(`  ${colors.bold}Passed           : ${colors.green}${totalPassed}${colors.reset}`);
  console.log(`  ${colors.bold}Failed           : ${totalFailed > 0 ? colors.red : colors.green}${totalFailed}${colors.reset}`);
  console.log(`  ${colors.bold}Execution Time   : ${totalTime} ms${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  if (totalFailed > 0) {
    console.log(`${colors.bold}${colors.red}❌ RUN FAILED WITH ${totalFailed} ERROR(S)${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.bold}${colors.green}✅ ALL ${results.length} TESTS PASSED CLEANLY${colors.reset}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal runner crash:', err);
  process.exit(1);
});
