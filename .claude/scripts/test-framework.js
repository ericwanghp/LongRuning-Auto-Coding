#!/usr/bin/env node
/**
 * test-framework.js
 *
 * Unified test framework for Auto-Coding Framework
 * Provides utilities for E2E testing, assertions, and reporting
 *
 * @module test-framework
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================
// Constants
// ============================================================

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  MAGENTA: '\x1b[35m',
  NC: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
};

const PROJECT_ROOT = path.join(__dirname, '..', '..');

// ============================================================
// Test Runner Class
// ============================================================

class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.startTime = null;
  }

  /**
   * Add a test case
   */
  test(name, fn) {
    this.tests.push({ name, fn, type: 'test' });
  }

  /**
   * Add a beforeAll hook
   */
  beforeAll(fn) {
    this.tests.unshift({ name: 'beforeAll', fn, type: 'hook' });
  }

  /**
   * Add an afterAll hook
   */
  afterAll(fn) {
    this.tests.push({ name: 'afterAll', fn, type: 'hook' });
  }

  /**
   * Run all tests
   */
  async run() {
    this.startTime = Date.now();
    this.printHeader();

    for (const test of this.tests) {
      await this.runTest(test);
    }

    this.printSummary();
    return this.failed === 0;
  }

  async runTest(test) {
    const { name, fn, type } = test;

    try {
      if (type === 'hook') {
        await fn();
      } else {
        console.log(`  ${COLORS.CYAN}▶${COLORS.NC} ${name}`);
        await fn();
        this.passed++;
        console.log(`    ${COLORS.GREEN}✓ PASS${COLORS.NC}`);
      }
    } catch (error) {
      if (type === 'test') {
        this.failed++;
        console.log(`    ${COLORS.RED}✗ FAIL${COLORS.NC}`);
        console.log(`      ${COLORS.RED}${error.message}${COLORS.NC}`);
      } else {
        console.log(`  ${COLORS.RED}Hook ${name} failed: ${error.message}${COLORS.NC}`);
        throw error;
      }
    }
  }

  printHeader() {
    console.log('\n' + COLORS.BOLD + '█'.repeat(60) + COLORS.NC);
    console.log(COLORS.BOLD + `  ${this.name}` + COLORS.NC);
    console.log(COLORS.BOLD + '█'.repeat(60) + COLORS.NC + '\n');
  }

  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('  Test Results');
    console.log('='.repeat(60));
    console.log(`  ${COLORS.GREEN}Passed: ${this.passed}${COLORS.NC}`);
    console.log(`  ${COLORS.RED}Failed: ${this.failed}${COLORS.NC}`);
    console.log(`  ${COLORS.YELLOW}Skipped: ${this.skipped}${COLORS.NC}`);
    console.log(`  ${COLORS.DIM}Duration: ${duration}s${COLORS.NC}`);
    console.log('='.repeat(60) + '\n');

    if (this.failed > 0) {
      console.log(`${COLORS.RED}✗ Tests failed${COLORS.NC}\n`);
    } else {
      console.log(`${COLORS.GREEN}✓ All tests passed${COLORS.NC}\n`);
    }
  }
}

// ============================================================
// Assertion Library
// ============================================================

class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

const assert = {
  /**
   * Assert equality
   */
  equal(actual, expected, message) {
    if (actual !== expected) {
      throw new AssertionError(
        message || `Expected ${expected}, got ${actual}`,
        expected,
        actual
      );
    }
  },

  /**
   * Assert deep equality
   */
  deepEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new AssertionError(
        message || 'Objects are not deeply equal',
        expected,
        actual
      );
    }
  },

  /**
   * Assert truthy value
   */
  ok(value, message) {
    if (!value) {
      throw new AssertionError(message || `Expected truthy value, got ${value}`);
    }
  },

  /**
   * Assert falsy value
   */
  notOk(value, message) {
    if (value) {
      throw new AssertionError(message || `Expected falsy value, got ${value}`);
    }
  },

  /**
   * Assert value is true
   */
  isTrue(value, message) {
    if (value !== true) {
      throw new AssertionError(message || `Expected true, got ${value}`);
    }
  },

  /**
   * Assert value is false
   */
  isFalse(value, message) {
    if (value !== false) {
      throw new AssertionError(message || `Expected false, got ${value}`);
    }
  },

  /**
   * Assert string contains substring
   */
  contains(str, substring, message) {
    if (!str.includes(substring)) {
      throw new AssertionError(
        message || `String does not contain "${substring}"`,
        substring,
        str
      );
    }
  },

  /**
   * Assert array length
   */
  lengthOf(arr, len, message) {
    if (arr.length !== len) {
      throw new AssertionError(
        message || `Expected length ${len}, got ${arr.length}`,
        len,
        arr.length
      );
    }
  },

  /**
   * Assert file exists
   */
  fileExists(filePath, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new AssertionError(message || `File does not exist: ${filePath}`);
    }
  },

  /**
   * Assert file contains
   */
  fileContains(filePath, content, message) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new AssertionError(`File does not exist: ${filePath}`);
    }
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    if (!fileContent.includes(content)) {
      throw new AssertionError(
        message || `File does not contain "${content}"`,
        content,
        '(file content)'
      );
    }
  },

  /**
   * Assert throws
   */
  async throws(fn, message) {
    let threw = false;
    try {
      await fn();
    } catch (e) {
      threw = true;
    }
    if (!threw) {
      throw new AssertionError(message || 'Expected function to throw');
    }
  },

  /**
   * Assert type
   */
  typeOf(value, type, message) {
    const actualType = typeof value;
    if (actualType !== type) {
      throw new AssertionError(
        message || `Expected type ${type}, got ${actualType}`,
        type,
        actualType
      );
    }
  },
};

