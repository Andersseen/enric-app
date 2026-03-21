import { computed, Injectable, signal } from '@angular/core';
import { ActuacionData } from './excel.service';
import { Preferences } from '@capacitor/preferences';

const REPORT_STORE_KEY = 'enric_report_data';
const REPORT_BACKUP_STORE_KEY = 'enric_report_data_backups';
const MAX_BACKUPS = 20;

interface ReportBackup {
  id: string;
  createdAt: string;
  rows: ActuacionData[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportStore {
  // Signal to hold the list of rows
  #rows = signal<ActuacionData[]>([]);
  #backups = signal<ReportBackup[]>([]);

  // Public read-only access
  rows = this.#rows.asReadonly();
  backups = this.#backups.asReadonly();

  // Computed: Total count
  count = computed(() => this.#rows().length);
  hasBackups = computed(() => this.#backups().length > 0);
  latestBackupDate = computed(() => {
    const latest = this.#backups()[0];
    return latest ? new Date(latest.createdAt) : null;
  });

  constructor() {
    this.loadInitialData();
    this.loadBackups();
  }

  /**
   * Load initial data from Preferences
   */
  private async loadInitialData() {
    const { value } = await Preferences.get({ key: REPORT_STORE_KEY });
    if (value) {
      this.#rows.set(JSON.parse(value));
    }
  }

  private async loadBackups() {
    const { value } = await Preferences.get({ key: REPORT_BACKUP_STORE_KEY });
    if (!value) return;

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        this.#backups.set(parsed);
      }
    } catch (error) {
      console.error('Error parsing backups', error);
    }
  }

  /**
   * Add a single row
   */
  addRow(row: ActuacionData) {
    this.#rows.update((current) => {
      const updated = [...current, row];
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Add multiple rows (e.g. from import)
   */
  addRows(rows: ActuacionData[]) {
    this.#rows.update((current) => {
      const updated = [...current, ...rows];
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Set rows (replace all)
   */
  setRows(rows: ActuacionData[]) {
    this.#rows.set(rows);
    this.saveToStorage(rows);
  }

  /**
   * Remove a row by index
   */
  removeRow(index: number) {
    this.#rows.update((current) => {
      const updated = current.filter((_, i) => i !== index);
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Clear all rows
   */
  async clear() {
    const currentRows = this.#rows();
    if (currentRows.length > 0) {
      await this.saveBackup(currentRows);
    }

    const empty: ActuacionData[] = [];
    this.#rows.set(empty);
    await this.saveToStorage(empty);
  }

  async restoreLatestBackup(): Promise<number> {
    const latest = this.#backups()[0];
    if (!latest) {
      return 0;
    }

    const restoredRows = [...latest.rows];
    this.#rows.set(restoredRows);
    await this.saveToStorage(restoredRows);
    return restoredRows.length;
  }

  /**
   * Save to Preferences
   */
  private async saveToStorage(rows: ActuacionData[]) {
    await Preferences.set({
      key: REPORT_STORE_KEY,
      value: JSON.stringify(rows),
    });
  }

  private async saveBackup(rows: ActuacionData[]) {
    const snapshot: ReportBackup = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      rows: [...rows],
    };

    const updatedBackups = [snapshot, ...this.#backups()].slice(0, MAX_BACKUPS);
    this.#backups.set(updatedBackups);

    await Preferences.set({
      key: REPORT_BACKUP_STORE_KEY,
      value: JSON.stringify(updatedBackups),
    });
  }

  generateMockData() {
    const mock: ActuacionData[] = [
      {
        zoneId: 'Pista 1',
        speciesId: 'Conejo',
        count: 5,
        behavior: 'Alimentándose',
        actionType: 'Revisión perro',
        method: 'Perro',
        animal: 'Rex',
        efficacy: 'Si',
        captured: 0,
        notes: 'Grupo disperso cerca de la cabecera.',
        operation: 'No',
        interaction: 'No',
        date: '2025-02-08',
        time: '09:00',
        weather: 'Soleado',
        worker: 'Juan',
      },
      {
        zoneId: 'Perímetro Norte',
        speciesId: 'Ninguna',
        count: 0,
        behavior: '',
        actionType: 'Revisión perimetral',
        method: '',
        animal: '',
        efficacy: 'Si',
        captured: 0,
        notes: 'No se observan daños.',
        operation: 'No',
        interaction: 'No',
        date: '2025-02-08',
        time: '10:30',
        weather: 'Nublado',
        worker: 'Ana',
      },
      {
        zoneId: 'Zona Sur',
        speciesId: 'Paloma',
        count: 20,
        behavior: 'Posadas',
        actionType: 'Vuelo de marcaje',
        method: 'Halcón',
        animal: 'Zeus',
        efficacy: 'Si',
        captured: 2,
        notes: 'Vuelo efectivo, bandada dispersada.',
        operation: 'Si',
        interaction: 'No',
        date: '2025-02-07',
        time: '16:45',
        weather: 'Viento',
        worker: 'Pedro',
      },
      {
        zoneId: 'Zona Pista',
        speciesId: 'Gaviota',
        count: 2,
        behavior: 'Posadas',
        actionType: 'Revisión pista',
        method: 'Vehículo',
        animal: '',
        efficacy: 'Si',
        captured: 0,
        notes: 'Dispersadas con pirotecnia.',
        operation: 'Si',
        interaction: 'No',
        date: '2025-02-06',
        time: '08:15',
        weather: 'Lluvioso',
        worker: 'Laura',
      },
    ];
    this.addRows(mock);
  }
}
