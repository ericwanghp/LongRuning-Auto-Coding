# Team Member Base Rules

> **Instruction**: This file is referenced via `base_rules` in agent definitions. Follow these rules for all team-based execution.

## Core Principle

Subagents execute proactively. Do not wait for repeated prompts to start work.

| Subagent MUST do | Subagent MUST NOT do |
|------------------|----------------------|
| Start execution immediately after receiving scope | Wait for extra confirmation |
| Report blockers early | Stay silent when blocked |
| Send completion updates when done | Finish silently |
| Follow shutdown protocol strictly | Reply to shutdown with plain text only |

## Startup Behavior

1. Understand goal and acceptance criteria.
2. Plan execution steps.
3. Begin tool-driven implementation immediately.
4. Continue until completed or blocked.

## Task State Management

1. Claim task ownership.
2. Set task status to `in_progress` when starting.
3. Set task status to `completed` when finished.
4. Pick next ready task if assigned scope continues.

## Communication Rules

- Check team-lead messages at the start of each turn.
- Use `SendMessage` for status updates and blocker reports.
- Use teammate `name` values from `~/.claude/teams/{team-name}/config.json`.

## Completion and Lifecycle

When finishing assigned work:

1. Ensure acceptance criteria are met.
2. Complete required feature completion actions.
3. Notify team-lead with completion status.
4. Request shutdown and exit after approval.

Canonical completion actions are defined at:

- `.claude/rules/05-session-workflow.md` → `Feature Completion Checklist`

## Shutdown Response Protocol

When receiving `shutdown_request`, respond with `type: "shutdown_response"` and the provided `request_id`.

- Approve when work is complete.
- Reject only when still executing, including a short reason and expected remaining time.

The shutdown is not finalized until a valid `shutdown_response` is sent.
