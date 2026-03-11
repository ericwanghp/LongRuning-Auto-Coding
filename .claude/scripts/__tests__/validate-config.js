#!/usr/bin/env node
/**
 * validate-config.js
 *
 * JSON Schema validation for Auto-Coding Framework config files
 * Run: node .claude/scripts/__tests__/validate-config.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..');
const CONFIG_DIR = path.join(ROOT_DIR, '.auto-coding/config');

// Test results tracking
let passed = 0;
let failed = 0;
const errors = [];

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  };
  console.log(`${icons[type] || ''} ${message}`);
}

// ============================================================
// Schema Definitions
// ============================================================

const SCHEMAS = {
  'tasks.json': {
    required: ['version', 'project', 'features'],
    properties: {
      version: { type: 'string' },
      description: { type: 'string' },
      note: { type: 'string' },
      project: { type: ['string', 'object'] },
      settings: { type: 'object' },
      documents: { type: 'object' },
      parallelGroups: { type: 'object' },
      features: { type: 'array' }
    }
  },

  'mcp.json': {
    required: ['version', 'servers'],
    properties: {
      version: { type: 'string' },
      description: { type: 'string' },
      _comment: { type: 'string' },
      servers: { type: 'object' }
    }
  },

  'test-strategy.json': {
    required: ['version'],
    properties: {
      version: { type: 'string' },
      description: { type: 'string' },
      taskTypes: { type: 'object' },
      testCategories: { type: 'object' },
      hookTriggers: { type: 'object' }
    }
  },

  'framework-skills.json': {
    required: ['skills'],
    properties: {
      skills: {
        type: 'object',
        required: ['required', 'recommended'],
        properties: {
          required: { type: 'array' },
          recommended: { type: 'array' }
        }
      }
    }
  },

  'hooks.json': {
    required: ['hooks'],
    properties: {
      hooks: {
        type: 'object',
        properties: {
          PreToolUse: { type: 'array' },
          PostToolUse: { type: 'array' },
          Stop: { type: 'array' }
        }
      }
    }
  }
};

// ============================================================
// Validation Functions
// ============================================================

function validateType(value, expectedType) {
  // Handle array of types (e.g., ['string', 'object'])
  if (Array.isArray(expectedType)) {
    return expectedType.some(t => validateType(value, t));
  }

  if (expectedType === 'array') {
    return Array.isArray(value);
  }
  return typeof value === expectedType;
}

function validateObject(obj, schema, path = '') {
  const errs = [];

  // Check required properties
  if (schema.required) {
    for (const prop of schema.required) {
      if (!(prop in obj)) {
        errs.push(`${path} Missing required property: ${prop}`);
      }
    }
  }

  // Check property types
  if (schema.properties) {
    for (const [prop, propSchema] of Object.entries(schema.properties)) {
      if (prop in obj) {
        const value = obj[prop];
        const expectedType = propSchema.type;

        if (!validateType(value, expectedType)) {
          errs.push(`${path}.${prop} Expected type ${expectedType}, got ${typeof value}`);
        }

        // Recursively validate nested objects
        if (expectedType === 'object' && propSchema.properties && typeof value === 'object') {
          const nestedErrs = validateObject(value, propSchema, `${path}.${prop}`);
          errs.push(...nestedErrs);
        }
      }
    }
  }

  return errs;
}

function validateJsonFile(filePath, schema) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    const errs = validateObject(data, schema);

    return { valid: errs.length === 0, errors: errs };
  } catch (e) {
    return { valid: false, errors: [`Failed to parse JSON: ${e.message}`] };
  }
}

// ============================================================
// Main Validation
// ============================================================

function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       Auto-Coding Framework - Config Validation            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Config files to validate
  const configFiles = [
    { path: path.join(ROOT_DIR, '.auto-coding/tasks.json'), schema: SCHEMAS['tasks.json'] },
    { path: path.join(CONFIG_DIR, 'mcp.json'), schema: SCHEMAS['mcp.json'] },
    { path: path.join(CONFIG_DIR, 'test-strategy.json'), schema: SCHEMAS['test-strategy.json'] },
    { path: path.join(ROOT_DIR, '.claude/skills/framework-skills.json'), schema: SCHEMAS['framework-skills.json'] },
    { path: path.join(ROOT_DIR, '.claude/hooks/hooks.json'), schema: SCHEMAS['hooks.json'] }
  ];

  for (const { path: filePath, schema } of configFiles) {
    const fileName = path.basename(filePath);
    const dir = path.dirname(filePath).replace(ROOT_DIR, '');

    if (!fs.existsSync(filePath)) {
      log(`${dir}/${fileName} - File not found (skipped)`, 'warning');
      continue;
    }

    const result = validateJsonFile(filePath, schema);

    if (result.valid) {
      log(`${dir}/${fileName} - Valid`, 'success');
      passed++;
    } else {
      log(`${dir}/${fileName} - Invalid`, 'error');
      result.errors.forEach(err => {
        console.log(`     ${err}`);
        errors.push(`${fileName}: ${err}`);
      });
      failed++;
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('\n📊 Validation Summary:\n');
  console.log(`   Valid:   ${passed}`);
  console.log(`   Invalid: ${failed}`);
  console.log(`   Skipped: ${configFiles.length - passed - failed}`);
  console.log('─'.repeat(60));

  if (failed > 0) {
    console.log('\n❌ Some config files have validation errors\n');
    process.exit(1);
  } else {
    console.log('\n✅ All config files are valid\n');
    process.exit(0);
  }
}

main();
