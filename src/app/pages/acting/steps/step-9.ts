import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import StepPage from '.';
import AnimalPickerComponent from '@components/forms/animal-picker';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-nine',
  imports: [AnimalPickerComponent],
  template: `
    <app-animal-picker [kind]="kind()" [value]="value()" (valueChange)="onSelect($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepNine {
  #store = inject(ActionsStore);

  value = computed(() => (this.#store.step9Value() as string | null) ?? null);

  // Según el método elegido en el paso 8 se muestran perros o halcones
  kind = computed(() => (this.#store.step8Value() === 'Perro' ? 'dog' : 'falcon'));

  onSelect(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-nine',
  template: `
    <step-page>
      <form-step-nine />
    </step-page>
  `,
  imports: [StepPage, FormStepNine],
})
export default class StepNine {}
