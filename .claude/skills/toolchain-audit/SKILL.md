---
name: toolchain-audit
description: "Audit MCP-to-skill dependency consistency. Use when adding/updating skills, changing MCP config, investigating runtime tool failures, or during framework governance to ensure all skill-declared MCP dependencies are verifiable in mcp.json."
phase: "8"
triggers:
  - skill dependency mismatch
  - mcp consistency check
  - toolchain governance
  - runtime missing mcp tool
---

# Toolchain Audit

## Objective

Guarantee that skill-declared external MCP dependencies match project MCP configuration before execution.

## Inputs

- MCP config: `.auto-coding/config/mcp.json`
- Skill files: `.claude/skills/**/SKILL.md`
- Contract rule: `.claude/rules/tooling-dependency-contract.md`

## Required Skill Declaration

Each skill that depends on MCP must declare in frontmatter:

```yaml
tooling_dependencies:
  mcp_required:
    - <mcp-name>
  mcp_optional:
    - <mcp-name>
```

## Execution Steps

1. Run:

```bash
node .claude/scripts/audit-toolchain-deps.js
```

2. If audit fails, collect each unresolved dependency and classify cause:
   - Skill over-declared unsupported MCP
   - Skill references undeclared MCP as mandatory prerequisite
   - MCP config missing intentionally supported dependency

3. Remediate with priority:
   - Align skill prerequisites to actual executable toolchain
   - Downgrade non-essential MCP dependencies from required to optional
   - Add MCP config only when project explicitly chooses that integration

4. Re-run audit until pass.

## Output Format

Provide:

1. Mismatch summary table
2. File-level fixes applied
3. Final PASS/FAIL status

## Optional Agent Role

If using Agent Teams, this audit can be assigned to `tooling-governor`.
