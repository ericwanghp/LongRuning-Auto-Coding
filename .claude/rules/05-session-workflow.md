# Standard Session Workflow

## Session Start

```bash
# 1. Sync code
git pull

# 2. View feature status
cat .auto-coding/tasks.json

# 3. Understand historical context
cat .auto-coding/progress-summary.md

# 4. Set active phase and load phase context
AUTO_CODING_PHASE=1 node .claude/hooks/read-context.js

# 5. Validate environment
./init.sh
```

For deeper history, read `.auto-coding/progress.txt` only when the summary is insufficient.
Set `AUTO_CODING_PHASE` to `1`, `2`, `2.5`, `3`, `4`, `5`, `6`, `7`, or `8` based on your current stage.

## Select Task

1. Find features with `passes: false` in tasks.json
2. Check if their `dependencies` all have `passes: true`
3. Select eligible task to execute

## Execute Task

1. Implement feature code
2. Write/run tests
3. Ensure tests pass
4. Complete the `Feature Completion Checklist` in this file

## Feature Completion Checklist ⚠️ MANDATORY

This section is the single authority for feature completion steps. Other rule files must reference this section and must not duplicate it.

Every completed feature MUST execute these steps in order:

| Step | Required Action | Required Result |
|------|-----------------|-----------------|
| 1 | Update `.auto-coding/tasks.json` | `status.passes: true`, `status.status: "completed"`, completion metadata updated |
| 2 | Update `.auto-coding/progress.txt` | Session record appended with execution and next-step context |
| 3 | Commit to git | Atomic commit for the feature using standard message convention |

## Commit Message Convention

```
feat(FEAT-XXX): Brief description

- Specific change 1
- Specific change 2

Completed: [feature ID]
Tests: X passed, Y failed
```

## Session End

**Session End applies to the entire work session, not individual features:**

```bash
# Verify all completed features have been:
# 1. Marked in tasks.json (passes: true)
# 2. Recorded in progress.txt
# 3. Committed to git

# Final session summary:
echo "Session completed: N features done"
```
