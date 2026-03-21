import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';

@Component({
  selector: 'app-session-header',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    IonButton,
  ],
  template: `
    <ion-card>
      <ion-card-header class="p-0">
        <div
          class="flex items-center justify-between p-4 cursor-pointer min-h-16"
          (click)="toggle()"
          role="button"
          [attr.aria-expanded]="expanded()"
          aria-controls="session-body"
        >
          <div class="flex flex-col gap-1">
            <ion-card-title class="text-xl font-bold flex items-center gap-2">
              Datos de sesión
              @if (!expanded()) {
                <span class="text-sm font-normal text-gray-500"> (Click para editar) </span>
              }
            </ion-card-title>
            <div class="text-base text-gray-600">
              <span class="font-medium">{{
                sessionForm.get('worker')?.value || 'Sin asignar'
              }}</span>
              <span class="mx-2">·</span>
              <span>{{ sessionForm.get('date')?.value }}</span>
              <span class="mx-2">·</span>
              <span>{{ sessionForm.get('time')?.value }}</span>
            </div>
          </div>
          <ion-button shape="round" size="large" [class.rotate-180]="expanded()">
            <ion-icon name="chevron-down" size="large"></ion-icon>
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
        <form
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm"
          [formGroup]="sessionForm"
        >
          <div class="flex flex-col">
            <ion-input
              label="Fecha"
              formControlName="date"
              type="date"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            />
          </div>

          <div class="flex flex-col">
            <ion-input
              label="Hora"
              formControlName="time"
              type="time"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            />
          </div>

          <div class="flex flex-col">
            <ion-select
              label="Climatología"
              interface="action-sheet"
              formControlName="weather"
              placeholder="Seleccionar..."
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">Seleccionar...</ion-select-option>
              @for (weather of weatherOptions; track weather.value) {
                <ion-select-option [value]="weather.value">{{ weather.label }}</ion-select-option>
              }
            </ion-select>
          </div>

          <div class="flex flex-col">
            <ion-select
              interface="action-sheet"
              label="Trabajador"
              formControlName="worker"
              placeholder="Seleccionar..."
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">Seleccionar...</ion-select-option>
              @for (worker of workers(); track worker) {
                <ion-select-option [value]="worker">{{ worker }}</ion-select-option>
              }
            </ion-select>
          </div>
        </form>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      .session-body {
        overflow: hidden;
        transition:
          max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
          opacity 240ms ease;
        max-height: 1000px;
        opacity: 1;
      }

      .session-body.collapsed {
        max-height: 0;
        opacity: 0;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export default class SessionHeaderComponent {
  #session = inject(Session);

  weatherOptions = [
    { value: 'Soleado', label: 'Soleado' },
    { value: 'Nublado', label: 'Nublado' },
    { value: 'Lluvioso', label: 'Lluvioso' },
    { value: 'Viento', label: 'Viento' },
    { value: 'Claros', label: 'Claros' },
    { value: 'Lluvia', label: 'Lluvia' },
    { value: 'Tormenta', label: 'Tormenta' },
    { value: 'Viento fuerte', label: 'Viento fuerte' },
  ];

  expanded = computed(() => this.#session.expand());

  sessionForm = this.#session.sessionForm;

  workers = this.#session.workers;

  constructor() {
    addIcons({ chevronUp, chevronDown });
  }

  toggle(): void {
    this.#session.setExpand(!this.#session.expand());
  }
}
