# Blockage Handling

## Cases Requiring Human Intervention

| Blockage Type | Example | Action |
|---------------|---------|--------|
| Environment config | API key missing | Human provides |
| External dependency | Service unavailable | Wait or switch |
| Testing limitation | Missing test account | Human creates |
| Permission issue | No access to resource | Human grants access |
| Unclear requirements | Ambiguous specification | Human clarifies |

## Blockage Handling Process

```
1. Stop current task immediately
   ↓
2. Record blockage to progress.txt
   ↓
3. Update tasks.json with blockReason
   ↓
4. Use SendMessage to notify PM (if in team)
   ↓
5. Wait for resolution
   ↓
6. DO NOT commit unfinished code
```

## Blockage Record Format

### In progress.txt

```markdown
## Blockage Info
- Blockage Type: Environment config
- Blockage Reason: Need real API key
- Tried: Check .env.example, search documentation
- Need Help: Fill in API_KEY in .env.local
- Reported At: 2026-02-25T16:00:00Z
```

### In tasks.json

```json
{
  "status": {
    "status": "blocked",
    "passes": false,
    "blockReason": {
      "type": "external_dependency",
      "description": "Need third-party API Key",
      "reportedAt": "2026-02-25T16:00:00Z",
      "reportedBy": "backend-dev",
      "resolution": "Waiting for human to provide",
      "needsHumanIntervention": true
    },
    "resumeContext": {
      "lastStep": "Research API documentation",
      "nextStep": "Implement request wrapper",
      "partialWork": "Completed documentation analysis",
      "filesModified": ["docs/api-analysis.md"],
      "suggestedActions": ["Add API_KEY to .env"]
    }
  }
}
```

## Resume After Blockage

When resuming after a blockage is resolved:

1. Read `blockReason` to understand why blocked
2. Read `resumeContext.lastStep` to know where we left off
3. Read `resumeContext.nextStep` to know what to do next
4. Read `resumeContext.suggestedActions` to know prerequisites
5. Continue from `resumeContext.nextStep`

## ⚠️ Important Rules

| Rule | Reason |
|------|--------|
| DO NOT commit unfinished code | Keeps repository in consistent state |
| DO NOT skip blockage recording | Future reference and context |
| DO NOT proceed without resolution | May cause more issues |
| DO notify team lead (if applicable) | Enables coordination |

## Escalation Path

```
1. Agent identifies blockage
   ↓
2. Record in tasks.json + progress.txt
   ↓
3. Notify project-manager via SendMessage
   ↓
4. project-manager evaluates severity
   ↓
5. If needs human: Notify user
   If can resolve: project-manager coordinates resolution
   ↓
6. Resolution recorded
   ↓
7. Agent resumes work
```
