---
name: systematic-debugging
description: "Phase 5-6 of Auto-Coding Framework. Use when encountering any bug, test failure, or unexpected behavior, BEFORE proposing fixes. Always find root cause first."
phase: "5-6"
triggers:
  - Test failures
  - Bugs in production
  - Unexpected behavior
  - Performance problems
  - Build failures
  - Integration issues
---

# Systematic Debugging

## Overview

**Phase 5-6 of Auto-Coding Framework**

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## The Four Phases

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - They often contain the exact solution
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - `git diff`, recent commits
   - New dependencies, config changes
   - Environmental differences

4. **Trace Data Flow**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

1. **Find Working Examples**
   - Locate similar working code in same codebase
   - What works that's similar to what's broken?

2. **Compare Against References**
   - Read reference implementation COMPLETELY
   - Don't skim - read every line

3. **Identify Differences**
   - What's different between working and broken?
   - List every difference, however small

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change
   - One variable at a time
   - Don't fix multiple things at once

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

### Phase 4: Implementation

1. **Create Failing Test Case**
   - Simplest possible reproduction
   - **REQUIRED:** Use tdd-enforcement skill

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time

3. **Verify Fix**
   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1
   - **If ≥ 3: Question the architecture (see below)**

5. **If 3+ Fixes Failed: Question Architecture**

   Stop and discuss with user:
   - Is this pattern fundamentally sound?
   - Should we refactor architecture vs. continue fixing symptoms?

## Red Flags - STOP and Follow Process

| Red Flag | Meaning |
|----------|---------|
| "Quick fix for now, investigate later" | Do it right from the start |
| "Just try changing X and see if it works" | Return to Phase 1 |
| "Add multiple changes, run tests" | One variable at a time |
| "Skip the test, I'll manually verify" | Create automated test |
| "It's probably X, let me fix that" | Investigate first |
| Proposing solutions before tracing data flow | Trace first |
| "One more fix attempt" (when already tried 2+) | Question architecture |

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too |
| "Emergency, no time for process" | Systematic debugging is FASTER |
| "Just try this first, then investigate" | Do it right from the start |
| "I'll write test after confirming fix works" | Untested fixes don't stick |
| "Multiple fixes at once saves time" | Can't isolate what worked |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs |

## Blockage Recording

If blocked, record in tasks.json:

```json
{
  "status": {
    "status": "blocked",
    "blockReason": {
      "type": "debugging",
      "description": "Unable to find root cause after X attempts",
      "tried": ["approach 1", "approach 2", "approach 3"],
      "needsHelp": "Architecture review or additional context"
    }
  }
}
```
