import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import { saveAs } from 'file-saver';
import { fileTimestamp } from './excel-cells';

/** Datos que se guardan en la copia de seguridad (claves de Preferences). */
const BACKUP_KEYS = [
  'workers',
  'animals',
  'enric_favorite_birds',
  'enric_session_data',
  'enric_report_data',
  'enric_report_data_backups',
  'enric_scf_full_report_state',
  'app-locale',
];

const BACKUP_FORMAT = 'fauna-tech-backup';

interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: 1;
  createdAt: string;
  data: Record<string, string>;
}

/** Copia de seguridad completa: trabajadores, animales, favoritos, reportes y SCF. */
@Injectable({ providedIn: 'root' })
export class BackupService {
  async export(): Promise<void> {
    const data: Record<string, string> = {};
    for (const key of BACKUP_KEYS) {
      const { value } = await Preferences.get({ key });
      if (value != null) data[key] = value;
    }

    const backup: BackupFile = {
      format: BACKUP_FORMAT,
      version: 1,
      createdAt: new Date().toISOString(),
      data,
    };
    const json = JSON.stringify(backup);
    const filename = `fauna-tech-copia_${fileTimestamp()}.json`;

    if (Capacitor.isNativePlatform()) {
      // Se guarda en caché y se abre el menú de compartir (Drive, WhatsApp, etc.)
      const { uri } = await Filesystem.writeFile({
        path: filename,
        data: json,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      await Share.share({ title: filename, files: [uri] });
      return;
    }

    saveAs(new Blob([json], { type: 'application/json' }), filename);
  }

  /** Restaura una copia. Devuelve cuántos datos se han restaurado. */
  async import(file: File): Promise<number> {
    let backup: Partial<BackupFile>;
    try {
      backup = JSON.parse(await file.text());
    } catch {
      throw new Error('invalid');
    }
    if (backup.format !== BACKUP_FORMAT || !backup.data || typeof backup.data !== 'object') {
      throw new Error('invalid');
    }

    let restored = 0;
    for (const key of BACKUP_KEYS) {
      const value = backup.data[key];
      if (typeof value === 'string') {
        await Preferences.set({ key, value });
        restored++;
      }
    }
    return restored;
  }
}
