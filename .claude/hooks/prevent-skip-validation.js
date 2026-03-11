#!/usr/bin/env node
/**
 * prevent-skip-validation.js
 *
 * PreToolUse hook for Bash commands
 * Warns when commands attempt to skip validation, testing, or verification steps
 *
 * Trigger: PreToolUse with matcher "Bash"
 * Input: { tool: "Bash", input: { command: "..." } }
 */

const ROOT_DIR = require('path').resolve(__dirname, '../../');

// Patterns that indicate skipping validation
const SKIP_PATTERNS = [
  // Skip test patterns
  { pattern: /(--skip-tests?|--no-tests?|skipAllTests)/i, message: 'Skipping tests is not recommended' },
  { pattern: /(npm\s+test.*--skip|yarn\s+test.*--skip)/i, message: 'Skipping tests is not recommended' },
  { pattern: /SKIP_TESTS?\s*=\s*true/i, message: 'Setting SKIP_TESTS is not recommended' },

  // Skip validation patterns
  { pattern: /(--skip-validation|--no-validate|--skip-check)/i, message: 'Skipping validation is not recommended' },
  { pattern: /NO_VALIDATE\s*=\s*true/i, message: 'Setting NO_VALIDATE is not recommended' },

  // Skip lint patterns
  { pattern: /(--no-lint|--skip-lint)/i, message: 'Skipping linting is not recommended' },

  // Force patterns that skip checks
  { pattern: /npm\s+(install|i)\s+.*--force/i, message: 'Using --force may skip important checks' },
  { pattern: /yarn\s+install.*--force/i, message: 'Using --force may skip important checks' },

  // Git patterns that skip verification
  { pattern: /git\s+push.*--no-verify/i, message: 'Using --no-verify skips pre-push hooks' },
  { pattern: /git\s+commit.*--no-verify/i, message: 'Using --no-verify skips pre-commit hooks' },

  // CI/CD skip patterns
  { pattern: /\[skip\s+ci\]|\[ci\s+skip\]/i, message: 'Skipping CI is not recommended for quality assurance' }
];

// Exemption patterns - commands that are legitimately allowed to skip
const EXEMPTION_PATTERNS = [
  /npm\s+run\s+build/i,  // Build scripts may have --skip-tests for production builds
  /docker\s+build/i,      // Docker builds often skip tests
  /husky\s+install/i,     // Husky install is fine
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[34m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.error(`${colors[type] || ''}${message}${colors.reset}`);
}

function checkCommand(command) {
  // Check exemptions first
  for (const exemption of EXEMPTION_PATTERNS) {
    if (exemption.test(command)) {
      return { shouldWarn: false };
    }
  }

  // Check skip patterns
  for (const { pattern, message } of SKIP_PATTERNS) {
    if (pattern.test(command)) {
      return {
        shouldWarn: true,
        message,
        matchedPattern: pattern.source
      };
    }
  }

  return { shouldWarn: false };
}

async function main() {
  try {
    // Read hook input from stdin
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString('utf8');

    if (!input) {
      process.exit(0);
    }

    const hookData = JSON.parse(input);
    const command = hookData.input?.command || '';

    if (!command) {
      process.exit(0);
    }

    const result = checkCommand(command);

    if (result.shouldWarn) {
      log('\n⚠️  Warning: ' + result.message, 'warning');
      log('   Command: ' + command, 'info');
      log('   The framework recommends running all validation steps.\n', 'info');
      log('   If this is intentional, you can proceed.\n', 'info');
    }

    // Always exit 0 - we only warn, don't block
    process.exit(0);
  } catch (error) {
    // On error, allow the command to proceed
    process.exit(0);
  }
}

main();
