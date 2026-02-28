import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-twelve',
  imports: [TextInputComponent],
  template: `
    <app-text-input
      label="Observaciones"
      placeholder="Escribe tus observaciones aquí..."
      (valueChange)="onInput($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepTwelve {
  #store = inject(ActionsStore);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-twelve',
  template: `
    <step-page>
      <form-step-twelve />
    </step-page>
  `,
  imports: [StepPage, FormStepTwelve],
})
export default class StepTwelve {}
