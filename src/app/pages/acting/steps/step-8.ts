import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FALCON_FLIGHT, HARRIS_FLIGHT, isFlightMethod } from '@data/methods';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-eight',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      group="method"
      [items]="options"
      [selected]="mainSelected()"
      (select)="onSelect($event)"
    />

    <!-- Vuelo dispersión: elegir Halcón o Harris -->
    @if (isFlight()) {
      <h3 class="text-lg font-semibold text-center mt-4 mb-1">{{ t('steps.flightBird') }}</h3>
      <app-selection-grid
        group="flightMethod"
        compact
        [items]="flightBirds"
        [selected]="flightBird()"
        (select)="onSelectBird($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEight {
  protected t = injectT(i18n);
  #store = inject(ActionsStore);
  options = [
    'Bocina',
    'Ahuyentador',
    'Pirotecnia',
    'Láser',
    'Perro',
    FALCON_FLIGHT,
    'Observación',
  ];
  flightBirds = ['Halcón', 'Harris'];

  #method = computed(() => (this.#store.step8Value() as string | null) ?? null);
  isFlight = computed(() => isFlightMethod(this.#method()));
  // Con Harris se marca igualmente la opción de vuelo de dispersión
  mainSelected = computed(() => (this.isFlight() ? FALCON_FLIGHT : this.#method()));
  flightBird = computed(() => (this.#method() === HARRIS_FLIGHT ? 'Harris' : 'Halcón'));

  onSelect(option: string) {
    // Al elegir el vuelo se queda con el ave ya elegida (Halcón por defecto)
    if (option === FALCON_FLIGHT && this.isFlight()) return;
    this.#store.setValueForCurrentStep(option);
  }

  onSelectBird(bird: string) {
    this.#store.setValueForCurrentStep(bird === 'Harris' ? HARRIS_FLIGHT : FALCON_FLIGHT);
  }
}

@Component({
  selector: 'step-eight',
  template: `
    <step-page>
      <form-step-eight />
    </step-page>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPage, FormStepEight],
})
export default class StepEight {}