// ============================================================
// Utility Functions
// ============================================================

const utils = {
  /**
   * Execute shell command
   */
  exec(cmd, options = {}) {
    try {
      return execSync(cmd, {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        timeout: options.timeout || 30000,
        ...options,
      });
    } catch (error) {
      if (options.allowFail) {
        return error.stdout || error.message;
      }
      throw error;
    }
  },

  /**
   * Read JSON file
   */
  readJSON(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  },

  /**
   * Write JSON file
   */
  writeJSON(filePath, data) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  },

  /**
   * Read text file
   */
  readFile(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    return fs.readFileSync(fullPath, 'utf8');
  },

  /**
   * Write text file
   */
  writeFile(filePath, content) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    fs.writeFileSync(fullPath, content, 'utf8');
  },

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    return fs.existsSync(fullPath);
  },

  /**
   * Delete file
   */
  deleteFile(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  },

  /**
   * Get git status
   */
  gitStatus() {
    return this.exec('git status --porcelain').trim().split('\n').filter(Boolean);
  },

  /**
   * Git add
   */
  gitAdd(files) {
    const fileList = Array.isArray(files) ? files.join(' ') : files;
    return this.exec(`git add ${fileList}`);
  },

  /**
   * Git commit
   */
  gitCommit(message) {
    return this.exec(`git commit -m "${message}"`);
  },

  /**
   * Get current branch
   */
  gitBranch() {
    return this.exec('git branch --show-current').trim();
  },

  /**
   * Get last commit hash
   */
  gitLastCommit() {
    return this.exec('git log -1 --oneline').trim();
  },

  /**
   * Create temporary test file
   */
  createTempFile(content, prefix = 'test-') {
    const tempPath = path.join(PROJECT_ROOT, `${prefix}${Date.now()}.tmp`);
    fs.writeFileSync(tempPath, content, 'utf8');
    return tempPath;
  },

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Log with color
   */
  log(msg, color = 'NC') {
    console.log(`${COLORS[color] || ''}${msg}${COLORS.NC}`);
  },
};

// ============================================================
// Test Strategy Loader
// ============================================================

const strategy = {
  /**
   * Load test strategy configuration
   */
  load() {
    // First check for project-specific config
    const projectConfigPath = path.join(PROJECT_ROOT, '.auto-coding/config/test-strategy.json');
    if (fs.existsSync(projectConfigPath)) {
      return JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
    }

    // Fall back to default
    return this.getDefaultStrategy();
  },

  /**
   * Get strategy for task type and scale
   */
  getForTask(taskType, scale = 'medium') {
    const config = this.load();
    const typeConfig = config.taskTypes?.[taskType] || config.taskTypes?.backend;
    return typeConfig?.strategies?.[scale] || typeConfig?.strategies?.medium;
  },

  /**
   * Get default strategy
   */
  getDefaultStrategy() {
    return {
      taskTypes: {
        backend: {
          name: 'Backend Development',
          strategies: {
            small: { tests: ['unit'], execution: 'local', timeLimit: '30s' },
            medium: { tests: ['unit', 'integration'], execution: 'local', timeLimit: '2m' },
            large: { tests: ['unit', 'integration', 'e2e'], execution: 'ci', timeLimit: '10m' },
          },
        },
      },
    };
  },
};

// ============================================================
// Exports
// ============================================================

module.exports = {
  TestRunner,
  assert,
  utils,
  strategy,
  COLORS,
  PROJECT_ROOT,
};

// CLI usage
if (require.main === module) {
  console.log(`
${COLORS.BOLD}Test Framework${COLORS.NC}

Usage:
  node test-framework.js <command>

Commands:
  strategy [taskType] [scale]  Show test strategy
  help                         Show this help

Examples:
  node test-framework.js strategy backend medium
  node test-framework.js strategy frontend large
`);
}
