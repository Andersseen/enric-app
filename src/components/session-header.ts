import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import Session from '@service/session';
import { WEATHER_OPTIONS } from '@data/weather';
import { optionKey } from '@i18n/options';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-session-header',
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
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
              {{ t('session.title') }}
              @if (!expanded()) {
                <span class="text-sm font-normal text-muted"> {{ t('session.tapToEdit') }} </span>
              }
            </ion-card-title>
            <div class="text-base text-muted">
              <span class="font-medium">{{
                sessionForm.get('worker')?.value || t('session.unassigned')
              }}</span>
              <span class="mx-2">·</span>
              <span>{{ weatherLabel(sessionForm.get('weather')?.value) || t('session.noWeather') }}</span>
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
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 text-sm"
          [formGroup]="sessionForm"
        >
          <div class="flex flex-col">
            <ion-select
              [label]="t('session.weather')"
              interface="action-sheet"
              formControlName="weather"
              [placeholder]="t('common.select')"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">{{ t('common.select') }}</ion-select-option>
              @for (weather of weatherOptions; track weather.value) {
                <ion-select-option [value]="weather.value">{{ weatherLabel(weather.value) }}</ion-select-option>
              }
            </ion-select>
          </div>

          <div class="flex flex-col">
            <ion-select
              interface="action-sheet"
              [label]="t('session.worker')"
              formControlName="worker"
              [placeholder]="t('common.select')"
              class="rounded-lg border border-muted bg-surface px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2 ring-primary"
            >
              <ion-select-option value="">{{ t('common.select') }}</ion-select-option>
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
  protected t = injectT(i18n);
  #session = inject(Session);

  weatherOptions = WEATHER_OPTIONS.map((w) => ({ value: w }));

  /** Texto traducido de una climatología (el valor guardado sigue en castellano). */
  weatherLabel(value: string | null | undefined): string {
    if (!value) return '';
    const key = optionKey('weather', value);
    return key ? this.t(key) : value;
  }

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
