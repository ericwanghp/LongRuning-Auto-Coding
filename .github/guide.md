# Claude Code GitHub Actions 使用手册

## 概述

这是一个智能代码助手工作流，支持自动代码审查、重构、测试生成、文档生成和安全审计。

---

## 快速开始

### 步骤 1：配置 Secrets

在 GitHub 仓库中配置 API Keys（假设：MiniMax为主，智谱为辅）：

```
Settings → Secrets and variables → Actions → Secrets
```

| Secret 名称 | 必填 | 说明 |
|------------|------|------|
| `MINIMAX_API_KEY` | ✅ 是 | MiniMax API Key（主模型） |
| `ZHIPU_API_KEY` | ✅ 是 | 智谱 API Key（备用模型） |

### 步骤 2：配置 Variable（可选）

```
Settings → Secrets and variables → Actions → Variables
```

| Variable 名称 | 默认值 | 说明 |
|--------------|--------|------|
| `DEFAULT_MODEL_PROVIDER` | `minimax` | 默认模型提供商（`minimax` 或 `zhipu`） |

---

## 触发方式

### 方式 1：自动触发（Push & PR 事件）
当 Push `main`、`master`、`develop` 时自动触发

当 Pull Request 针对 `main`、`master`、`develop` 分支发生以下事件时自动触发：

- PR 打开（opened）
- PR 更新（synchronize）
- PR 重新打开（reopened）

**默认行为**：
- 使用 `DEFAULT_MODEL_PROVIDER` 指定的模型（默认 `minimax`）
- 执行 `review`（代码审查）任务

### 方式 2：手动触发

在 GitHub Actions 页面手动运行：

```
Actions → Claude Code (Advanced) → Run workflow
```

---

## 任务类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `review` | 代码审查 | 检查代码质量、逻辑、性能、安全 |
| `refactor` | 代码重构 | 消除重复、改善命名、简化逻辑 |
| `test` | 生成测试 | 单元测试、边界条件、异常处理 |
| `document` | 生成文档 | 函数说明、参数、返回值、示例 |
| `security` | 安全审计 | 注入漏洞、认证授权、敏感数据 |

---

## 模型配置

| 提供商 | 模型 | 特点 |
|--------|------|------|
| **MiniMax**（主） | `MiniMax-M2.5` | 性能强大，适合复杂任务 |
| **Zhipu**（辅） | `glm-4-flash` | 响应快速，适合简单任务 |

---

## 输入参数说明（手动触发）

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `provider` | 是 | `minimax` | 模型提供商（`minimax` 或 `zhipu`） |
| `task_type` | 是 | `review` | 任务类型 |
| `auto_commit` | 否 | `false` | 是否自动提交修改 |
| `target_files` | 否 | - | 指定文件（逗号分隔，留空则自动检测） |

---

## 使用示例

### 示例 1：自动代码审查（PR 触发）

```bash
# 1. 创建 PR
git checkout -b feature/new-feature
git push origin feature/new-feature
# 在 GitHub 上创建 PR

# 2. 工作流自动运行，执行代码审查
# 3. 审查结果会作为评论添加到 PR
```

### 示例 2：手动生成测试

```
Actions → Claude Code (Advanced) → Run workflow
  - provider: minimax
  - task_type: test
  - auto_commit: false
  - target_files: src/utils/*.ts
```

### 示例 3：安全审计并自动提交

```
Actions → Claude Code (Advanced) → Run workflow
  - provider: minimax
  - task_type: security
  - auto_commit: true
```

---

## 输出报告

工作流完成后，会在 PR 中添加评论，包含：

| 项目 | 说明 |
|------|------|
| 任务类型 | 执行的任务 |
| 提供商 | 使用的模型 |
| 模型 | 具体模型名称 |
| 自动提交 | 是否已提交 |
| 触发方式 | PR 或手动 |
| 执行状态 | 成功或失败 |
| 分析文件 | 处理的文件列表 |

---

## 常见问题

### Q1: 为什么没有触发工作流？

**检查项**：
- PR 目标分支是否为 `main`、`master`、`develop`
- 是否配置了 `MINIMAX_API_KEY` 和 `ZHIPU_API_KEY`

### Q2: 工作流失败怎么办？

**可能原因**：
- API Key 无效或过期
- 模型服务不可用
- 文件格式不支持（仅支持 `.js`、`.ts`、`.py`、`.go` 等）

**解决方案**：
1. 检查 Secrets 配置
2. 尝试切换到备用模型（`zhipu`）
3. 查看 Actions 日志获取详细错误

### Q3: 如何切换到备用模型？

