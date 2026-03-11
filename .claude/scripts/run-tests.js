#!/usr/bin/env node
/**
 * run-tests.js
 *
 * Main test runner for Auto-Coding Framework
 * Run: node .claude/scripts/run-tests.js
 *
 * Options:
 *   --hooks       Run hook tests only
 *   --config      Run config validation only
 *   --policy      Run policy consistency checks only
 *   --all         Run all tests (default)
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const TESTS_DIR = path.join(ROOT_DIR, '.claude/scripts/__tests__');

const args = process.argv.slice(2);
const runAll = args.length === 0 || args.includes('--all');
const runHooks = args.includes('--hooks');
const runConfig = args.includes('--config');
const runPolicy = args.includes('--policy');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         Auto-Coding Framework - Test Runner                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let totalPassed = true;

if (runAll || runHooks) {
  console.log('📋 Running Hook Tests...\n');
  try {
    execSync(`node ${path.join(TESTS_DIR, 'hooks.test.js')}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
  } catch (e) {
    totalPassed = false;
  }
}

if (runAll || runConfig) {
  console.log('\n📋 Running Config Validation...\n');
  try {
    execSync(`node ${path.join(TESTS_DIR, 'validate-config.js')}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
  } catch (e) {
    totalPassed = false;
  }
}

if (runAll || runPolicy) {
  console.log('\n📋 Running Policy Checks...\n');
  try {
    execSync(`node ${path.join(TESTS_DIR, 'policy-check.test.js')}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
  } catch (e) {
    totalPassed = false;
  }
}

console.log('\n' + '═'.repeat(60));
if (totalPassed) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}
