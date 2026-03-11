---
name: verification-before-completion
description: "Use before claiming work is complete, fixed, or merged, or creating PRs - requires running verification commands and proving claims. MUST show fresh verification evidence before making any success claim."
phase: "5-7"
triggers:
  - About to claim work is complete
  - Before committing/pushing/PRs
  - Before merging to main
---

# Verification Before Completion

## Overview

**Phase 5-7 of Auto-Coding Framework**

Do not claim success without fresh evidence from the current turn.

**Core principle:** Evidence before claims.

## The Iron Law

```
NO completion claims without fresh verification evidence
```

If you haven't run the verification command in this message, you cannot claim it passes.

## When To Use

Always:
- Before reporting task completion
- Before commit, push, merge, or PR creation
- Before deployment success claims
- Before cleanup actions that assume work is safely finished

## Verification Checklist

Before claiming complete:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered
- [ ] The relevant verification command was run just now
- [ ] Exit code was checked
- [ ] Output was read fully enough to support the claim
- [ ] Completion checklist was performed

## Verification Flow

1. Run the smallest command that proves the claim.
2. If making a broad success claim, run the full project command required by that claim.
3. Read the output and exit code.
4. Report the actual result, not the intended result.
5. If verification fails, switch to `systematic-debugging` or `fix` instead of claiming partial success.

## Reporting Rule

Use one of these patterns:

```text
Verified: `npm test`
Result: 24 passed, 0 failed
Claim: tests are passing
```

```text
Verified: `npm run lint`
Result: 3 errors remain in src/foo.ts
Claim: lint is still failing
```

## Integration with Auto-Coding Framework

| Phase | Agent | Skill |
|-------|-------|------------------------------------|
| Phase 1 | business-analyst + market-researcher | BRD |
| Phase 2 | product-manager + ux-designer | PRD + UI/UX |
| Phase 3 | architect + researcher | Architecture Doc (review by architect-reviewer) |
| Phase 4 | architect | tasks.json |
| Phase 5 | frontend/backend-dev | Code + tests (use tdd-enforcement) |
| Phase 5 | code-reviewer | Review |
| Phase 5 | test-automator | Automate tests |
| Phase 6 | test-engineer + test-automator | E2E tests |
| Phase 7 | devops-engineer + product-manager | UAT |
| Phase 8 | project-manager | Coordination |