手动触发时选择 `provider: zhipu`，或设置 Variable `DEFAULT_MODEL_PROVIDER: zhipu`。

### Q4: 自动提交会覆盖我的代码吗？

不会。自动提交前会检查是否有改动，且只提交工作流产生的修改。建议在关键分支关闭 `auto_commit`。

---

## 最佳实践

### 1. 分支策略

| 分支 | 建议 |
|------|------|
| `feature/*` | 开启自动触发，`auto_commit: false` |
| `develop` | 开启自动触发，代码审查 |
| `main` | 手动触发，安全审计 |

### 2. 任务选择

| 场景 | 推荐任务 |
|------|----------|
| 日常开发 | `review` |
| 代码优化 | `refactor` |
| 发布前检查 | `security` + `test` |
| 新人代码 | `review` + `document` |

### 3. 节省资源

- 只在必要时启用 `auto_commit`
- 使用 `target_files` 限制文件范围
- 复杂任务使用 MiniMax，简单任务使用 Zhipu

---

## 成本估算

| 模型 | 相对成本 | 建议用途 |
|------|----------|----------|
| MiniMax-M2.5 | 中等 | 复杂任务、生产环境 |
| glm-4-flash | 低 | 简单任务、日常审查 |

---

## Policy & Toolchain Scan 门禁

除了 Claude Code 工作流，项目还配备了自动化策略扫描门禁。

### 功能说明

| 功能 | 说明 |
|------|------|
| **工具链审计** | 检查 MCP-Skill 依赖一致性 |
| **策略扫描** | 扫描代码规范、安全策略违规 |
| **SARIF 报告** | 生成标准化安全报告上传至 GitHub |

### 触发条件

| 事件 | 触发 |
|------|------|
| Push 到 `main`/`master` | ✅ |
| Pull Request | ✅ |
| 手动触发 | ✅ |

### 执行流程

```
┌─────────────────────────────────────────────────────────────┐
│  Policy & Toolchain Scan                                    │
├─────────────────────────────────────────────────────────────┤
│  1. Checkout 代码                                           │
│  2. Setup Node.js                                           │
│  3. Run toolchain dependency audit                          │
│     └── node .claude/scripts/audit-toolchain-deps.js        │
│  4. Run policy scan                                         │
│     └── node .claude/scripts/policy-check.js --strict       │
│  5. Upload SARIF artifact                                   │
│  6. Publish SARIF to GitHub Security                        │
└─────────────────────────────────────────────────────────────┘
```

### 扫描内容

#### 工具链审计 (`audit-toolchain-deps.js`)

检查 Skill 声明的 MCP 依赖与 `mcp.json` 配置的一致性：

| 检查项 | 说明 |
|--------|------|
| `mcp_required` | 必需的 MCP 服务器是否配置 |
| `mcp_optional` | 可选的 MCP 服务器是否配置 |
| 依赖匹配 | Skill 依赖是否在 mcp.json 中存在 |

#### 策略扫描 (`policy-check.js`)

| 扫描项 | 说明 |
|--------|------|
| 代码规范 | 命名、格式、结构 |
| 安全策略 | 敏感信息、权限控制 |
| 最佳实践 | Claude Code 使用规范 |

### 查看报告

扫描完成后可在以下位置查看结果：

| 位置 | 路径 |
|------|------|
| **GitHub Security** | Security → Code scanning alerts |
| **Actions Artifacts** | Actions → Policy & Toolchain Scan → Artifacts → policy-sarif |
| **PR 检查** | PR 页面 → Checks |

### 门禁失败处理

如果门禁扫描失败：

```bash
# 1. 本地运行工具链审计
node .claude/scripts/audit-toolchain-deps.js

# 2. 本地运行策略扫描
node .claude/scripts/policy-check.js --strict

# 3. 根据输出修复问题后重新提交
git add .
git commit -m "fix: resolve policy violations"
git push
```

### 常见问题

#### Q1: 工具链审计失败

**原因**：Skill 声明的 MCP 依赖在 `mcp.json` 中未配置

**解决**：
1. 检查 `.claude/skills/*/SKILL.md` 中的 `tooling_dependencies`
2. 确保 `.auto-coding/config/mcp.json` 中配置了对应的 MCP 服务器

#### Q2: 策略扫描失败

**原因**：代码违反项目策略

**解决**：
1. 查看 SARIF 报告了解具体违规项
2. 查看 `.claude/rules/` 目录下的规则定义
3. 修复违规后重新提交

#### Q3: Fork 的 PR 无法上传 SARIF

**原因**：安全限制，Fork 仓库无权限上传 SARIF

**解决**：这是预期行为，扫描结果会在 Actions 日志中显示

---
