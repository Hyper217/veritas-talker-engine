import { copyFileSync, chmodSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, '.githooks', 'pre-push');
const hooksDir = path.join(root, '.git', 'hooks');
const target = path.join(hooksDir, 'pre-push');

if (!existsSync(path.join(root, '.git'))) {
  process.exit(0);
}

mkdirSync(hooksDir, { recursive: true });
copyFileSync(source, target);

try {
  chmodSync(target, 0o755);
} catch {
  // Windows may ignore chmod
}

console.log('Installed git pre-push hook for automatic version bumps.');
