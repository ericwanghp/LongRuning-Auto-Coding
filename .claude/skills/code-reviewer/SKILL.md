---
name: code-reviewer
description: |
  Use this skill to review code. It supports both local changes (staged or working tree)
  and remote Pull Requests (by ID or URL). It focuses on correctness, maintainability,
  and adherence to project standards.
allowed-tools:
  - "Read"
  - "Bash"
  - "Grep"
  - "Glob"
  - "web_fetch"
---

# Code Reviewer Skill

> Professional and thorough code reviews for both local development and remote Pull Requests.

## Workflow

### 1. Determine Review Target
* **Remote PR**: If the user provides a PR number or URL (e.g., "Review PR #123"), target that remote PR.
* **Local Changes**: If no specific PR is mentioned, or if the user asks to "review my changes", target the current local file system states (staged and unstaged changes).

### 2. Preparation
#### For Remote PRs:
1. **Checkout**: Use the GitHub CLI to checkout the PR.
```bash
gh pr checkout <pr-number>
```
2. **Preflight**: Execute the project's standard verification suite to catch automated failures early.
```bash
npm run preflight
```
3. **Context**: Read the PR description and any existing comments to understand the goal and history.

#### For Local Changes:
1. **Identify Changes**:
   * Check status: `git status`
   * Read diffs: `git diff` (working tree) and/or `git diff --staged` (staged).
2. **Preflight (Optional)**: If the changes are substantial, ask the user if they want to run `npm run preflight` before reviewing.

### 3. In-Depth Analysis
Analyze the code changes based on the following pillars:
* **Correctness**: Does the code achieve its stated purpose without bugs or logical errors?
* **Maintainability**: Is the code clean, well-structured, and easy to understand and modify in the future?
* **Security**: Are there any potential vulnerabilities or security concerns?
* **Performance**: Are there any performance implications?
* **Design Patterns**: Are solid principles followed? Is the design appropriate?
* **Testing**: Is test coverage adequate? Are edge cases covered?
* **Documentation**: Is the code well-documented?

### 4. Review Categories

#### Correctness
- [ ] Logic correctness verified
- [ ] Error handling complete
- [ ] Resource management proper
- [ ] Concurrency safe

#### Code Quality
- [ ] Naming conventions followed
- [ ] Code organization clean
- [ ] Function complexity reasonable
- [ ] No duplication detected
- [ ] Code readable and maintainable

#### Security Review
- [ ] Input validation present
- [ ] Authentication checks verified
- [ ] Authorization properly scoped
- [ ] No injection vulnerabilities
- [ ] Cryptographic practices sound
- [ ] Sensitive data handled securely
- [ ] Dependencies scanned for vulnerabilities
- [ ] Configuration secure

#### Performance Analysis
- [ ] Algorithm efficiency verified
- [ ] Database queries optimized
- [ ] Memory usage acceptable
- [ ] Network calls minimized
- [ ] Caching strategies implemented
- [ ] Async patterns proper
- [ ] No resource leaks

#### Design Patterns
- [ ] Solid principles followed
- [ ] DRY compliance verified
- [ ] Pattern appropriateness confirmed
- [ ] Abstraction levels appropriate
- [ ] Coupling minimized
- [ ] Cohesion maximized

#### Test Review
- [ ] Test coverage aligns with `.claude/rules/09-testing.md`
- [ ] Test quality adequate
- [ ] Edge cases covered
- [ ] Mock usage appropriate
- [ ] Test isolation maintained
- [ ] Tests are independent
- [ ] Tests are deterministic

#### Documentation Review
- [ ] Code comments clear
- [ ] API documentation complete
- [ ] README files updated
- [ ] Inline documentation adequate
- [ ] Example usage provided

## Communication Protocol
When handing off to another agent:
1. **To developer**: Provide clear, actionable feedback with specific line references
2. **to security-auditor**: Flag any potential security concerns for deeper analysis
3. **to architect-reviewer**: Note any design pattern concerns
4. **to qa-expert**: share coverage metrics and quality observations

## Hand off
When handing off to another agent:
1. **to developer**: Provide clear, actionable feedback with specific line references
2. **to security-auditor**: Flag any potential security concerns for deeper analysis
3. **to architect-reviewer**: Note any design pattern concerns
4. **to qa-expert**: share coverage metrics and quality observations

### Handoff Checklist
- [ ] Review findings documented
- [ ] Critical issues flagged for immediate attention
- [ ] Suggested fixes provided
- [ ] Follow-up review scheduled if needed

## Documentation
### Required Output
Review comments must include:
1. **file and line reference** - Specific location of issue
2. **issue description** - what the problem is
3. **severity level** - Critical/High/Medium/Low
4. **recommendation** - how to fix or improve
5. **code example** (when applicable) - Better implementation

### Review Report Structure
```markdown
## Code Review Report
### Summary
- Files reviewed: N
- Issues found: N
- Critical: N | High: N | Medium: N | Low: N

### Critical Issues
[must fix before merge]

### Important Issues
[should fix before merge]

### Suggestions
[nice to have improvements]

### Good Practices
[positive observations]
```

## tech Stack
- **Linters**: ESLint / Prettier / Black / Ruff
- **Testing**: Jest / Vitest / pytest
- **Coverage**: Istanbul / Coverage.py
- **Standards**: Style guides, conventions
- **Static Analysis**: SonarQube, CodeClimate
## Feedback Guidelines
- be specific and actionable
- explain the "why"
- acknowledge good practices
- prioritize: Critical > Important > Nice-to-have
