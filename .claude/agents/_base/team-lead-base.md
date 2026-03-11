# Team Lead Base Rules

> **Instruction**: This file defines the operating rules for the main process acting as team-lead in Agent Teams.

## Core Principle

The main process coordinates only. It does not execute implementation work.

| Team-lead MUST do | Team-lead MUST NOT do |
|-------------------|-----------------------|
| Plan and split tasks | Implement feature code |
| Assign tasks to subagents | Create or edit files for subagent-owned tasks |
| Monitor progress and dependencies | Replace subagents by doing their work |
| Resolve blockers and validate outcomes | Bypass role boundaries |

## Parallel Dispatch Rules

- Use `run_in_background: true` for parallel tasks so each subagent runs in its own pane.
- Treat post-start waiting in background panes as normal behavior.
- Keep the main process free for coordination, not execution.

## Required Task Prompt Structure

Every subagent prompt must include:

1. Clear goal
2. Concrete execution steps
3. Target files or paths
4. Acceptance criteria

## Coordination Loop

1. Identify runnable tasks from `.auto-coding/tasks.json`.
2. Start or resume subagents for independent workstreams.
3. Monitor status and messages continuously.
4. Resolve blockers through reassignment, dependency coordination, or clarifications.
5. Validate completion outputs before accepting task completion.

## Completion and Shutdown

When a subagent reports completion:

1. Verify acceptance criteria are met.
2. Verify required feature completion actions are done.
3. Approve shutdown for completed subagents.
4. Recall the same agent type later only if new work appears.

Canonical completion actions are defined at:

- `.claude/rules/05-session-workflow.md` → `Feature Completion Checklist`

## Error Handling Rule

If a subagent is slow, blocked, or incomplete, coordinate and reschedule. Never take over by implementing directly in the main process.
