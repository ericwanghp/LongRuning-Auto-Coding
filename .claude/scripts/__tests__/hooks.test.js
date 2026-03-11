#!/usr/bin/env node
/**
 * hooks.test.js
 *
 * Unit tests for Auto-Coding Framework hook scripts
 * Run: node .claude/scripts/__tests__/hooks.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const HOOKS_DIR = path.join(ROOT_DIR, '.claude/hooks');

// Test results tracking
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

function group(name) {
  console.log(`\n${name}`);
  console.log('─'.repeat(40));
}

// ============================================================
// Test: prevent-skip-validation.js
// ============================================================
group('prevent-skip-validation.js');

test('should detect --skip-tests pattern', () => {
  const patterns = [
    'npm test --skip-tests',
    'npm run build --skip-validation',
    'SKIP_TEST=true npm start',
    'git push --no-verify',
    'npm install --force',
    '[skip ci] commit message'
  ];

  const skipPattern = /(--skip-tests?|--no-tests?|skipAllTests|SKIP_TESTS?\s*=\s*true|--skip-validation|--no-validate|--skip-check|--no-lint|--skip-lint|npm\s+(install|i)\s+.*--force|yarn\s+install.*--force|git\s+push.*--no-verify|git\s+commit.*--no-verify|\[skip\s+ci\]|\[ci\s+skip\])/i;

  patterns.forEach(cmd => {
    assert.ok(skipPattern.test(cmd), `Should detect: ${cmd}`);
  });
});

test('should not flag normal commands', () => {
  const normalCommands = [
    'npm test',
    'npm run build',
    'git push origin main',
    'npm install express',
    'git commit -m "feat: new feature"'
  ];

  const skipPattern = /(--skip-tests?|--no-tests?|skipAllTests|SKIP_TESTS?\s*=\s*true|--skip-validation|--no-validate|--skip-check|--no-lint|--skip-lint|npm\s+(install|i)\s+.*--force|yarn\s+install.*--force|git\s+push.*--no-verify|git\s+commit.*--no-verify|\[skip\s+ci\]|\[ci\s+skip\])/i;

  normalCommands.forEach(cmd => {
    assert.ok(!skipPattern.test(cmd), `Should NOT flag: ${cmd}`);
  });
});

test('hook file exists', () => {
  assert.ok(fs.existsSync(path.join(HOOKS_DIR, 'prevent-skip-validation.js')));
});

// ============================================================
// Test: prevent-force-push.js
// ============================================================
group('prevent-force-push.js');

test('should detect force push patterns', () => {
  const forceCommands = [
    'git push -f origin main',
    'git push --force origin main',
    'git push --force-with-lease origin main'
  ];

  const forcePattern = /git\s+push.*(-f|--force|--force-with-lease)/i;

  forceCommands.forEach(cmd => {
    assert.ok(forcePattern.test(cmd), `Should detect: ${cmd}`);
  });
});

test('should not flag normal push', () => {
  const normalCommands = [
    'git push origin main',
    'git push origin feature-branch',
    'git push'
  ];

  const forcePattern = /git\s+push.*(-f|--force|--force-with-lease)/i;

  normalCommands.forEach(cmd => {
    assert.ok(!forcePattern.test(cmd), `Should NOT flag: ${cmd}`);
  });
});

test('hook file exists', () => {
  assert.ok(fs.existsSync(path.join(HOOKS_DIR, 'prevent-force-push.js')));
});

// ============================================================
// Test: hooks.json configuration
// ============================================================
group('hooks.json configuration');

test('hooks.json is valid JSON', () => {
  const hooksPath = path.join(HOOKS_DIR, 'hooks.json');
  const content = fs.readFileSync(hooksPath, 'utf8');
  const config = JSON.parse(content);
  assert.ok(config.hooks, 'Should have hooks property');
});

test('PreToolUse hooks are configured', () => {
  const hooksPath = path.join(HOOKS_DIR, 'hooks.json');
  const config = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
  assert.ok(config.hooks.PreToolUse, 'Should have PreToolUse hooks');
  assert.ok(Array.isArray(config.hooks.PreToolUse), 'PreToolUse should be array');
});

test('all configured hook files exist', () => {
  const hooksPath = path.join(HOOKS_DIR, 'hooks.json');
  const config = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const allHooks = [];
  Object.values(config.hooks).forEach(hookArray => {
    hookArray.forEach(hookConfig => {
      if (hookConfig.hooks) {
        hookConfig.hooks.forEach(hookCmd => {
          const match = hookCmd.match(/node\s+\.claude\/hooks\/(\S+\.js)/);
          if (match) {
            allHooks.push(match[1]);
          }
        });
      }
    });
  });

  allHooks.forEach(hookFile => {
    const hookPath = path.join(HOOKS_DIR, hookFile);
    assert.ok(fs.existsSync(hookPath), `Hook file should exist: ${hookFile}`);
  });
});

// ============================================================
// Test: read-context.js
// ============================================================
group('read-context.js');

test('hook file exists', () => {
  assert.ok(fs.existsSync(path.join(HOOKS_DIR, 'read-context.js')));
});

test('can load read-context module', () => {
  // Just verify the file can be read
  const content = fs.readFileSync(path.join(HOOKS_DIR, 'read-context.js'), 'utf8');
  assert.ok(content.includes('PreToolUse') || content.includes('read-context'), 'Should be a valid hook script');
});

test('reads last session from large progress file', () => {
  const { getLastSessionFromProgress } = require(path.join(HOOKS_DIR, 'read-context.js'));
  const tempFile = path.join(os.tmpdir(), `progress-${Date.now()}.txt`);
  const oldBlock = '# Session: OLD\nfoo\n---\n';
  const newBlock = '# Session: NEW\nbar\n---\n';
  const payload = `${'x'.repeat(70000)}${oldBlock}${newBlock}`;
  fs.writeFileSync(tempFile, payload, 'utf8');
  const result = getLastSessionFromProgress(tempFile, 65536);
  assert.ok(result.lastSession.includes('# Session: NEW'));
  fs.unlinkSync(tempFile);
});

// ============================================================
// Test: verify-acceptance.js
// ============================================================
group('verify-acceptance.js');

test('hook file exists', () => {
  assert.ok(fs.existsSync(path.join(HOOKS_DIR, 'verify-acceptance.js')));
});

// ============================================================
// Test: verify-git-commit.js
// ============================================================
group('verify-git-commit.js');

test('hook file exists', () => {
  assert.ok(fs.existsSync(path.join(HOOKS_DIR, 'verify-git-commit.js')));
});

// ============================================================
// Summary
// ============================================================
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
