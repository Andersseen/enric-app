import { Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-eleven',
  imports: [TextInputComponent],
  template: `
    <app-text-input
      label="Observaciones"
      placeholder="Escribe tus observaciones aquí..."
      (valueChange)="onInput($event)"
    />
  `,
})
export class FormStepEleven {
  #store = inject(StoreService);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-eleven',
  template: `
    <step-page>
      <form-step-eleven />
    </step-page>
  `,
  imports: [StepPage, FormStepEleven],
})
export default class StepEleven {}
