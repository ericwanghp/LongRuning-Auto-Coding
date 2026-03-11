---
name: superpowers-integration
description: "Mapping of superpowers skills to Auto-Coding Framework phases"
---

# Superpowers Skills Integration

This document maps the superpowers skill patterns to the Auto-Coding Framework's 8 development phases.

## Overview

The [superpowers](https://github.com/obra/superpowers) framework provides workflow skills that enhance AI agent capabilities through structured processes, hard gates, and verification workflows.

This integration incorporates the best practices from the superpowers project into our Auto-coding framework.

## Phase Mapping

| Auto-Coding Phase | Superpowers Skill | Description |
|----------------|-------------------|-----------------------------------------------------|------------------|
| Phase 1: Requirements | **brainstorming** | Explore requirements through collaborative dialogue. Create BRD/PRD. HARD gate prevents skipping to design. |
| Phase 2: Product | **brainstorming** | Contin refinement into PRD + UI/UX. Get approval. |
| Phase 3: Architecture | **writing-plans** | Create detailed implementation plans assuming zero context. Produce tasks.json. |
| Phase 4: Task Breakdown | **writing-plans** | (Same as Phase 3) |
| Phase 5: Development | **executing-plans** | Load plan, execute in batches with checkpoints. |
| **tdd-enforcement** | Write tests first, minimal code to pass. |
| **verification-before-completion** | Verify before claiming done. |
| **systematic-debugging** | Root cause investigation before fixes. |
| **fix** | Auto-fix lint, formatting, and quality issues. |
| **dispatching-parallel-agents** | Parallel execution for independent tasks. |
| **code-reviewer** | Code review after each task. |
| Phase 6: Testing | **executing-plans** | Continue batch execution. |
| **tdd-enforcement** | Ensure tests are written. |
| **systematic-debugging** | Debug failing tests. |
| **fix** | Fix lint/format issues before commit. |
| Phase 7: Deployment | **finishing-development-branch** | Verify tests, present options, merge/PR/cleanup. |
| **fix** | Final quality gate before merge. |
| Phase 8: PM | **dispatching-parallel-agents** | Coordinate multiple agents in parallel. |

## Skill Files Created

| Skill | Location |
|-------|----------|
| [brainstorming.md](brainstorming.md) |
| [writing-plans.md](writing-plans.md) |
| [executing-plans.md](executing-plans.md) |
| [tdd-enforcement.md](tdd-enforcement.md) |
| [systematic-debugging.md](systematic-debugging.md) |
| [verification-before-completion.md](verification-before-completion.md) |
| [dispatching-parallel-agents.md](dispatching-parallel-agents.md) |
| [finishing-development-branch.md](finishing-development-branch.md) |
| [fix.md](../fix/SKILL.md) |

## Key Principles Integrated from Superpowers

### 1. Hard Gates
- `<HARD-GATE>` markers in skills indicate mandatory steps that cannot be skipped
- Example: `brainstorming` has `<HARD-GATE>` requiring user approval before implementation

### 2. Process Flows
- Visual flowcharts (graphviz) showing workflow progression
- Terminal states clearly defined (invoking `writing-plans`)
- Example: Brainstorming's terminal state is invoking `writing-plans`

### 3. Bite-Sized Tasks
- Each step is 2-5 minutes (one action)
- Explicit file paths, complete code in tasks
- Red-Green-refactor pattern
- Frequent commits

### 4. Verification Before claims
- `verification-before-completion` requires running commands and seeing evidence
- `systematic-debugging` requires root cause investigation before fixes
- `tdd-enforcement` requires writing failing tests first

### 5. Test Automation Integration
- Phase 5: `test-automator` automates unit & functional tests
- Phase 6: E2E tests reference the skill
- `webapp-testing` skill for browser-based testing

- Phase 5: `dispatching-parallel-agents` for parallel execution of independent tasks
- Phase 8: `dispatching-parallel-agents` for PM coordination

- `finishing-development-branch` for branch completion workflow

- `verification-before-completion` for completion verification
