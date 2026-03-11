# Agent Specifications

> 37 custom subagents organized by category. Full specs: individual `.md` files in each category folder.

## Directory Structure

```
.claude/agents/
├── _base/                    # Common Rules
│   ├── team-lead-base.md     # Main process rules
│   └── team-member-base.md   # Subagent rules
├── 01-core-development/      # Core Development (10 agents)
├── 02-data-ai/               # Data & AI (8 agents)
├── 03-infrastructure/        # Infrastructure (2 agents)
├── 04-quality-security/      # Quality & Security (8 agents)
├── 05-business-product/      # Business & Product (4 agents)
├── 06-documentation/         # Documentation (2 agents)
└── 07-research-orchestration/ # Research & Coordination (3 agents)
```

## Base Rules

### Team-Lead Rules (`_base/team-lead-base.md`)

**Core Principle: Team-lead coordinates, does not execute**

| Should Do | Should Not Do |
|-----------|---------------|
| Plan and break down tasks | Execute development tasks |
| Create and assign tasks to subagents | Write code or create files directly |
| Monitor subagent progress | Replace subagent work |

### Subagent Rules (`_base/team-member-base.md`)

**Core Principle: Execute proactively, don't wait**

- **Proactive Execution**: Start immediately after receiving prompt
- **Messaging**: Use SendMessage for team communication
- **Shutdown Protocol**: Must respond with tool when receiving `shutdown_request`
- **Task Management**: Use TaskUpdate to claim and complete tasks

---

## Agent Categories

### 01-core-development (10 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `architect` | Opus | System architecture, tech selection, task breakdown | Architecture design |
| `frontend-dev` | Sonnet | Frontend development, UI implementation | Frontend UI |
| `backend-dev` | Opus | Backend development, API implementation | Backend API |
| `fullstack-dev` | Opus | **Primary dev: Code + Unit Tests + Func Tests** (Phase 5) | Full-stack features |
| `api-designer` | Opus | API architecture design, OpenAPI specs | Design API specs |
| `mobile-developer` | Sonnet | Mobile app development (iOS/Android) | Mobile apps |
| `websocket-engineer` | Opus | Real-time communication, WebSocket | Real-time systems |
| `git-workflow-manager` | Sonnet | Git workflow, branch management, version control | Git management |
| `refactoring-specialist` | Opus | Code refactoring, design patterns, tech debt | Code refactoring |
| `cli-developer` | Sonnet | CLI tools, developer scripts | CLI development |

### 02-data-ai (8 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `data-engineer` | Opus | Data pipelines, ETL, database optimization | Data/ETL |
| `data-scientist` | Opus | ML models, statistical analysis | ML models |
| `data-analyst` | Sonnet | Data analysis, reporting, visualization | Data analysis |
| `algorithm-expert` | Opus | Algorithm design, optimization | Algorithm design |
| `llm-architect` | Opus | LLM system architecture, RAG, Prompt engineering | LLM systems |
| `ai-engineer` | Opus | AI feature implementation, model integration | AI features |
| `ai-agent-engineer` | Opus | Agent framework design, multi-agent systems | Agent frameworks |
| `quant-analyst` | Opus | Quantitative analysis, financial modeling | Quant analysis |

### 03-infrastructure (2 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `devops-engineer` | Opus | CI/CD, container orchestration, deployment | DevOps |
| `mcp-developer` | Opus | MCP server development, tool integration | MCP servers |

### 04-quality-security (8 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `code-reviewer` | Sonnet | Code review | Code quality review |
| `architect-reviewer` | Opus | Architecture review | Architecture review |
| `security-auditor` | Opus | Security audit | Security audit |
| `qa-expert` | Sonnet | QA strategy, quality gates | QA strategy |
| `test-engineer` | Sonnet | Test case writing | Test cases |
| `test-automator` | Sonnet | Test automation framework | Test automation |
| `error-detective` | Opus | Error investigation | Error analysis |
| `debugger` | Opus | Bug fixing, debugging | Bug fixing |

### 05-business-product (4 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `project-manager` | Sonnet | Project execution, task coordination, progress tracking | Project coordination |
| `product-manager` | Sonnet | Product strategy, roadmap, feature prioritization | Product strategy |
| `business-analyst` | Sonnet | Requirements analysis, process mapping, BRD | Requirements/BRD |
| `ux-designer` | Sonnet | UX design, interaction design, information architecture | UX design |

### 06-documentation (2 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `technical-writer` | Sonnet | Technical documentation, tutorials, guides | Tech docs |
| `api-documenter` | Sonnet | API documentation, developer docs | API docs |

### 07-research-orchestration (3 agents)

| Agent | Model | Responsibility | Scenario |
|-------|-------|----------------|----------|
| `researcher` | Sonnet | Technology research, feasibility analysis | Tech research |
| `market-researcher` | Sonnet | Market analysis, competitive intelligence | Market research |
| `agent-organizer` | Opus | Multi-agent coordination, workflow orchestration | Agent coordination |

---

## Quick Selection Guide

| Task | Role | Task | Role |
|------|------|------|------|
| Architecture design | `architect` | Code review | `code-reviewer` |
| Frontend UI | `frontend-dev` | Requirements/BRD | `business-analyst` |
| Backend API | `backend-dev` | Product/PRD | `product-manager` |
| Data/ETL | `data-engineer` | Test cases | `test-engineer` |
| Design API specs | `api-designer` | QA strategy | `qa-expert` |
| Implement API code | `backend-dev` | Security audit | `security-auditor` |
| Write API docs | `api-documenter` | Project coordination | `project-manager` |
| Architecture review | `architect-reviewer` | UX design | `ux-designer` |

---

## Usage

```javascript
Task({
  subagent_type: "backend-dev",
  description: "Implement login API",
  prompt: "..."
})
```

## File Format

Each agent follows VoltAgent specification:

```yaml
---
name: agent-name
description: When this agent should be invoked
tools: Read, Write, Edit, Bash, Glob, Grep
model: opus | sonnet | haiku
base_rules: team-member-base.md
---

# Agent Title

[Core responsibilities and workflow...]
```

### YAML Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Agent identifier |
| `description` | Yes | When to invoke |
| `tools` | Yes | Available tools |
| `model` | Yes | opus/sonnet/haiku |
| `base_rules` | No | Reference to base rules file |

## Adding New Agents

1. Choose appropriate category directory
2. Create `.md` file with agent name
3. Follow VoltAgent specification format
4. Update this file and CLAUDE.md
