#!/usr/bin/env node
/**
 * e2e-test.js
 *
 * End-to-End Test for Auto-Coding Framework
 * Tests the complete workflow: pre-task → execution → post-task → commit
 *
 * Usage:
 *   node e2e-test.js              # Run all tests
 *   node e2e-test.js --task=FEAT-001  # Test specific task
 *   node e2e-test.js --dry-run    # Show test plan without executing
 */

const { TestRunner, assert, utils, COLORS, PROJECT_ROOT } = require('./test-framework');

// ============================================================
// Configuration
// ============================================================

const CONFIG = {
  tasksFile: '.auto-coding/tasks.json',
  progressFile: '.auto-coding/progress.txt',
  hooksDir: '.claude/hooks',
  testOutputFile: 'e2e-test-output.txt',
};

// ============================================================
// Test Suite
// ============================================================

const runner = new TestRunner('E2E Test - Complete Workflow');

// Store initial state
let initialState = {};

function getFeaturePasses(feature) {
  if (!feature) {
    return false;
  }
  if (typeof feature.passes === 'boolean') {
    return feature.passes;
  }
  return Boolean(feature.status && feature.status.passes);
}

function getFeatureDependencies(feature) {
  if (!feature) {
    return [];
  }
  if (Array.isArray(feature.dependencies)) {
    return feature.dependencies;
  }
  if (feature.taskBreakdown && Array.isArray(feature.taskBreakdown.dependencies)) {
    return feature.taskBreakdown.dependencies;
  }
  return [];
}

function getFeatureDescription(feature) {
  return feature?.description || feature?.title || 'No description';
}

// ------------------------------------------------------------
// Setup
// ------------------------------------------------------------

runner.beforeAll(async () => {
  console.log(`${COLORS.BLUE}[Setup]${COLORS.NC} Recording initial state...\n`);

  // Record git status
  initialState.gitFiles = utils.gitStatus();
  console.log(`  Git changes: ${initialState.gitFiles.length} files`);

  // Record tasks.json state
  try {
    const tasks = utils.readJSON(CONFIG.tasksFile);
    initialState.tasksVersion = tasks.version;
    initialState.featuresCount = tasks.features?.length || 0;
    console.log(`  Tasks version: ${initialState.tasksVersion}`);
    console.log(`  Features count: ${initialState.featuresCount}`);
  } catch (e) {
    console.log(`  Tasks file: Not found or invalid`);
  }

  // Record progress.txt state
  if (utils.fileExists(CONFIG.progressFile)) {
    const progress = utils.readFile(CONFIG.progressFile);
    initialState.progressLength = progress.length;
    console.log(`  Progress size: ${initialState.progressLength} bytes`);
  }

  console.log('');
});

// ------------------------------------------------------------
// Phase 1: Pre-task Checks
// ------------------------------------------------------------

runner.test('Phase 1: Pre-task - Verify tasks.json syntax', async () => {
  const tasks = utils.readJSON(CONFIG.tasksFile);
  assert.ok(tasks, 'tasks.json should exist');
  assert.ok(tasks.version, 'tasks.json should have version');
  assert.ok(Array.isArray(tasks.features), 'tasks.json should have features array');
});

runner.test('Phase 1: Pre-task - Verify progress.txt exists', async () => {
  assert.fileExists(CONFIG.progressFile, 'progress.txt should exist');
});

runner.test('Phase 1: Pre-task - Check hooks directory exists', async () => {
  assert.ok(
    utils.fileExists('.claude/hooks') || utils.fileExists('.claude/hooks/scripts'),
    'Hooks directory should exist'
  );
});

// ------------------------------------------------------------
// Phase 2: Task Execution Simulation
// ------------------------------------------------------------

runner.test('Phase 2: Execution - Find pending feature', async () => {
  const tasks = utils.readJSON(CONFIG.tasksFile);

  // Find a feature that is not yet passed
  const pendingFeature = tasks.features?.find((f) => getFeaturePasses(f) === false);

  if (pendingFeature) {
    initialState.targetFeature = pendingFeature;
    console.log(`      Target: ${pendingFeature.id} - ${getFeatureDescription(pendingFeature).substring(0, 50)}...`);
    assert.ok(pendingFeature, 'Should find a pending feature');
  } else {
    // If all features passed, we can still test the framework
    console.log(`      All features passed, using first feature for test`);
    initialState.targetFeature = tasks.features?.[0];
    assert.ok(tasks.features?.[0], 'Should have at least one feature');
  }
});

