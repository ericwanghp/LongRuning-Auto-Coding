# Agent Teams Usage Guide

## Scope

Use Agent Teams when `parallelGroups` contains executable parallel work. Single-agent serial execution is allowed only when work is inherently sequential.

## Team-Lead Boundary

`project-manager` is the team-lead and is a coordinator only.

| Team-lead MUST do | Team-lead MUST NOT do |
|-------------------|-----------------------|
| Break down and schedule tasks | Write implementation code |
| Assign work to subagents | Edit project files for subagent tasks |
| Track progress and resolve blockers | Take over unfinished subagent work directly |
| Verify acceptance results | Bypass role separation |

## Parallel Execution Protocol

1. Read `.auto-coding/tasks.json` and identify runnable items from `parallelGroups` and dependency status.
2. Create team and tasks, then start each subagent with `run_in_background: true`.
3. Ensure each subagent runs in an independent tmux pane.
4. Monitor progress via task status and messages, and coordinate cross-task dependencies.
5. Accept completion only after deliverables and required completion actions are confirmed.

## Subagent Lifecycle

Agents are temporary workers and must follow this lifecycle:

1. Spawn when work is ready.
2. Execute assigned scope.
3. Report completion or blocker.
4. Exit immediately after approval.
5. Recall later only when new scope requires that agent.

Never keep completed agents idle.

## Pane Naming Convention

Use `{role-abbreviation}-{task-abbreviation}`.

| Agent Type | Example |
|------------|---------|
| project-manager | `pm-coord` |
| frontend-dev | `fe-ui` |
| backend-dev | `be-api` |
| architect | `arch-design` |
| test-engineer | `test-e2e` |

## Completion Checklist Authority

Feature completion steps are defined in one source only:

- `.claude/rules/05-session-workflow.md` → `Feature Completion Checklist`

This file references that checklist and does not duplicate it.
