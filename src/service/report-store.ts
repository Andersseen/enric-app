import { computed, effect, Injectable, signal } from '@angular/core';
import { ActuacionData } from './excel.service';

const REPORT_STORE_KEY = 'enric_report_data';

@Injectable({
  providedIn: 'root',
})
export class ReportStore {
  // Signal to hold the list of rows
  #rows = signal<ActuacionData[]>(this.loadFromStorage());

  // Public read-only access
  rows = this.#rows.asReadonly();

  // Computed: Total count
  count = computed(() => this.#rows().length);

  constructor() {
    // Effect to auto-save to localStorage whenever rows change
    effect(() => {
      localStorage.setItem(REPORT_STORE_KEY, JSON.stringify(this.#rows()));
    });
  }

  /**
   * Add a single row
   */
  addRow(row: ActuacionData) {
    this.#rows.update((current) => [...current, row]);
  }

  /**
   * Add multiple rows (e.g. from import)
   */
  addRows(rows: ActuacionData[]) {
    this.#rows.update((current) => [...current, ...rows]);
  }

  /**
   * Set rows (replace all)
   */
  setRows(rows: ActuacionData[]) {
    this.#rows.set(rows);
  }

  /**
   * Remove a row by index
   */
  removeRow(index: number) {
    this.#rows.update((current) => current.filter((_, i) => i !== index));
  }

  /**
   * Clear all rows
   */
  clear() {
    this.#rows.set([]);
  }

  /**
   * Load initial data from localStorage
   */
  private loadFromStorage(): ActuacionData[] {
    const stored = localStorage.getItem(REPORT_STORE_KEY);
    return stored ? JSON.parse(stored) : [];
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
      },
    ];
    this.addRows(mock);
  }
}
