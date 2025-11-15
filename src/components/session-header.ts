import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import Session from '@service/session';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-header',
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
    ReactiveFormsModule,
  ],
  template: `
    <ion-card>
      <ion-card-header class="flex items-center justify-between gap-3 p-3">
        <div class="flex gap-4 items-center">
          <ion-card-title class="text-lg font-semibold">Datos de sesión</ion-card-title>
          <div>
            <ion-card-subtitle> {{ sessionForm.get('worker')?.value }}</ion-card-subtitle>
            <div class="text-xs">
              {{ sessionForm.get('date')?.value }} · {{ sessionForm.get('time')?.value }}·
              {{ sessionForm.get('weather')?.value }}
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
              formControlName="worker"
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
        </form>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export default class SessionHeaderComponent {
  #session = inject(Session);

  expanded = computed(() => this.#session.expand());

  sessionForm = this.#session.sessionForm;

  constructor() {
    addIcons({ chevronUp, chevronDown });
    console.log(this.sessionForm);
  }

  toggle(): void {
    this.#session.setExpand(!this.#session.expand());
  }
}
