import { Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-three',
  imports: [TextInputComponent],
  template: `
    <app-text-input
      label="Observaciones"
      placeholder="Escribe tus observaciones aquí..."
      (valueChange)="onInput($event)"
    />
  `,
})
export class FormStepThree {
  #store = inject(ActionsStore);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-three',
  template: `
    <step-page>
      <form-step-three />
    </step-page>
  `,
  imports: [StepPage, FormStepThree],
})
export default class StepThree {}
