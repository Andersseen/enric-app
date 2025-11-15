import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
  inject,
} from '@angular/core';
import { format } from 'date-fns';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

export interface SessionHeaderData {
  date: string;
  time: string;
  weather: string;
  worker: string;
}

@Component({
  selector: 'app-session-header',
  standalone: true,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCardSubtitle,
  ],
  template: `
    <ion-card class="session-card">
      <ion-card-header class="flex items-center justify-between gap-3 p-3">
        <div class="flex gap-4 items-center">
          <ion-card-title class="text-lg font-semibold">Datos de sesión</ion-card-title>
          <div>
            <ion-card-subtitle> {{ session().worker }}</ion-card-subtitle>
            <div class="text-xs">
              {{ session().date }} · {{ session().time }}· {{ session().weather }}
            </div>
          </div>
          <ion-button
            fill="clear"
            size="small"
            (click)="toggle()"
            [attr.aria-expanded]="expanded()"
            aria-controls="session-body"
            title="Mostrar / ocultar datos de sesión"
          >
            <ion-icon [name]="expanded() ? 'chevron-up' : 'chevron-down'"></ion-icon>
          </ion-button>
        </div>
      </ion-card-header>

      <ion-card-content
        id="session-body"
        [class.collapsed]="!expanded()"
        class="session-body px-3 pb-3 pt-0"
        role="region"
        [attr.aria-hidden]="!expanded()"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div class="flex flex-col">
            <ion-input
              label="Fecha"
              id="date"
              type="date"
              [value]="session().date"
              (ionChange)="update('date', $any($event.detail).value ?? $any($event.target).value)"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            />
          </div>

          <div class="flex flex-col">
            <ion-input
              label="Hora"
              id="time"
              type="time"
              [value]="session().time"
              (ionChange)="update('time', $any($event.detail).value ?? $any($event.target).value)"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            />
          </div>

          <div class="flex flex-col">
            <ion-select
              label="Climatología"
              interface="action-sheet"
              id="weather"
              [value]="session().weather"
              (ionChange)="update('weather', $any($event.detail).value)"
              placeholder="Seleccionar..."
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">Seleccionar...</ion-select-option>
              <ion-select-option value="Soleado">Soleado</ion-select-option>
              <ion-select-option value="Nublado">Nublado</ion-select-option>
              <ion-select-option value="Lluvioso">Lluvioso</ion-select-option>
              <ion-select-option value="Viento">Viento</ion-select-option>
            </ion-select>
          </div>

          <div class="flex flex-col">
            <ion-select
              interface="action-sheet"
              label="Trabajador"
              id="worker"
              [value]="session().worker"
              (ionChange)="update('worker', $any($event.detail).value)"
              placeholder="Seleccionar..."
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">Seleccionar...</ion-select-option>
              <ion-select-option value="Juan Pérez">Juan Pérez</ion-select-option>
              <ion-select-option value="Laura Gómez">Laura Gómez</ion-select-option>
              <ion-select-option value="Pedro Martínez">Pedro Martínez</ion-select-option>
              <ion-select-option value="Ana Torres">Ana Torres</ion-select-option>
            </ion-select>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .session-body {
        overflow: hidden;
        transition: max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 240ms ease;
        max-height: 1000px;
        opacity: 1;
      }

      .session-body.collapsed {
        max-height: 0;
        opacity: 0;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      .session-card {
        border-radius: 0.75rem;
      }
    `,
  ],
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

  expanded = signal(true);

  display = computed(() => `${this.session().date} ${this.session().time}`);

  constructor() {
    addIcons({ chevronUp, chevronDown });
  }

  toggle(): void {
    this.expanded.update((v) => !v);
  }

  update<K extends keyof SessionHeaderData>(key: K, value: string): void {
    this.session.update((s) => {
      const next = { ...s, [key]: value };
      this.sessionChange.emit(next);
      return next;
    });
  }
}
