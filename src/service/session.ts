import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SessionData } from '@data/session';
import { format } from 'date-fns';

@Injectable({ providedIn: 'root' })
export default class Session {
  #expand = signal(true);
  expand = this.#expand.asReadonly();

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
}
