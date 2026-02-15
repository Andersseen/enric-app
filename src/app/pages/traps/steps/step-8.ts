import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import TextInputComponent from '@components/forms/text-input';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-eight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInputComponent],
  template: ` <app-text-input label="Animal empleado" (valueChange)="onInput($event)" /> `,
})
export class TrapsFormStepEight {
  #store = inject(TrapsActionsStore);

  onInput(value: string) {
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
