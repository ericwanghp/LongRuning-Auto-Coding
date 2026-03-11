# Testing Strategy

> Comprehensive testing strategy for the Auto-Coding Framework

---

## 1. Test Pyramid

The test pyramid defines the optimal distribution of test types:

```
                    ┌─────┐
                   /  E2E  \         10% - Slow, High Confidence
                  /─────────\
                 / Integration \      20-30% - Medium Speed
                /───────────────\
               /    Unit Tests    \   60-70% - Fast, Isolated
              /─────────────────────\
```

### Distribution by Task Type

| Task Type | Unit | Integration | E2E | Other |
|-----------|------|-------------|-----|-------|
| Frontend | 70% | 20% | 10% | - |
| Backend | 60% | 30% | 10% | Contract |
| Data Engineering | 50% | 40% | - | Data Quality 10% |
| Algorithm | 70% | 10% | - | Benchmark 20% |
| Infrastructure | 40% | 40% | - | Chaos 20% |

---

## 2. Test Categories

### 2.1 Unit Tests

**Purpose**: Test individual functions, classes, or components in isolation.

| Attribute | Value |
|-----------|-------|
| Speed | Fast (< 100ms per test) |
| Scope | Single function/class |
| Dependencies | Mocked |
| Run On | pre-commit, pre-push, CI |

**Tools**: Vitest, Jest, Pytest

**Best Practices**:
- One assertion per test (when practical)
- Descriptive test names
- Arrange-Act-Assert pattern
- Test edge cases and error paths

### 2.2 Integration Tests

**Purpose**: Test interactions between multiple components or services.

| Attribute | Value |
|-----------|-------|
| Speed | Medium (100ms - 5s) |
| Scope | Multiple components |
| Dependencies | Real or containerized |
| Run On | CI, pre-merge |

**Tools**: Supertest, Playwright, TestContainers

**Best Practices**:
- Use test databases (not production)
- Clean up data between tests
- Test API contracts
- Verify data flow

### 2.3 End-to-End (E2E) Tests

**Purpose**: Test complete user journeys through the application.

| Attribute | Value |
|-----------|-------|
| Speed | Slow (> 5s) |
| Scope | Full system |
| Dependencies | All real services |
| Run On | CI, pre-merge, release |

**Tools**: Playwright, Cypress, Puppeteer

**Best Practices**:
- Focus on critical user paths
- Use page object models
- Implement retry logic
- Parallelize execution

### 2.4 Contract Tests

**Purpose**: Verify API interfaces match expected specifications.

| Attribute | Value |
|-----------|-------|
| Speed | Fast |
| Scope | API boundaries |
| Dependencies | Mocked |
| Run On | CI, pre-merge |

**Tools**: Pact, Schemathesis, OpenAPI Validator

### 2.5 Data Quality Tests

**Purpose**: Ensure data integrity, accuracy, and completeness.

| Attribute | Value |
|-----------|-------|
| Speed | Variable |
| Scope | Data pipelines |
| Dependencies | Real data |
| Run On | Scheduled, post-deploy |

**Tools**: Great Expectations, dbt tests, SQLFluff

### 2.6 Performance Tests

**Purpose**: Measure system performance under load.

| Attribute | Value |
|-----------|-------|
| Speed | Slow |
| Scope | System |
| Dependencies | Real |
| Run On | CI, scheduled, release |

**Tools**: k6, Locust, pytest-benchmark

### 2.7 Security Tests

**Purpose**: Identify security vulnerabilities.

| Attribute | Value |
|-----------|-------|
| Speed | Variable |
| Scope | Full system |
| Dependencies | Real |
| Run On | CI, scheduled, release |

**Tools**: OWASP ZAP, Snyk, SonarQube

---

## 3. Task-Based Strategy Selection

### 3.1 Frontend Development

```yaml
taskType: frontend
testPyramid:
  unit: 70
  integration: 20
  e2e: 10

strategies:
  small:  # Single component/page
    tests: [unit]
    execution: local
    timeLimit: 30s

  medium:  # Multi-component interaction
    tests: [unit, integration]
    execution: local
    timeLimit: 2m

  large:  # Complex feature module
    tests: [unit, integration, e2e]
    execution: ci
    timeLimit: 5m
```

### 3.2 Backend Development

```yaml
taskType: backend
testPyramid:
  unit: 60
  integration: 30
  e2e: 10

strategies:
  small:  # Single API/service
    tests: [unit, contract]
    execution: local
    timeLimit: 30s

  medium:  # Multi-API interaction
    tests: [unit, integration, contract]
    execution: local
    timeLimit: 2m

  large:  # Microservice/complex logic
    tests: [unit, integration, contract, e2e]
    execution: ci
    timeLimit: 10m
```

### 3.3 Data Engineering

