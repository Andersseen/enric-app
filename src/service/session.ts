import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SessionData } from '@data/session';
import { format } from 'date-fns';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export default class Session {
  #expand = signal(true);
  expand = this.#expand.asReadonly();

  #workers = signal<string[]>([]);
  workers = this.#workers.asReadonly();

  constructor() {
    this.loadWorkers();
    this.loadSessionData();

    this.sessionForm.valueChanges.subscribe((val) => {
      // Update signal
      this.sessionData.set(val as SessionData);
      // Save to storage
      this.saveSessionData(val as SessionData);
    });
  }

  readonly initial = (): SessionData => {
    const now = new Date();
    return {
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      weather: '',
      worker: '',
    };
  };

  sessionData = signal(this.initial());

  sessionForm = inject(FormBuilder).group({
    date: [this.sessionData().date],
    time: [this.sessionData().time],
    weather: [this.sessionData().weather],
    worker: [this.sessionData().worker],
  });

  setExpand(value: boolean) {
    this.#expand.set(value);
  }

  private async loadWorkers() {
    const { value } = await Preferences.get({ key: 'workers' });
    if (value) {
      this.#workers.set(JSON.parse(value));
    } else {
      const defaults = ['Enric'];
      this.#workers.set(defaults);
      this.saveWorkers(defaults);
    }
  }

  private async loadSessionData() {
    const { value } = await Preferences.get({ key: 'enric_session_data' });
    if (value) {
      try {
        const data = JSON.parse(value);
        this.sessionData.set(data);
        this.sessionForm.patchValue(data, { emitEvent: false });
      } catch (e) {
        console.error('Error loading session data', e);
      }
    }
  }

  private async saveSessionData(data: SessionData) {
    await Preferences.set({
      key: 'enric_session_data',
      value: JSON.stringify(data),
    });
  }

  addWorker(name: string) {
    const current = this.#workers();
    if (!current.includes(name)) {
      const updated = [...current, name];
      this.#workers.set(updated);
      this.saveWorkers(updated);
    }
  }

  removeWorker(name: string) {
    const updated = this.#workers().filter((w) => w !== name);
    this.#workers.set(updated);
    this.saveWorkers(updated);
  }

  private async saveWorkers(workers: string[]) {
    await Preferences.set({
      key: 'workers',
      value: JSON.stringify(workers),
    });
  }
}
