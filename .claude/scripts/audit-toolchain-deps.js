#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const MCP_CONFIG_PATH = path.join(ROOT_DIR, '.auto-coding/config/mcp.json');
const SKILLS_DIR = path.join(ROOT_DIR, '.claude/skills');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walkSkillFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSkillFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === 'SKILL.md') {
      files.push(fullPath);
    }
  }
  return files;
}

function extractFrontmatter(content) {
  if (!content.startsWith('---\n')) {
    return '';
  }
  const end = content.indexOf('\n---', 4);
  if (end === -1) {
    return '';
  }
  return content.slice(4, end);
}

function parseMcpDeps(frontmatter) {
  const lines = frontmatter.split('\n');
  const required = [];
  const optional = [];
  let section = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }
    if (line === 'mcp_required:') {
      section = 'required';
      continue;
    }
    if (line === 'mcp_optional:') {
      section = 'optional';
      continue;
    }
    if (/^[a-zA-Z0-9_-]+:\s*$/.test(line)) {
      section = null;
      continue;
    }
    if (line.startsWith('- ')) {
      const name = line.slice(2).trim().replace(/^["']|["']$/g, '');
      if (!name) {
        continue;
      }
      if (section === 'required') {
        required.push(name);
      }
      if (section === 'optional') {
        optional.push(name);
      }
    }
  }
  return { required, optional };
}

function main() {
  if (!fs.existsSync(MCP_CONFIG_PATH)) {
    console.error('Missing MCP config:', MCP_CONFIG_PATH);
    process.exit(1);
  }

  const mcpConfig = readJson(MCP_CONFIG_PATH);
  const configuredMcp = new Set(Object.keys(mcpConfig.servers || {}));
  const skillFiles = walkSkillFiles(SKILLS_DIR);
  const violations = [];
  let checkedSkills = 0;

  for (const skillFile of skillFiles) {
    const content = fs.readFileSync(skillFile, 'utf8');
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) {
      continue;
    }
    const deps = parseMcpDeps(frontmatter);
    if (deps.required.length === 0 && deps.optional.length === 0) {
      continue;
    }
    checkedSkills += 1;
    const allDeps = [...deps.required.map(name => ({ name, level: 'required' })), ...deps.optional.map(name => ({ name, level: 'optional' }))];
    for (const dep of allDeps) {
      if (!configuredMcp.has(dep.name)) {
        violations.push({
          skillFile,
          dependency: dep.name,
          level: dep.level
        });
      }
    }
  }

  console.log('\nToolchain Dependency Audit\n');
  console.log('Configured MCP servers:', [...configuredMcp].join(', ') || '(none)');
  console.log('Skills with declared MCP dependencies:', checkedSkills);

  if (violations.length === 0) {
    console.log('\nPASS: all declared MCP dependencies are verifiable in .auto-coding/config/mcp.json\n');
    process.exit(0);
  }

  console.error('\nFAIL: unresolved skill MCP dependencies detected:\n');
  for (const item of violations) {
    const relative = path.relative(ROOT_DIR, item.skillFile);
    console.error(`- ${relative} -> ${item.level} MCP "${item.dependency}" is not in mcp.json`);
  }
  console.error('\nFix by aligning skill declarations or MCP config.\n');
  process.exit(1);
}

main();
