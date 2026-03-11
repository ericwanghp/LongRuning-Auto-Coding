---
name: writing-plans
description: "Phase 3-4 of Auto-Coding Framework. Use when you have approved BRD/PRD and an architecture doc. Create detailed implementation plans and tasks.json."
phase: "3-4"
triggers:
  - Approved BRD exists
  - approved PRD exists
  - architecture doc complete
  - Ready to break down work into tasks
---

# Writing Plans

## Overview

**Phase 3-4 of Auto-Coding Framework**

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it Give them the whole plan as bite-sized tasks.

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Task Granularity

**Each step is ONE action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement minimal code to pass" - step
- "Run tests and verify pass" - step
- "Commit" - step

## Plan Document Header

Every plan MUST start with this header:

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** Use executing-plans skill to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat(FEAT-XXX): add specific feature"
```

## Integration with Auto-Coding Framework

| Phase | Agent | Output |
|-------|-------|--------|
| Phase 3 | architect | Architecture Doc |
| Phase 4 | architect | tasks.json |
| Phase 5 | frontend/backend-dev | Code + Tests |

## Execution Handoff

After saving the plan, offer execution choice:

**1. Agent Teams (this session)**
   - Dispatch focused agents per task
   - Review between batches
   - Fast iteration with clear ownership

**2. Parallel Session (separate)**
   - Open new session with executing-plans
   - Batch execution with checkpoints
   - **REQUIRED:** New session uses executing-plans skill
