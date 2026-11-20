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
    date: [format(new Date(), 'yyyy-MM-dd')],
    time: [format(new Date(), 'HH:mm')],
  });

  /**
   * false: la fecha y la hora siguen al reloj (cada registro lleva la hora real).
   * true: el usuario las ha cambiado (p. ej. para un reporte a posteriori) y se
   * usan las que ha puesto hasta que pulse "Ahora".
   */
  #manualDateTime = signal(false);
  manualDateTime = this.#manualDateTime.asReadonly();

  constructor() {
    this.loadWorkers();
    this.loadSessionData();

    this.sessionForm.controls.weather.valueChanges.subscribe(() => this.saveSessionData());
    this.sessionForm.controls.worker.valueChanges.subscribe(() => this.saveSessionData());
    // Cualquier cambio de fecha u hora hecho por el usuario la deja fija
    this.sessionForm.controls.date.valueChanges.subscribe(() => this.#manualDateTime.set(true));
    this.sessionForm.controls.time.valueChanges.subscribe(() => this.#manualDateTime.set(true));

    // Mientras no se haya cambiado a mano, la fecha y hora mostradas van con el reloj
    setInterval(() => {
      if (!this.#manualDateTime()) this.#syncDateTime();
    }, 15_000);
  }

  /** Vuelve a la fecha y hora actuales (y a que se actualicen solas). */
  useCurrentDateTime(): void {
    this.#manualDateTime.set(false);
    this.#syncDateTime();
  }

  /**
   * Datos comunes de una fila: trabajador y climatología de la sesión, y la
   * fecha y hora elegidas a mano o, si no se han cambiado, las del momento.
   */
  recordMeta(): RecordMeta {
    if (!this.#manualDateTime()) this.#syncDateTime();
    const { weather, worker, date, time } = this.sessionForm.getRawValue();
    const now = new Date();
    return {
      date: date || format(now, 'yyyy-MM-dd'),
      time: time || format(now, 'HH:mm'),
      weather,
      worker,
    };
  }

  #syncDateTime(): void {
    const now = new Date();
    this.sessionForm.patchValue(
      { date: format(now, 'yyyy-MM-dd'), time: format(now, 'HH:mm') },
      { emitEvent: false },
    );
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
    // Fecha y hora no se guardan: al abrir la app se vuelve a la hora actual
    const { weather, worker } = this.sessionForm.getRawValue();
    const data: SessionData = { weather, worker };
    await Preferences.set({ key: SESSION_STORAGE_KEY, value: JSON.stringify(data) });
  }

  private async saveWorkers(workers: string[]): Promise<void> {
    await Preferences.set({ key: WORKERS_STORAGE_KEY, value: JSON.stringify(workers) });
  }
}
