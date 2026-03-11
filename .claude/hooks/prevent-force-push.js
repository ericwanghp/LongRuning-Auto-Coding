#!/usr/bin/env node
/**
 * prevent-force-push.js
 *
 * PreToolUse hook for Bash commands
 * Blocks git force push to protected branches (main, master, develop)
 *
 * Trigger: PreToolUse with matcher "Bash"
 * Input: { tool: "Bash", input: { command: "..." } }
 */

const ROOT_DIR = require('path').resolve(__dirname, '../../');

// Protected branches that cannot be force pushed
const PROTECTED_BRANCHES = ['main', 'master', 'develop', 'staging', 'production'];

// Pattern to detect force push
const FORCE_PUSH_PATTERN = /git\s+push.*(-f|--force|--force-with-lease)/i;

// Pattern to extract branch from push command
const BRANCH_PATTERN = /git\s+push.*?(?:origin|upstream)\s+(\S+)/i;

function isProtectedBranch(command) {
  // Check if it's pushing to a protected branch
  const branchMatch = command.match(BRANCH_PATTERN);
  if (branchMatch) {
    const branch = branchMatch[1];
    return PROTECTED_BRANCHES.includes(branch);
  }

  // If no specific branch mentioned, check current branch
  try {
    const { execSync } = require('child_process');
    const currentBranch = execSync('git branch --show-current', {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    }).trim();

    return PROTECTED_BRANCHES.includes(currentBranch);
  } catch (e) {
    // If we can't determine the branch, assume it's protected
    return true;
  }
}

function isForcePush(command) {
  return FORCE_PUSH_PATTERN.test(command);
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[34m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.error(`${colors[type] || ''}${message}${colors.reset}`);
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

    // Check if this is a force push
    if (isForcePush(command) && isProtectedBranch(command)) {
      log('\n❌ Blocked: Force push to protected branch', 'error');
      log('   Command: ' + command, 'info');
      log('   Protected branches: ' + PROTECTED_BRANCHES.join(', '), 'info');
      log('\n   Force push is not allowed on protected branches.', 'warning');
      log('   Use regular git push instead.\n', 'warning');

      // Exit with error to block the command
      process.exit(2);
    }

    // Allow the command
    process.exit(0);
  } catch (error) {
    // On error, allow the command to proceed
    process.exit(0);
  }
}

main();
