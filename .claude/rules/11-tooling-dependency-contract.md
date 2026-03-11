# Tooling Dependency Contract

## Purpose

Ensure every skill-declared external tool dependency is verifiable against MCP configuration before execution.

## Contract Scope

This contract applies to all skill files under `.claude/skills/**/SKILL.md`.

## Required Declaration Format

Each skill must declare external dependencies in frontmatter:

```yaml
tooling_dependencies:
  mcp_required:
    - <mcp-server-name>
  mcp_optional:
    - <mcp-server-name>
```

If a skill does not require MCP, it should keep both lists empty.

## Verification Source of Truth

- MCP source of truth: `.auto-coding/config/mcp.json` → `servers`
- Skill source of truth: each skill frontmatter `tooling_dependencies`

## Verification Rules

1. Every `mcp_required` item must exist in `.auto-coding/config/mcp.json` `servers`.
2. Every `mcp_optional` item must exist in `.auto-coding/config/mcp.json` `servers`.
3. Skills must not reference undeclared MCP tools in workflow steps or examples as mandatory prerequisites.
4. If dependency mismatch exists, the skill is considered non-runnable until fixed.

## Standard Audit Command

```bash
node .claude/scripts/audit-toolchain-deps.js
```

The audit must fail with non-zero exit code when mismatch exists.

## Remediation Priority

When mismatch is found, fix in this order:

1. Correct the skill dependency declaration to match actual required tools.
2. Remove or downgrade hard prerequisites that are not truly required.
3. Update MCP config only when the project explicitly chooses to support that MCP.

## Ownership

- Primary owner: team-lead / project-manager
- Optional specialist agent: tooling-governor
- Execution skill: toolchain-audit
