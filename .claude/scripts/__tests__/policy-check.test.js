#!/usr/bin/env node
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const POLICY_SCRIPT = path.join(ROOT_DIR, '.claude/scripts/policy-check.js');
const PHASE_MANIFEST_PATH = path.join(ROOT_DIR, '.claude/context/phase-manifest.json');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

console.log('\npolicy-check.js');
console.log('─'.repeat(40));

test('runs in advisory mode with json output', () => {
  const result = spawnSync('node', [POLICY_SCRIPT, '--json'], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });

  assert.strictEqual(result.status, 0, 'Advisory mode should exit 0');
  assert.ok(result.stdout, 'Expected JSON output');

  const payload = JSON.parse(result.stdout);
  assert.ok(payload.summary, 'Expected summary field');
  assert.ok(Array.isArray(payload.findings), 'Expected findings array');
  assert.ok(typeof payload.summary.errors === 'number', 'Expected numeric errors');
  assert.ok(typeof payload.summary.warnings === 'number', 'Expected numeric warnings');
});

test('supports strict mode with json output', () => {
  const result = spawnSync('node', [POLICY_SCRIPT, '--strict', '--json'], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });

  assert.ok([0, 1].includes(result.status), 'Strict mode should produce deterministic exit status');

  const payload = JSON.parse(result.stdout);
  assert.strictEqual(payload.summary.mode, 'strict');
  assert.ok(Array.isArray(payload.findings), 'Expected findings array');
});

test('suppresses findings with baseline file', () => {
  const firstRun = spawnSync('node', [POLICY_SCRIPT, '--json', '--no-baseline'], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });
  assert.strictEqual(firstRun.status, 0, 'Initial advisory run should succeed');
  const initialPayload = JSON.parse(firstRun.stdout);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policy-baseline-'));
  const baselinePath = path.join(tempDir, 'baseline.json');
  const baseline = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    items: initialPayload.findings.map((f) => ({
      code: f.code,
      file: f.file || '',
      message: f.message
    }))
  };
  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
  const secondRun = spawnSync('node', [POLICY_SCRIPT, '--json', '--baseline', baselinePath], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });
  assert.strictEqual(secondRun.status, 0, 'Baseline run should succeed');
  const payload = JSON.parse(secondRun.stdout);
  assert.strictEqual(payload.summary.errors, 0);
  assert.strictEqual(payload.summary.warnings, 0);
  assert.ok(payload.summary.suppressed >= 0);
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('supports sarif output to stdout', () => {
  const result = spawnSync('node', [POLICY_SCRIPT, '--sarif', '--no-baseline'], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });
  assert.strictEqual(result.status, 0, 'SARIF mode should exit 0');
  const payload = JSON.parse(result.stdout);
  assert.strictEqual(payload.version, '2.1.0');
  assert.ok(Array.isArray(payload.runs), 'Expected runs array');
  assert.ok(payload.runs.length > 0, 'Expected at least one run');
  assert.ok(Array.isArray(payload.runs[0].results), 'Expected SARIF results');
});

test('supports sarif output file', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'policy-sarif-'));
  const outputPath = path.join(tempDir, 'policy.sarif');
  const result = spawnSync('node', [POLICY_SCRIPT, '--sarif', '--sarif-output', outputPath, '--no-baseline'], {
    cwd: ROOT_DIR,
    encoding: 'utf8'
  });
  assert.strictEqual(result.status, 0, 'SARIF file mode should exit 0');
  assert.ok(fs.existsSync(outputPath), 'Expected SARIF output file');
  const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  assert.strictEqual(payload.version, '2.1.0');
  assert.ok(Array.isArray(payload.runs), 'Expected runs array');
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('enforces team-lead files in always_on_context', () => {
  const original = fs.readFileSync(PHASE_MANIFEST_PATH, 'utf8');
  const mutated = JSON.parse(original);
  mutated.always_on_context = { purpose: 'broken', files: ['.claude/rules/04-agent-teams.md'] };
  fs.writeFileSync(PHASE_MANIFEST_PATH, `${JSON.stringify(mutated, null, 2)}\n`, 'utf8');
  try {
    const result = spawnSync('node', [POLICY_SCRIPT, '--json', '--no-baseline'], {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    });
    assert.strictEqual(result.status, 0, 'Advisory mode should still exit 0');
    const payload = JSON.parse(result.stdout);
    const hasFinding = payload.findings.some((f) => (
      f.code === 'CONTEXT_ALWAYS_ON_TEAM_LEAD_MISSING'
      && /team-lead-base/.test(f.message)
    ));
    assert.ok(hasFinding, 'Expected missing team-lead always_on_context finding');
  } finally {
    fs.writeFileSync(PHASE_MANIFEST_PATH, original, 'utf8');
  }
});

console.log('\n' + '═'.repeat(50));
console.log('Test Summary');
console.log('═'.repeat(50));
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log('═'.repeat(50));

if (failed > 0) {
  console.log('\n❌ Some tests failed\n');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed\n');
  process.exit(0);
}
