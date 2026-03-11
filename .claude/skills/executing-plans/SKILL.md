---
name: executing-plans
description: "Phase 5 of Auto-Coding Framework. Use when you have a written implementation plan to execute. Load plan, review critically, execute tasks in batches, report for review between batches."
phase: "5"
triggers:
  - Implementation plan exists in docs/plans/
  - tasks.json with task breakdown
  - Starting development work
---

# Executing Plans

## Overview

**Phase 5 of Auto-Coding Framework**

Load plan, review critically, execute tasks in batches, report for review between batches.

**Core principle:** Batch execution with checkpoints for review.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 1: Load and Review Plan

1. Read plan file (e.g., `docs/plans/YYYY-MM-DD-feature.md`)
2. Review critically - identify any questions or concerns
3. If concerns: Raise them with user before starting
4. If no concerns: Create TodoWrite and proceed

### Step 2: Execute Batch

**Default: First 3 tasks**

For each task:
1. Mark as `in_progress` in TodoWrite
2. Follow each step exactly as written in plan
3. Run verifications as specified
4. Mark as `completed`

### Step 3: Report

When batch complete:
- Show what was implemented
- Show verification output (tests, linter, etc.)
- Say: "Ready for feedback."

### Step 4: Continue

Based on feedback:
- Apply changes if needed
- Execute next batch
- Repeat until complete

### Step 5: Complete Development

After all tasks complete and verified:

1. Update `tasks.json`:
   - Set `status.passes: true`
   - Set `status.status: "completed"`

2. Update `progress.txt`:
   - Append session record with:
     - Starting state
     - Execution content
     - Ending state
     - Next steps

3. Git commit:
   ```bash
   git add .
   git commit -m "feat(FEAT-XXX): Description"
   ```

4. Announce: "Using finishing-development-branch skill to complete this work."
   - **REQUIRED:** Use finishing-development-branch skill

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## Remember

- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Between batches: just report and wait
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent

## Integration

**Required workflow skills:**
- **brainstorming** - Creates requirements that led to this plan
- **writing-plans** - Creates the plan this skill executes
- **tdd-enforcement** - Ensures tests are written first
- **verification-before-completion** - Verify work is complete
