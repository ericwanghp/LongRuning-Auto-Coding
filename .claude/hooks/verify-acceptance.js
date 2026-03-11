#!/usr/bin/env node
/**
 * verify-acceptance.js
 *
 * Acceptance criteria verification reminder
 * Note: Task acceptance criteria is now defined by native TaskCreate,
 * please use TaskList to view
 */

function verifyAcceptance() {
  console.log('\n=== Acceptance Criteria Verification Reminder ===');
  console.log('');
  console.log('Task acceptance criteria is now managed by native Claude Code tools:');
  console.log('');
  console.log('1. Use TaskList to view task details and acceptance criteria');
  console.log('2. Use TaskUpdate(status: "completed") to mark task complete');
  console.log('');
  console.log('Acceptance checklist:');
  console.log('  [ ] All unit tests pass');
  console.log('  [ ] Integration tests pass (if applicable)');
  console.log('  [ ] Code review completed (if required)');
  console.log('  [ ] Feature works as expected');
  console.log('  [ ] No blocking issues');
  console.log('');
  console.log('After completion:');
  console.log('  1. Update .auto-coding/progress.txt to record progress');
  console.log('  2. Use git commit to commit changes');
  console.log('');

  return true;
}

// Export function
module.exports = { verifyAcceptance };

// If run directly
if (require.main === module) {
  const success = verifyAcceptance();
  process.exit(success ? 0 : 1);
}
