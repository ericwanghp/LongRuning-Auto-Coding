---
name: frontend-code-review
description: "Trigger when the user requests a review of frontend files (e.g., `.tsx`, `.ts`, `.js`). Support both pending-change reviews and focused file reviews while applying the checklist rules."
allowed-tools:
  - "Read"
  - "Bash"
  - "Grep"
  - "Glob"
---

# Frontend Code Review Skill

> Specialized code review for frontend files (.tsx, .ts, .js)

## Intent

Use this skill whenever the user asks to review frontend code (especially `.tsx`, `.ts`, or `.js` files). Support two review modes:

1. **Pending-change review** – inspect staged/working-tree files slated for commit and flag checklist violations before submission.
2. **File-targeted review** – review the specific file(s) the user names and report the relevant checklist findings.

Stick to the checklist below for every applicable file and mode.

## Review Process

1. Open the relevant component/module. Gather lines that relate to class names, React hooks, prop memoization, and styling.
2. For each rule in the review point, note where the code deviates and capture a representative snippet.
3. Compose the review section per the template below. Group violations first by **Urgent** flag, then by category order (Code Quality, Performance, Business Logic).

## Review Categories

### Code Quality
- **Conditional class names use utility function** - Ensure conditional CSS is handled via `classNames` utility
- **Tailwind-first styling** - Favor Tailwind CSS utility classes over new `.module.css` files
- **Classname ordering for easy overrides** - Place incoming `className` prop after component's own class values
- **Consistent import ordering** - Group imports logically (external → internal → relative)
- **Component structure** - Clear separation of concerns, proper hook ordering
- **TypeScript strict mode compliance** - Avoid `any`, use proper types

### Performance
- **React.memo usage** - Memoize components that render often with same props
- **useMemo/useCallback** - Memoize expensive computations and callbacks passed to children
- **Lazy loading** - Code split large components and routes
- **Image optimization** - Use Next.js Image component, proper sizing, lazy loading
- **Bundle size awareness** - Avoid importing entire libraries, use tree-shaking

### Business Logic
- **Error boundary coverage** - Wrap components that may fail in error boundaries
- **Loading states** - Provide clear loading indicators for async operations
- **Accessibility (a11y)** - ARIA labels, keyboard navigation, focus management
- **Form validation** - Client-side validation with clear error messages
- **State management** - Proper use of local vs global state

## Required Output

When invoked, the response must exactly follow one of the two templates:

### Template A (any findings)

```
# Code review

Found N urgent issues need to be fixed:

## 1
FilePath: {path} line {number}

### Suggested fix
---
{code snippet with fix}

... (repeat for each urgent issue) ...

Found N suggestions for improvement:

## 1
FilePath: {path} line {number}

### Suggested fix
---
{code snippet with fix}

... (repeat for each suggestion) ...
```

If there are no urgent issues, omit that section. If there are no suggestions, omit that section.
If the issue number is more than 10, summarize as "10+ urgent issues" or "10+ suggestions" and just output the first 10 issues.

Don't compress the blank lines between sections; keep them as-is for readability.

If you use Template A (i.e., there are issues to fix) and at least one issue requires code changes, append a brief follow-up question after the structured output asking whether the user wants you to apply the suggested fix(es). For example: "Would you like me to use the Suggested fix section to address these issues?"

### Template B (no issues)

```
## Code review

No issues found.
```

## Common Issues by File Type

### .tsx Files
- Missing return type annotations
- Improper prop drilling (use context instead)
- useEffect dependency array issues
- Event handler inline definitions (performance)
- Missing error boundaries

### .ts Files
- Missing type exports
- Improper generic usage
- Circular dependencies
- Unused imports/exports

### .js Files
- Missing JSDoc comments for complex functions
- Implicit type coercion
- Missing null/undefined checks
- Console.log left in production code

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| **Urgent** | Must fix before merge | Blocks PR approval |
| **Suggestion** | Nice to have improvements | Can be addressed later |

## Tech Stack Specific

### React/Next.js
- Server Components vs Client Components distinction
- App Router conventions
- Metadata and SEO considerations
- Route handlers and API routes

### Tailwind CSS
- Utility class consistency
- Custom theme values
- Responsive breakpoint usage
- Dark mode support

### TypeScript
- Strict null checks
- Proper interface/type usage
- Generic constraints
- Module augmentation
