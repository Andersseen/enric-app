import { Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-eight',
  imports: [TextInputComponent],
  template: ` <app-text-input label="Animal empleado" (valueChange)="onInput($event)" /> `,
})
export class FormStepEight {
  #store = inject(StoreService);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-eight',
  template: `
    <step-page>
      <form-step-eight />
    </step-page>
  `,
  imports: [StepPage, FormStepEight],
})
export default class StepEight {}
