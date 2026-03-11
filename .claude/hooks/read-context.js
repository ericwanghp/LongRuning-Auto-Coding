#!/usr/bin/env node
/**
 * read-context.js
 *
 * Lightweight pre-task context loader:
 * - recent git history
 * - progress summary
 * - phase-specific context pointers
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Script is in .claude/hooks/
// Project root is ../../ from here
const ROOT_DIR = path.resolve(__dirname, '../../');
const PROGRESS_PATH = path.join(ROOT_DIR, '.auto-coding/progress.txt');
const PROGRESS_SUMMARY_PATH = path.join(ROOT_DIR, '.auto-coding/progress-summary.md');
const PHASE_MANIFEST_PATH = path.join(ROOT_DIR, '.claude/context/phase-manifest.json');

function getLastSessionFromProgress(progressPath = PROGRESS_PATH, maxBytes = 65536) {
  if (!fs.existsSync(progressPath)) {
    return { lastSession: null, bytesRead: 0, fileSize: 0 };
  }

  const stats = fs.statSync(progressPath);
  const fileSize = stats.size;
  const bytesToRead = Math.min(fileSize, maxBytes);

  let content = '';
  if (fileSize <= maxBytes) {
    content = fs.readFileSync(progressPath, 'utf8');
  } else {
    const fd = fs.openSync(progressPath, 'r');
    try {
      const buffer = Buffer.alloc(bytesToRead);
      fs.readSync(fd, buffer, 0, bytesToRead, fileSize - bytesToRead);
      content = buffer.toString('utf8');
    } finally {
      fs.closeSync(fd);
    }
  }

  const sessions = content.split('---').filter(s => s.trim().length > 0);
  if (sessions.length === 0) {
    return { lastSession: null, bytesRead: bytesToRead, fileSize };
  }

  return {
    lastSession: sessions[sessions.length - 1].trim(),
    bytesRead: bytesToRead,
    fileSize
  };
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function getActivePhase() {
  const raw = process.env.AUTO_CODING_PHASE || '';
  const phase = raw.trim();
  return phase || null;
}

function formatProgressSummary() {
  if (fs.existsSync(PROGRESS_SUMMARY_PATH)) {
    return fs.readFileSync(PROGRESS_SUMMARY_PATH, 'utf8').trim();
  }

  const { lastSession } = getLastSessionFromProgress(PROGRESS_PATH);
  if (!lastSession) {
    return '(No progress summary available)';
  }

  const lines = lastSession
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed.startsWith('# Session:') ||
        trimmed.startsWith('## Ending State') ||
        trimmed.startsWith('## Next Steps') ||
        trimmed.startsWith('- ')
      );
    });

  return lines.slice(0, 12).join('\n') || '(No progress summary available)';
}

function getPhasePointers() {
  const manifest = readJsonSafe(PHASE_MANIFEST_PATH);
  const phase = getActivePhase();

  if (!manifest || !phase || !manifest.phases || !manifest.phases[phase]) {
    return null;
  }

  return {
    phase,
    data: manifest.phases[phase]
  };
}

function main() {
  console.log('\n=== Context Reading (Compact) ===\n');

  // 1. Read Git History
  try {
    console.log('--- Last 3 commits ---');
    // Check if it's a git repo
    if (fs.existsSync(path.join(ROOT_DIR, '.git'))) {
      const gitLog = execSync('git log --oneline -n 3', { cwd: ROOT_DIR, encoding: 'utf8' });
      console.log(gitLog.trim());
    } else {
      console.log('Not a git repository');
    }
  } catch (e) {
    console.log(`Cannot read git history: ${e.message}`);
  }

  console.log('');

  // 2. Read progress summary
  try {
    console.log('--- Progress Summary ---');
    console.log(formatProgressSummary());
  } catch (e) {
    console.log(`Cannot read progress summary: ${e.message}`);
  }

  console.log('');

  // 3. Show phase-specific pointers if available
  try {
    const phasePointers = getPhasePointers();
    console.log('--- Phase Context ---');

    if (!phasePointers) {
      console.log('Set AUTO_CODING_PHASE=1..8 to load phase-specific context pointers.');
    } else {
      console.log(`Active phase: ${phasePointers.phase}`);
      console.log(`Purpose: ${phasePointers.data.purpose}`);
      if (Array.isArray(phasePointers.data.files) && phasePointers.data.files.length > 0) {
        console.log('Essential files:');
        phasePointers.data.files.forEach((filePath) => console.log(`- ${filePath}`));
      }
    }
  } catch (e) {
    console.log(`Cannot read phase manifest: ${e.message}`);
  }

  console.log('\n' + '-'.repeat(30) + '\n');
}

module.exports = { getLastSessionFromProgress };

if (require.main === module) {
  main();
}
