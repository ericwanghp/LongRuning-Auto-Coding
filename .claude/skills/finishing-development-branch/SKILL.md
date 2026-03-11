---
name: finishing-development-branch
description: "Phase 7 of Auto-Coding Framework. Use when implementation is complete, all tests pass, and need to decide how to integrate the work. Guides completion of development work by presenting structured options."
phase: "7"
triggers:
  - All tests passing
  - Implementation complete
  - Ready to merge/PR
---

# Finishing a Development Branch

## Overview

**Phase 7 of Auto-Coding Framework**

Guide completion of development work by presenting clear options and handling chosen workflow.

**Core principle:** Verify tests → Present options → Execute choice → clean up.

**Announce at start:** "I'm using the finishing-development-branch skill to complete this work."

## The Process

### Step 1: Verify Tests

Before presenting options:
```bash
# Run project's test suite
npm test / cargo test / pytest / go test ./...
```
**If tests fail:**
```text
Tests failing (<N> failures). Must fix before completing:
Cannot proceed to Step 2.
```
**If tests pass:** Continue to Step 2.

### Step 2: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```
Or ask: "This branch split from main - is that correct?"

### Step 3: Present Options

Present exactly these 4 options:

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

**Don't add explanation** - keep options concise.

### Step 4: Execute Choice

#### Option 1: Merge Locall
#### Option 1: Merge locally
```bash
git checkout <base-branch>
git pull
git merge <feature-branch>
<test command>
git branch -d <feature-branch>
```
Then: Cleanup worktree (Step 5)

#### Option 2: Push and Create PR
```bash
git push -u origin <feature-branch>
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<2-3 bullets of what changed>

## Test Plan
- [ ] <verification steps>
EOF
)"
```
Then: Cleanup worktree (Step 5)

#### Option 3: Keep as-is
Report: "Keeping branch <name>. Worktree preserved at <path>."
**Don't cleanup worktree.**
#### Option 4: Discard
**Confirm first:**
This will permanently delete:
- Branch <name>
- All commits: <commit-list>
- Worktree at <path>

Type 'discard' to confirm.
Wait for exact confirmation.
If confirmed:
```bash
git checkout <base-branch>
git branch -D <feature-branch>
```
Then: Cleanup worktree (Step 5)
### Step 5: Cleanup Worktree
**For Options 1, 2, 4:**
Check if in worktree:
```bash
git worktree list | grep $(git branch --show-current)
```
If yes:
```bash
git worktree remove <worktree-path>
```
**For Option 3:** Keep worktree.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | ✓ | - |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |
