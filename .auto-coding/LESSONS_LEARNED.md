# Lessons Learned

> This document records experiences, lessons, and best practices during project development for future reference

---

## Document Description

### Category Tags

| Tag | Description |
|-----|-------------|
| `#architecture` | Architecture design related |
| `#workflow` | Workflow related |
| `#communication` | Communication coordination related |
| `#testing` | Testing related |
| `#performance` | Performance related |
| `#security` | Security related |
| `#documentation` | Documentation related |
| `#tooling` | Tool usage related |
| `#agent-collaboration` | Agent collaboration related |

### Experience Level

| Level | Description |
|-------|-------------|
| ⭐⭐⭐ | Critical experience, must follow |
| ⭐⭐ | Important experience, strongly recommended |
| ⭐ | Reference experience, adopt as needed |

---

## Experience Records

### 2026-02

---

#### LL-2026-003: New Requirements Must Follow Complete Process ⭐⭐⭐

```yaml
id: LL-2026-003
date: 2026-02-25
category: workflow
tags: [#workflow, #documentation, #architecture]

context: |
  During project development, sometimes coding starts directly while skipping documentation phase,
  making it difficult to trace decision reasons when requirements change later.

what_worked:
  - Complete BRD/PRD/Architecture documents help clarify requirements
  - Change records make decisions traceable

what_didnt_work:
  - Skipping documentation phase and going straight to coding
  - Verbal agreements without recording

root_cause: Lack of mandatory process constraints

recommendation: |
  Whenever a new requirement is identified, the complete product development process must be followed:
  1. Phase 1: Requirements Analysis → BRD
  2. Phase 2: Product Design → PRD
  3. Phase 3: Architecture Design → Architecture Doc
  4. Phase 4: Task Breakdown → tasks.json
  5. Phase 5-6: Development & Testing
  6. Phase 7: Project Management Coordination

  For existing system modifications, must update relevant documents and add change records.

related_changes: [CHG-2026-002]
related_tasks: [FEAT-001, FEAT-002]
applies_to:
  - All new feature development
  - Existing feature modifications
```

---

#### LL-2026-002: Use Native Capabilities to Avoid Reinventing the Wheel ⭐⭐⭐

```yaml
id: LL-2026-002
date: 2026-02-25
category: architecture
tags: [#architecture, #tooling, #agent-collaboration]

context: |
  In the early stage of the project, custom task management (tasks.json) and coordination system (coordination/) were implemented,
  but these features highly overlap with Claude Code native Agent Teams.

what_worked:
  - Native TeamCreate/TaskCreate/TaskUpdate features are comprehensive
  - Native SendMessage supports message passing and broadcasting
  - Native idle notification auto-triggers

what_didnt_work:
  - Custom coordination/ has high maintenance cost
  - Two systems increase cognitive burden
  - Custom system features are less complete than native

root_cause: Didn't understand Claude Code native capability scope initially

recommendation: |
  1. Prioritize Claude Code native capabilities
  2. Only customize when native capabilities are insufficient
  3. Research native capabilities before customizing

  Necessary customizations retained:
  - progress.txt: Native doesn't support cross-session context
  - init.sh: Project-specific environment initialization
  - hooks/: Project-specific validation logic

related_changes: [CHG-2026-001]
related_tasks: []
applies_to:
  - All Claude Code projects
```

---

#### LL-2026-001: Long-Cycle Projects Need Interrupt Recovery Mechanism ⭐⭐⭐

```yaml
id: LL-2026-001
date: 2026-02-25
category: workflow
tags: [#workflow, #agent-collaboration]

context: |
  Native Agent Teams are session-level, task state is lost when session ends.
  Long-cycle projects may span multiple sessions and need to recover interrupted work.

what_worked:
  - progress.txt records cross-session context
  - tasks.json passes field tracks completion status

what_didnt_work:
  - Missing blockage reason recording
  - Missing recovery context (what was done, what's next)
  - Missing execution history tracking

root_cause: Native Agent Teams designed as session-level

recommendation: |
  Use tasks.json v3.0 interrupt recovery mechanism:

  1. When blocked, record:
     - blockReason: Block reason, type, whether human intervention needed
     - resumeContext: Last step, next step, suggested actions

  2. When resuming:
     - Read blockReason to understand why blocked
     - Read resumeContext.lastStep to understand progress
     - Read resumeContext.nextStep to continue work

related_changes: [CHG-2026-002]
related_tasks: [FEAT-005]  # Payment integration blocking example
applies_to:
  - Long-cycle projects
  - Projects depending on external conditions
```

---

#### LL-2026-004: Multi-Role Parallel Development Validation ⭐⭐⭐

```yaml
id: LL-2026-004
date: 2026-02-26
category: workflow
tags: [#workflow, #agent-collaboration]

context: |
  News Aggregator project as scaffold validation project tested complete multi-role collaborative development process.

what_worked:
  - 7 roles effectively collaborated (business-analyst, product-manager, ux-designer, architect, backend-dev, frontend-dev, test-engineer)
  - tasks.json v3.0 supports parallel groups (parallelGroups)
  - Architecture review process effective (architect-reviewer)
  - Documentation-driven development process complete

what_didnt_work:
  - Initially didn't use TeamCreate to schedule multiple Agents in parallel
  - UI/UX design phase was ignored

root_cause: Insufficient understanding of parallel development process

recommendation: |
  1. Development phase must use TeamCreate for parallel scheduling
  2. Phase 2.5 UI/UX Design is a necessary phase
  3. Architecture documents must be reviewed by architect-reviewer

related_changes: [CHG-2026-003]
related_tasks: [FEAT-NEWS-001 to FEAT-NEWS-008]
applies_to:
  - All multi-role collaboration projects
```

---

#### LL-2026-005: Code Review is Key to Quality Assurance ⭐⭐⭐

```yaml
id: LL-2026-005
date: 2026-02-26
category: workflow
tags: [#workflow, #quality, #testing]

context: |
  In project development, code review is often skipped, leading to quality issues and security vulnerabilities.

what_worked:
  - Architecture review (architect-reviewer) effectively improves architecture quality
  - Test coverage requirements ensure basic quality

what_didnt_work:
  - Code review (code-reviewer) was not invoked
  - Design documents (DESIGN-{FEAT}.md) were not created

root_cause: Insufficient process constraints, lack of mandatory review mechanism

recommendation: |
  1. Phase 5.5: Code Review - Every feature must be reviewed by code-reviewer
  2. Design documents - technical-writer must complete before code implementation
  3. Cannot enter testing phase without approval

related_changes: [CHG-2026-003]
related_tasks: [All development tasks]
applies_to:
  - All projects (except small projects)
```

---

#### LL-2026-006: Build Verification is Essential for Code Quality Assurance ⭐⭐⭐

```yaml
id: LL-2026-006
date: 2026-02-26
category: workflow
tags: [#workflow, #testing, #quality]

context: |
  After News Aggregator project development completed, starting frontend revealed multiple compilation errors:
  - Missing types/index.ts export file
  - TypeScript verbatimModuleSyntax requires type-only imports
  - erasableSyntaxOnly conflicts with constructor parameter properties
  - vite.config.ts configuration errors

what_worked:
  - npm run build can discover all type errors in advance
  - Phase 5.5 code review includes build verification

what_didnt_work:
  - No build verification during development phase
  - Starting dev server directly cannot discover all issues

root_cause: Development process lacks mandatory build verification step

recommendation: |
  1. Phase 5.5 Must run npm run build before code review
  2. Add build verification checklist to frontend-dev/backend-dev templates
  3. Add type checking in init.sh or hooks

related_changes: []
related_tasks: []
applies_to:
  - All frontend and backend projects
```
---

#### LL-2026-009: Main Process Responsibility Boundary - Coordinate Only, Don't Execute ⭐⭐⭐

```yaml
id: LL-2026-009
date: 2026-03-02
category: workflow
tags: [#workflow, #agent-collaboration, #architecture]

context: |
  When using Agent Teams for parallel development, the main process (team-lead) started executing tasks that should be done by subagents.
  This led to:
  1. User cannot see subagents working in their respective panes
  2. Violates role separation principle
  3. Cannot achieve true parallel development

what_worked:
  - Main process creates teams and tasks
  - Main process launches background subagents
  - Main process coordinates via SendMessage

what_didnt_work:
  - Main process directly executes tasks while waiting for subagent response
  - Main process starts taking over work because subagent doesn't produce immediately
  - Main process uses Write/Edit tools to directly create code files

root_cause: |
  1. Unclear understanding of main process responsibility boundary
  2. Misunderstanding of background Agent behavior (see LL-2026-008)
  3. Lack of clear role separation rules

recommendation: |
  ## Core Principle: Main Process Only Coordinates, Doesn't Execute

  ### Main Process Responsibilities
  | Should Do | Should Not Do |
  |-----------|---------------|
  | Plan tasks and break down work | Execute specific development tasks |
  | Create and assign tasks to subagent | Directly write code or create files |
  | Monitor subagent progress | Replace subagent to complete work |
  | Coordinate dependencies between subagents | Skip subagent and implement directly |

  ### Practice Guidelines

  1. **Create Rule Files**:
     - `_base/team-lead-base.md` - Main process rules
     - `_base/team-member-base.md` - Subagent rules

  2. **Waiting Strategy**:
     - When all subagents are executing, main process should wait
     - Use TaskOutput to check background task status
     - Respond to subagent messages and blockage reports
     - Don't take over work due to waiting

  3. **Properly Handle Subagent Non-Execution**:
     - Check if prompt is detailed enough
     - Send clearer execution instructions
     - Patiently wait for subagent response
     - If truly needed, consider serial execution (run_in_background: false)

  ### File Locations
  - Main process rules: `.claude/agents/_base/team-lead-base.md`
  - Subagent rules: `.claude/agents/_base/team-member-base.md`

```

---

#### LL-2026-007: Subagent General Rules Should Be Centrally Managed ⭐⭐⭐

```yaml
id: LL-2026-007
date: 2026-03-02
category: workflow
tags: [#workflow, #agent-collaboration, #tooling]

context: |
  When team-lead sends shutdown_request, subagent didn't properly execute shutdown process.
  Reason is Agent definition files lack guidance rules on handling shutdown_request.

  Initially tried adding duplicate shutdown rules at end of each agent file, but this violates DRY principle.

what_worked:
  - Created `_base/team-member-base.md` to centrally define general rules
  - Explained in README.md that all agents follow general rules

what_didnt_work:
  - Adding same rules repeatedly in each agent file (DRY violation)
  - Scattered rules are hard to maintain and update

root_cause: Lack of central management mechanism for general rules

recommendation: |
  Adopt centralized management:

  1. General rules defined in `.claude/agents/_base/team-member-base.md`
     - Shutdown protocol
     - Task management
     - Message handling
     - Idle state handling

  2. Explain in `.claude/agents/README.md` that all agents should follow general rules

  3. When team-lead starts subagent, should inform it to follow general rules

  Correct shutdown response method:
  ```json
  {
    "type": "shutdown_response",
    "request_id": "[Extracted from shutdown request]",
    "approve": true
  }
  ```

  ⚠️ Cannot just confirm in text, must use SendMessage tool call.

related_changes: []
related_tasks: []
applies_to:
  - All subagents participating in Agent Teams
```

---

## Experience Summary

### Statistics by Category

| Category | Count | Key Experiences |
|----------|-------|-----------------|
| Workflow | 6 | New requirement complete process, interrupt recovery, parallel development, code review, Shutdown protocol, main process responsibility boundary |
| Architecture Design | 1 | Use native capabilities |
| Testing | 1 | Test-driven development |
| Security | 0 | - |
| Documentation | 0 | - |

### Core Principles Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Core Experience Principles                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Native First                                                            │
│     - Prioritize Claude Code native capabilities                            │
│     - Only customize when necessary                                         │
│     - Research before customizing                                           │
│                                                                             │
│  2. Complete Process                                                        │
│     - New requirements must follow complete process                         │
│     - Don't skip any phase                                                  │
│     - Synchronize document updates                                          │
│                                                                             │
│  3. Traceability                                                            │
│     - All changes recorded in CHANGELOG.md                                  │
│     - All experiences recorded in LESSONS_LEARNED.md                        │
│     - Cross-session progress recorded in progress.txt                       │
│                                                                             │
│  4. Recoverability                                                          │
│     - Long-cycle tasks support interrupt recovery                           │
│     - Record block reasons and recovery context                             │
│     - Keep rollback plans                                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Experience Application Template

```yaml
id: LL-YYYY-XXX
date: YYYY-MM-DD
category: [architecture|workflow|communication|testing|performance|security|documentation|tooling|agent-collaboration]
tags: [#tag1, #tag2]

context: |
  Describe the scenario and problem encountered

what_worked:
  - What practices were effective

what_didnt_work:
  - What practices were ineffective

root_cause: Root cause analysis

recommendation: |
  Specific suggestions and best practices

related_changes: [CHG-YYYY-XXX]
related_tasks: [FEAT-XXX]
applies_to:
  - Applicable scenario 1
  - Applicable scenario 2
```

---

## Regular Review

| Review Cycle | Responsible | Next Review Date |
|--------------|-------------|------------------|
| Monthly | project-manager | 2026-03-25 |

### Review Checklist

- [ ] Are there new experiences to record
- [ ] Are there old experiences to update
- [ ] Are there experiences to promote
- [ ] Are there repeated mistakes

---

> **Note**: Every time a problem or valuable experience is encountered, it should be recorded in this document to form a team knowledge base
