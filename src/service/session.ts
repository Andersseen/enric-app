import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecordMeta, SessionData } from '@data/session';
import { WEATHER_OPTIONS } from '@data/weather';
import { format } from 'date-fns';
import { Preferences } from '@capacitor/preferences';

const SESSION_STORAGE_KEY = 'enric_session_data';
const WORKERS_STORAGE_KEY = 'workers';

@Injectable({ providedIn: 'root' })
export default class Session {
  #expand = signal(true);
  expand = this.#expand.asReadonly();

  #workers = signal<string[]>([]);
  workers = this.#workers.asReadonly();

  sessionForm = inject(FormBuilder).nonNullable.group({
    weather: [''],
    worker: [''],
  });

  constructor() {
    this.loadWorkers();
    this.loadSessionData();

    this.sessionForm.valueChanges.subscribe(() => this.saveSessionData());
  }

  /**
   * Datos comunes de una fila: trabajador y climatología de la sesión,
   * y la fecha y hora reales del momento en que se guarda.
   */
  recordMeta(): RecordMeta {
    const now = new Date();
    const { weather, worker } = this.sessionForm.getRawValue();
    return {
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      weather,
      worker,
    };
  }

  setExpand(value: boolean): void {
    this.#expand.set(value);
  }

  addWorker(name: string): void {
    const current = this.#workers();
    if (!current.includes(name)) {
      const updated = [...current, name];
      this.#workers.set(updated);
      this.saveWorkers(updated);
    }
  }

  removeWorker(name: string): void {
    const updated = this.#workers().filter((w) => w !== name);
    this.#workers.set(updated);
    this.saveWorkers(updated);
  }

  private async loadWorkers(): Promise<void> {
    const { value } = await Preferences.get({ key: WORKERS_STORAGE_KEY });
    if (value) {
      this.#workers.set(JSON.parse(value));
    } else {
      const defaults = ['Enric'];
      this.#workers.set(defaults);
      this.saveWorkers(defaults);
    }
  }

  private async loadSessionData(): Promise<void> {
    const { value } = await Preferences.get({ key: SESSION_STORAGE_KEY });
    if (!value) return;
    try {
      const stored = JSON.parse(value) as Partial<SessionData>;
      // Una climatología que ya no está en la lista se descarta para volver a elegirla
      const weather = WEATHER_OPTIONS.includes(stored.weather ?? '') ? stored.weather! : '';
      this.sessionForm.patchValue(
        { weather, worker: stored.worker ?? '' },
        { emitEvent: false },
      );
    } catch (e) {
      console.error('Error loading session data', e);
    }
  }

  private async saveSessionData(): Promise<void> {
    const data: SessionData = this.sessionForm.getRawValue();
    await Preferences.set({ key: SESSION_STORAGE_KEY, value: JSON.stringify(data) });
  }

  private async saveWorkers(workers: string[]): Promise<void> {
    await Preferences.set({ key: WORKERS_STORAGE_KEY, value: JSON.stringify(workers) });
  }
}
