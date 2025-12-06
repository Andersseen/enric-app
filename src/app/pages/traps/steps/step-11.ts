import { Component, inject } from '@angular/core';
import TextInputComponent from '@components/forms/text-input';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-eleven',
  imports: [TextInputComponent],
  template: `
    <app-text-input
      label="Observaciones"
      placeholder="Escribe tus observaciones aquí..."
      (valueChange)="onInput($event)"
    />
  `,
})
export class TrapsFormStepEleven {
  #store = inject(TrapsStoreService);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'traps-step-eleven',
  template: `
    <step-page>
      <traps-form-step-eleven />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepEleven],
})
export default class TrapsStepEleven {}
