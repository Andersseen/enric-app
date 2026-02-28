import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-nine',
  imports: [TextInputComponent],
  template: ` <app-text-input label="Animal empleado" (valueChange)="onInput($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepNine {
  #store = inject(ActionsStore);

  onInput(value: string) {
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
