---
name: fix
description: "Use when you have lint errors, formatting issues, test failures, or before committing code to ensure it passes CI. Integrates with systematic-debugging for issue resolution."
phase: "5-7"
triggers:
  - Lint errors
  - Formatting issues
  - Test failures
  - Before committing code
  - CI pipeline failures
  - Code quality issues
---

# Fix Lint, Formatting, and Code Quality

## Overview

**Phase 5-7 of Auto-Coding Framework**

Ensures code quality before committing. Automatically detects project type and runs appropriate fix commands.

## When to Use

- Before any git commit
- When lint errors are reported
- When formatting issues exist
- When CI pipeline fails on quality checks
- After making code changes

## Quick Reference

| Check | Command | Auto-fix |
|-------|---------|----------|
| Format | `npm run format` or `npx prettier --write .` | Yes |
| Lint | `npm run lint` or `npx eslint .` | Partial (`--fix`) |
| Types | `npm run typecheck` or `tsc --noEmit` | No |
| Tests | `npm test` | No |

## Instructions

### Step 1: Detect Project Configuration

First, identify what tools are available:

```bash
# Check for package manager
[ -f "package-lock.json" ] && echo "npm"
[ -f "yarn.lock" ] && echo "yarn"
[ -f "pnpm-lock.yaml" ] && echo "pnpm"

# Check for linting tools
[ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ] && echo "eslint"
[ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ] && echo "prettier"

# Check for TypeScript
[ -f "tsconfig.json" ] && echo "typescript"
```

### Step 2: Run Auto-fix Commands

**Run in order:**

#### 2.1 Format Code (Prettier)

```bash
# If package.json has format script
npm run format

# Or run prettier directly
npx prettier --write .

# For specific files
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

#### 2.2 Fix Lint Issues (ESLint)

```bash
# If package.json has lint script with --fix
npm run lint -- --fix

# Or run eslint directly
npx eslint . --fix

# For specific directories
npx eslint src/ --fix
```

#### 2.3 TypeScript Check

```bash
# If package.json has typecheck script
npm run typecheck

# Or run tsc directly
npx tsc --noEmit
```

### Step 3: Verify All Checks Pass

```bash
# Run all quality checks
npm run lint && npm run typecheck && npm test
```

### Step 4: Report Remaining Issues

If issues remain after auto-fix:

1. **Read the error message carefully** - it often contains the solution
2. **Check for common patterns** (see below)
3. **If stuck, use systematic-debugging skill**

## Common Issues and Fixes

### ESLint Common Fixes

| Error | Fix |
|-------|-----|
| `no-unused-vars` | Remove unused variable or prefix with `_` |
| `@typescript-eslint/no-explicit-any` | Replace `any` with proper type |
| `react-hooks/exhaustive-deps` | Add missing dependencies to useEffect |
| `prefer-const` | Change `let` to `const` if not reassigned |
| `no-console` | Remove or replace with proper logger |

### Prettier Common Issues

| Issue | Fix |
|-------|-----|
| Line too long | Break into multiple lines |
| Inconsistent quotes | Run `--write` to auto-fix |
| Trailing commas | Run `--write` to auto-fix |
| Missing semicolons | Run `--write` to auto-fix |

### TypeScript Common Errors

| Error | Fix |
|-------|-----|
| `Property does not exist` | Add proper type or optional chaining |
| `Type is not assignable` | Fix type mismatch |
| `Cannot find module` | Check import path or add declaration |
| `Parameter implicitly has 'any'` | Add explicit type annotation |

## Integration with Auto-Coding Framework

### Before Commit (Phase 7)

```
┌─────────────────────────────────────────────────────────────────┐
│  Pre-Commit Quality Gate                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Run fix skill: Skill("fix")                                │
│     ├─ Format code (prettier)                                  │
│     ├─ Fix lint (eslint --fix)                                 │
│     ├─ Type check (tsc --noEmit)                               │
│     └─ Run tests                                               │
│                                                                 │
│  2. If issues remain:                                          │
│     └─ Use systematic-debugging skill                          │
│                                                                 │
│  3. All checks pass:                                           │
│     └─ Proceed with Feature Completion Checklist               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### When CI Fails

1. **Identify the failure type** (lint, test, build)
2. **Run fix skill locally** to reproduce
3. **If complex issue**: Use `systematic-debugging` skill
4. **Fix and verify** before pushing

### With systematic-debugging Skill

If auto-fix doesn't resolve issues:

```
Fix skill (auto-fix)
    ↓ (issues remain)
Systematic-debugging skill (find root cause)
    ↓ (root cause found)
Fix implementation
    ↓ (verify)
Fix skill (confirm all checks pass)
```

## Package.json Scripts Reference

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "quality": "npm run format:check && npm run lint && npm run typecheck && npm run test"
  }
}
```

## Monorepo Support

For monorepos with multiple packages:

```bash
# If using workspaces
npm run format -ws
npm run lint -ws
npm run test -ws

# Or use turbo/nx
turbo run lint
turbo run test
```

## Common Mistakes

| Mistake | Consequence | Solution |
|---------|-------------|----------|
| Running prettier on wrong files | Inconsistent formatting | Use globs: `"src/**/*.{js,ts}"` |
| Ignoring lint errors | CI will fail | Fix all errors before commit |
| Skipping type check | Runtime errors | Always run tsc before commit |
| Not running tests | Broken functionality | Tests must pass before commit |
| Using `--no-verify` | Bypassing quality gates | Only in emergencies, document why |

## Hook Integration

This skill is designed to work with the framework's hooks:

- `prevent-skip-validation.js` - Warns when skipping quality checks
- `verify-acceptance.js` - Verifies acceptance criteria
- `verify-git-commit.js` - Ensures quality before commit

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `systematic-debugging` | When issues persist after auto-fix |
| `tdd-enforcement` | Before writing implementation code |
| `verification-before-completion` | Before claiming work is complete |
| `code-reviewer` | For comprehensive code review |
