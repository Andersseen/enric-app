import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FALCON_FLIGHT, FLIGHT_OPTION, isFlightMethod } from '@data/methods';
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
      [selected]="selected()"
      (select)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEight {
  #store = inject(ActionsStore);
  options = ['Bocina', 'Ahuyentador', 'Pirotecnia', 'Láser', 'Perro', FLIGHT_OPTION, 'Observación'];

  #method = computed(() => (this.#store.step8Value() as string | null) ?? null);
  // Con halcón o Harris se marca el botón "Vuelo dispersión"
  selected = computed(() => (isFlightMethod(this.#method()) ? FLIGHT_OPTION : this.#method()));

  onSelect(option: string) {
    if (option === FLIGHT_OPTION) {
      // Si ya era vuelo se mantiene el ave elegida; si no, se elige en la pantalla siguiente
      if (!isFlightMethod(this.#method())) this.#store.setValueForCurrentStep(FALCON_FLIGHT);
      return;
    }
    this.#store.setValueForCurrentStep(option);
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
