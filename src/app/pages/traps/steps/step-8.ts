import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import AnimalPickerComponent from '@components/forms/animal-picker';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-eight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimalPickerComponent],
  template: ` <app-animal-picker [value]="value()" (valueChange)="onSelect($event)" /> `,
})
export class TrapsFormStepEight {
  #store = inject(TrapsActionsStore);

  value = computed(() => (this.#store.step8Value() as string | null) ?? null);

  onSelect(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'traps-step-eight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-eight />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepEight],
})
export default class TrapsStepEight {}