```yaml
taskType: data-engineering
testPyramid:
  unit: 50
  integration: 40
  data-quality: 10

strategies:
  small:  # Single transformation
    tests: [unit, data-quality]
    execution: local
    timeLimit: 1m

  medium:  # ETL pipeline
    tests: [unit, integration, data-quality]
    execution: scheduled
    timeLimit: 5m

  large:  # Data lake/warehouse
    tests: [unit, integration, data-quality, regression]
    execution: ci
    timeLimit: 30m
```

---

## 4. Coverage Requirements

This section is the single authority for numeric coverage thresholds. Other rules, agents, and skills must reference this section and must not redefine percentage thresholds.

### Minimum Coverage Thresholds

| Task Type | Critical | Standard | Minimum |
|-----------|----------|----------|---------|
| Frontend | 80% | 70% | 60% |
| Backend | 85% | 75% | 65% |
| Data Engineering | 90% | 80% | 70% |
| Algorithm | 90% | 85% | 80% |
| Infrastructure | 80% | 70% | 60% |

### Coverage Rules

1. **Critical paths**: Must have 100% coverage
2. **Error handling**: Must have at least 80% coverage
3. **New code**: Must meet standard threshold
4. **Legacy code**: Must meet minimum threshold

---

## 5. Hook Triggers

### Pre-commit

```yaml
tests: [lint, unit]
timeout: 1m
failStrategy: block
```

### Pre-push

```yaml
tests: [lint, unit, integration]
timeout: 5m
failStrategy: block
```

### Pre-merge

```yaml
tests: [lint, unit, integration, e2e, contract]
timeout: 15m
failStrategy: block
```

### Post-task

```yaml
tests: [unit, integration]
timeout: 5m
failStrategy: warn
```

### CI Pipeline

```yaml
tests: [lint, unit, integration, e2e, security]
timeout: 30m
failStrategy: block
```

### Release

```yaml
tests: [lint, unit, integration, e2e, security, benchmark]
timeout: 1h
failStrategy: block
```

---

## 6. Environment Matrix

| Environment | Tests | Database | Services |
|-------------|-------|----------|----------|
| Local | unit, lint | sqlite/memory | mocked |
| Staging | integration, e2e, contract | staging-db | real |
| Production | smoke, monitoring | production-db | real |

---

## 7. Scale Thresholds

| Scale | Estimated Hours | Files Changed | Test Time | Parallelization |
|-------|-----------------|---------------|-----------|-----------------|
| Small | < 4 | < 10 | < 30s | No |
| Medium | 4-16 | 10-50 | < 2m | Yes |
| Large | > 16 | > 50 | > 2m | Yes (CI required) |

---

## 8. Test Commands Reference

### NPM Scripts

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Linting
npm run lint
npm run lint:fix

# Security scanning
npm audit
```

### Framework Test Scripts

```bash
# Run E2E tests
node .claude/scripts/e2e-test.js

# Dry run (show test plan)
node .claude/scripts/e2e-test.js --dry-run

# Test specific feature
node .claude/scripts/e2e-test.js --task=FEAT-001

# Show test strategy
node .claude/scripts/test-framework.js strategy backend medium
```

---

## 9. Best Practices

### Test Writing

1. **Descriptive names**: Test names should describe the expected behavior
2. **AAA Pattern**: Arrange, Act, Assert
3. **One concept per test**: Don't test multiple things in one test
4. **Independent tests**: Tests should not depend on each other
5. **Deterministic**: Same input should always produce same output

### Test Data

1. **Use factories**: Create test data programmatically
2. **Clean up**: Always clean up test data after tests
3. **Isolation**: Each test should have its own data
4. **Realistic**: Use realistic data that represents production

### CI/CD Integration

1. **Fast feedback**: Optimize for quick test execution
2. **Parallel execution**: Run tests in parallel when possible
3. **Flaky test handling**: Quarantine flaky tests
4. **Artifact storage**: Store test reports and coverage

---

## 10. Quick Reference

### Test Selection Guide

```
Task Type: Frontend
├── Small (single component)  → unit tests
├── Medium (multi-component)  → unit + integration
└── Large (feature module)    → unit + integration + e2e

Task Type: Backend
├── Small (single API)        → unit + contract
├── Medium (multi-API)        → unit + integration + contract
└── Large (microservice)      → unit + integration + contract + e2e

Task Type: Data
├── Small (transformation)    → unit + data-quality
├── Medium (ETL pipeline)     → unit + integration + data-quality
└── Large (data warehouse)    → all + regression

Task Type: Algorithm
├── Small (single algo)       → unit + benchmark
├── Medium (optimization)     → unit + benchmark + integration
└── Large (ML system)         → all + regression
```

### File Locations

```
.claude/rules/09-testing.md     ← This document (test strategy rules)
.claude/scripts/e2e-test.js     ← E2E test runner
.claude/scripts/test-framework.js ← Test utilities
.auto-coding/config/test-strategy.json ← Project-specific overrides
```

---

> **Note**: For project-specific test configuration overrides, see `.auto-coding/config/test-strategy.json`.
