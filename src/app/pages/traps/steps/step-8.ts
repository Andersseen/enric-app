import { Component, inject } from '@angular/core';
import TextInputComponent from '@components/forms/text-input';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-eight',
  imports: [TextInputComponent],
  template: ` <app-text-input label="Animal empleado" (valueChange)="onInput($event)" /> `,
})
export class TrapsFormStepEight {
  #store = inject(TrapsStoreService);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'traps-step-eight',
  template: `
    <step-page>
      <traps-form-step-eight />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepEight],
})
export default class TrapsStepEight {}
