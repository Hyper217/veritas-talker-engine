import { AppSettings, Product } from '../types';

export const BACKUP_VERSION = 1 as const;

export interface SessionBackup {
  id: string;
  name: string;
  items: Product[];
}

export interface AppBackup {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  app: 'veritas-talker-engine';
  catalog: Product[];
  settings: AppSettings;
  sessions: SessionBackup[];
}

export function buildBackup(
  catalog: Product[],
  settings: AppSettings,
  sessions: SessionBackup[]
): AppBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'veritas-talker-engine',
    catalog,
    settings,
    sessions,
  };
}

export function downloadBackup(backup: AppBackup): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `veritas-backup-${backup.exportedAt.slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseBackup(raw: string): AppBackup {
  const data = JSON.parse(raw) as Partial<AppBackup>;

  if (data.app !== 'veritas-talker-engine') {
    throw new Error('This file is not a Veritas Talker Engine backup.');
  }
  if (data.version !== BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${data.version}`);
  }
  if (!Array.isArray(data.catalog) || !data.settings) {
    throw new Error('Backup file is missing required data.');
  }

  return {
    version: BACKUP_VERSION,
    exportedAt: data.exportedAt || new Date().toISOString(),
    app: 'veritas-talker-engine',
    catalog: data.catalog,
    settings: data.settings,
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
  };
}

