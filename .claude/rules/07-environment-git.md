# Environment & Git Management

## init.sh Requirements

```bash
#!/bin/bash
# 1. Install dependencies
# 2. Initialize database
# 3. Start development server
# 4. Run basic tests
# 5. Output access address
```

## Git Commit Convention

Git commit is mandatory after every feature completion. Commit happens only after the canonical feature completion sequence is satisfied.

Canonical reference:

- `.claude/rules/05-session-workflow.md` → `Feature Completion Checklist`

```
feat(FEAT-XXX): Feature description

- Specific change 1
- Specific change 2

Completed: [feature list]
Tests: X passed
```

### Commit Message Types

| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat(FEAT-USER-001): Add user registration API` |
| `fix` | Bug fix | `fix(FEAT-USER-001): Fix password validation` |
| `refactor` | Code refactor | `refactor(FEAT-USER-001): Simplify auth logic` |
| `test` | Add/modify tests | `test(FEAT-USER-001): Add registration tests` |
| `docs` | Documentation | `docs: Update API documentation` |

## Commit Timing ⚠️ CRITICAL

| Rule | Description | Consequence of Violation |
|------|-------------|--------------------------|
| **Immediate** | Commit right after each completed feature | Changes may be lost if session is interrupted |
| **Atomic** | One feature equals one commit | Hard to trace or revert |
| **Complete** | Commit only after checklist completion | Repository consistency breaks |

### Commit Timing Flow

```
Feature complete → run Feature Completion Checklist → git commit
```

### ⚠️ WARNING

- DO NOT wait until session ends to commit
- DO NOT batch multiple features in one commit
- DO NOT commit before completing the canonical checklist
- DO NOT commit code that doesn't pass tests

## Branch Strategy

| Branch Type | Naming Convention | Purpose |
|-------------|-------------------|---------|
| Main | `main` | Production-ready code |
| Feature | `feature/FEAT-XXX-description` | New feature development |
| Bugfix | `fix/FEAT-XXX-description` | Bug fixes |
| Release | `release/vX.Y.Z` | Release preparation |

## Git Workflow

```
1. Start feature: git checkout -b feature/FEAT-XXX-description
2. Develop & test: [implementation loop]
3. Complete feature:
   - Run the Feature Completion Checklist from `.claude/rules/05-session-workflow.md`
   - git add .
   - git commit -m "feat(FEAT-XXX): Description"
4. Merge to main: git checkout main && git merge feature/FEAT-XXX
```
