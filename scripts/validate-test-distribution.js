#!/usr/bin/env node

/**
 * Validate Test Distribution Script
 *
 * Constitution v2.0.0 requires:
 * - Integration tests: 60-70% of test suite
 * - E2E tests: 20-30% of test suite
 * - Unit tests: 10-20% of test suite
 *
 * This script validates that the test distribution meets constitutional requirements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function countTestFiles(pattern, directory) {
  try {
    const result = execSync(
      `find ${directory} -type f \\( -name "${pattern}" \\)`,
      { encoding: 'utf-8' }
    );
    const files = result.trim().split('\n').filter(Boolean);
    return files.length;
  } catch (error) {
    return 0;
  }
}

function validateDistribution() {
  log('\n=== Constitution v2.0.0: Test Distribution Validation ===\n', 'cyan');

  // Count test files
  const integrationTests = countTestFiles('*.test.js', 'src/__integration__');
  const e2eTests = countTestFiles('*.spec.js', 'e2e');
  const unitTests = countTestFiles('*.test.js', 'src/__test__');

  const totalTests = integrationTests + e2eTests + unitTests;

  if (totalTests === 0) {
    log('⚠️  No tests found. Create tests to validate distribution.', 'yellow');
    return;
  }

  // Calculate percentages
  const integrationPercent = ((integrationTests / totalTests) * 100).toFixed(1);
  const e2ePercent = ((e2eTests / totalTests) * 100).toFixed(1);
  const unitPercent = ((unitTests / totalTests) * 100).toFixed(1);

  // Display counts
  log(`Integration Tests: ${integrationTests} (${integrationPercent}%)`);
  log(`E2E Tests: ${e2eTests} (${e2ePercent}%)`);
  log(`Unit Tests: ${unitTests} (${unitPercent}%)`);
  log(`Total Tests: ${totalTests}\n`);

  // Validate against constitutional requirements
  let passed = true;

  // Integration tests: 60-70%
  if (integrationPercent < 60 || integrationPercent > 70) {
    log(`❌ FAIL: Integration tests should be 60-70% (currently ${integrationPercent}%)`, 'red');
    passed = false;
  } else {
    log(`✅ PASS: Integration tests are ${integrationPercent}% (target: 60-70%)`, 'green');
  }

  // E2E tests: 20-30%
  if (e2ePercent < 20 || e2ePercent > 30) {
    log(`❌ FAIL: E2E tests should be 20-30% (currently ${e2ePercent}%)`, 'red');
    passed = false;
  } else {
    log(`✅ PASS: E2E tests are ${e2ePercent}% (target: 20-30%)`, 'green');
  }

  // Unit tests: 10-20%
  if (unitPercent < 10 || unitPercent > 20) {
    log(`❌ FAIL: Unit tests should be 10-20% (currently ${unitPercent}%)`, 'red');
    passed = false;
  } else {
    log(`✅ PASS: Unit tests are ${unitPercent}% (target: 10-20%)`, 'green');
  }

  log('');

  if (passed) {
    log('🎉 Test distribution meets constitutional requirements!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Test distribution does not meet constitutional requirements', 'yellow');
    log('   Adjust your test strategy to align with integration-first testing principles', 'yellow');
    process.exit(1);
  }
}

validateDistribution();
