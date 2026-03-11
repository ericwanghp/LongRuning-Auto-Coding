#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, '.claude/context/phase-manifest.json');
const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const findings = [];

function addFinding(severity, code, message, scope) {
  findings.push({ severity, code, message, scope });
}

function toDisplayPath(filePath) {
  const relative = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  return relative.startsWith('..') ? filePath : relative;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    addFinding('error', 'MANIFEST_MISSING', 'phase-manifest.json not found', '.claude/context/phase-manifest.json');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (error) {
    addFinding('error', 'MANIFEST_INVALID_JSON', `Invalid JSON: ${error.message}`, '.claude/context/phase-manifest.json');
    return null;
  }
}

function validatePathEntry(entry, scope) {
  if (typeof entry !== 'string' || entry.trim().length === 0) {
    addFinding('error', 'MANIFEST_PATH_INVALID', 'files entry must be a non-empty string', scope);
    return;
  }
  const resolved = path.resolve(ROOT_DIR, entry);
  if (!fs.existsSync(resolved)) {
    addFinding('error', 'MANIFEST_PATH_NOT_FOUND', `Path not found: ${entry}`, scope);
  }
}

function validateFiles(files, scope) {
  if (!Array.isArray(files)) {
    addFinding('error', 'MANIFEST_FILES_INVALID', 'files must be an array', scope);
    return;
  }
  const seen = new Set();
  files.forEach((entry) => {
    validatePathEntry(entry, scope);
    if (typeof entry === 'string') {
      if (seen.has(entry)) {
        addFinding('error', 'MANIFEST_FILES_DUPLICATE', `Duplicate file entry: ${entry}`, scope);
      }
      seen.add(entry);
    }
  });
}

function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') {
    return;
  }
  validateFiles(manifest.always_on_context?.files, 'always_on_context.files');

  if (!manifest.phases || typeof manifest.phases !== 'object') {
    addFinding('error', 'MANIFEST_PHASES_MISSING', 'phases object is required', 'phases');
    return;
  }

  Object.entries(manifest.phases).forEach(([phase, phaseData]) => {
    if (!phaseData || typeof phaseData !== 'object') {
      addFinding('error', 'MANIFEST_PHASE_INVALID', `phase ${phase} must be an object`, `phases.${phase}`);
      return;
    }
    validateFiles(phaseData.files, `phases.${phase}.files`);
  });
}

function printText() {
  if (findings.length === 0) {
    console.log(`PASS: ${toDisplayPath(MANIFEST_PATH)} is valid`);
    return;
  }
  findings.forEach((finding, index) => {
    const icon = finding.severity === 'error' ? '❌' : '⚠️ ';
    console.log(`${index + 1}. ${icon} [${finding.code}] ${finding.message}`);
    console.log(`   Scope: ${finding.scope}`);
  });
}

function printJson() {
  const payload = {
    file: toDisplayPath(MANIFEST_PATH),
    summary: {
      errors: findings.filter((f) => f.severity === 'error').length,
      warnings: findings.filter((f) => f.severity === 'warning').length
    },
    findings
  };
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
  const manifest = readManifest();
  validateManifest(manifest);
  if (jsonMode) {
    printJson();
  } else {
    printText();
  }
  const hasErrors = findings.some((f) => f.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}

main();
