import { execSync } from 'node:child_process';
import { bumpVersion } from './bump-version.mjs';

if (process.env.VERITAS_VERSION_BUMPED === '1') {
  process.exit(0);
}

const { updated } = bumpVersion();

execSync('git add package.json package-lock.json src/version.ts', { stdio: 'inherit' });

try {
  execSync('git diff --staged --quiet', { stdio: 'ignore' });
  process.exit(0);
} catch {
  execSync(
    `git -c user.name="Hyper217" -c user.email="280521659+Hyper217@users.noreply.github.com" commit -m "chore: bump version to ${updated}"`,
    { stdio: 'inherit' }
  );

  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  execSync(`git push origin ${branch}`, {
    stdio: 'inherit',
    env: { ...process.env, VERITAS_VERSION_BUMPED: '1' },
  });

  process.exit(1);
}
