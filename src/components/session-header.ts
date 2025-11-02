import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { format } from 'date-fns';

export interface SessionHeaderData {
  date: string;
  time: string;
  weather: string;
  worker: string;
}

@Component({
  selector: 'app-session-header',
  template: `
    <section class="rounded-xl border border-muted bg-surface p-4 shadow-sm space-y-4">
      <h1 class="text-lg font-semibold mb-2">Datos de sesión</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div class="flex flex-col">
          <label for="date" class="text-muted mb-1">Fecha</label>
          <input
            id="date"
            type="date"
            [value]="session().date"
            (change)="update('date', $any($event.target).value)"
            class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          />
        </div>

        <div class="flex flex-col">
          <label for="time" class="text-muted mb-1">Hora</label>
          <input
            id="time"
            type="time"
            [value]="session().time"
            (change)="update('time', $any($event.target).value)"
            class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          />
        </div>

        <div class="flex flex-col">
          <label for="weather" class="text-muted mb-1">Climatología</label>
          <select
            id="weather"
            [value]="session().weather"
            (change)="update('weather', $any($event.target).value)"
            class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          >
            <option value="">Seleccionar...</option>
            <option value="Soleado">Soleado</option>
            <option value="Nublado">Nublado</option>
            <option value="Lluvioso">Lluvioso</option>
            <option value="Viento">Viento</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label for="worker" class="text-muted mb-1">Trabajador</label>
          <select
            id="worker"
            [value]="session().worker"
            (change)="update('worker', $any($event.target).value)"
            class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
          >
            <option value="">Seleccionar...</option>
            <option value="Juan Pérez">Juan Pérez</option>
            <option value="Laura Gómez">Laura Gómez</option>
            <option value="Pedro Martínez">Pedro Martínez</option>
            <option value="Ana Torres">Ana Torres</option>
          </select>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export default class SessionHeaderComponent {
  readonly initial = (): SessionHeaderData => {
    const now = new Date();
    return {
      date: format(now, 'yyyy-MM-dd'),
      time: format(now, 'HH:mm'),
      weather: '',
      worker: '',
    };
  };

  session = signal<SessionHeaderData>(this.initial());

  sessionChange = output<SessionHeaderData>();

  update<K extends keyof SessionHeaderData>(key: K, value: string): void {
    this.session.update((s) => {
      const next = { ...s, [key]: value };
      this.sessionChange.emit(next);
      return next;
    });
  }
}