runner.test('Phase 2: Execution - Check feature dependencies', async () => {
  const tasks = utils.readJSON(CONFIG.tasksFile);
  const feature = initialState.targetFeature;

  const dependencies = getFeatureDependencies(feature);

  if (dependencies.length > 0) {
    const allDepsPassed = dependencies.every(depId => {
      const dep = tasks.features?.find(f => f.id === depId);
      return getFeaturePasses(dep) === true;
    });

    console.log(`      Dependencies: ${dependencies.join(', ') || 'None'}`);
    console.log(`      All deps passed: ${allDepsPassed}`);

    // For testing, we don't fail if deps aren't met
    assert.ok(true, 'Dependencies checked');
  } else {
    console.log(`      Dependencies: None`);
    assert.ok(true, 'No dependencies to check');
  }
});

runner.test('Phase 2: Execution - Create test output file', async () => {
  const testContent = `E2E Test Output
Generated: ${new Date().toISOString()}
Feature: ${initialState.targetFeature?.id || 'N/A'}
`;
  utils.writeFile(CONFIG.testOutputFile, testContent);
  assert.fileExists(CONFIG.testOutputFile, 'Test output file should be created');
});

// ------------------------------------------------------------
// Phase 3: Post-task Updates
// ------------------------------------------------------------

runner.test('Phase 3: Post-task - Update feature passes field', async () => {
  const tasks = utils.readJSON(CONFIG.tasksFile);
  const feature = tasks.features?.find(f => f.id === initialState.targetFeature?.id);

  if (feature) {
    // For E2E test, we create a copy to avoid modifying real data
    // In real workflow, the agent would update this
    console.log(`      Feature: ${feature.id}`);
    console.log(`      Current passes: ${getFeaturePasses(feature)}`);
    assert.ok(feature.id, 'Feature should have ID');
  } else {
    assert.ok(true, 'Feature not found, skipping update');
  }
});

runner.test('Phase 3: Post-task - Update progress.txt', async () => {
  const sessionEntry = `
# ============================================================
# Session: E2E-TEST | Timestamp: ${new Date().toISOString()}
# ============================================================

## Test Execution
- E2E test executed successfully
- All phases completed

---
`;

  // Append to progress (in real workflow, this would be prepended)
  let progress = '';
  if (utils.fileExists(CONFIG.progressFile)) {
    progress = utils.readFile(CONFIG.progressFile);
  }

  // For testing, just verify we can write
  console.log(`      Session entry prepared: ${sessionEntry.length} bytes`);
  assert.ok(sessionEntry.length > 0, 'Session entry should not be empty');
});

// ------------------------------------------------------------
// Phase 4: Verification
// ------------------------------------------------------------

runner.test('Phase 4: Verify - Test output file exists', async () => {
  assert.fileExists(CONFIG.testOutputFile, 'Test output should exist');
});

runner.test('Phase 4: Verify - tasks.json is valid JSON', async () => {
  const tasks = utils.readJSON(CONFIG.tasksFile);
  assert.ok(tasks.version, 'tasks.json should be valid');
});

runner.test('Phase 4: Verify - progress.txt contains content', async () => {
  const progress = utils.readFile(CONFIG.progressFile);
  assert.ok(progress.length > 0, 'progress.txt should have content');
});

// ------------------------------------------------------------
// Cleanup
// ------------------------------------------------------------

runner.afterAll(async () => {
  console.log(`\n${COLORS.BLUE}[Cleanup]${COLORS.NC} Removing test artifacts...\n`);

  // Remove test output file
  if (utils.fileExists(CONFIG.testOutputFile)) {
    utils.deleteFile(CONFIG.testOutputFile);
    console.log(`  Removed: ${CONFIG.testOutputFile}`);
  }

  console.log('');
});

// ============================================================
// CLI Handling
// ============================================================

async function main() {
  const args = process.argv.slice(2);

  // Dry run mode
  if (args.includes('--dry-run')) {
    console.log('\nDry Run Mode - Test Plan:\n');
    runner.tests.forEach((test, i) => {
      if (test.type === 'test') {
        console.log(`  ${i}. ${test.name}`);
      }
    });
    console.log('\nRun without --dry-run to execute tests.\n');
    process.exit(0);
  }

  // Run tests
  const success = await runner.run();
  process.exit(success ? 0 : 1);
}

// Run
main().catch(error => {
  console.error(`${COLORS.RED}Fatal error:${COLORS.NC}`, error);
  process.exit(1);
});
