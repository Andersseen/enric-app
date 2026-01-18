import { Component, inject } from '@angular/core';
import TextInputComponent from '@components/forms/text-input';
import PreventionStore from '@service/prevention-store';
import StepPage from '.';

@Component({
  selector: 'form-step-two',
  imports: [TextInputComponent],
  template: ` <app-text-input label="Animal empleado" (valueChange)="onInput($event)" /> `,
})
export class FormStepTwo {
  #store = inject(PreventionStore);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-two',
  template: `
    <step-page>
      <form-step-two />
    </step-page>
  `,
  imports: [StepPage, FormStepTwo],
})
export default class StepTwo {}
