import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import TextInputComponent from '@components/forms/text-input';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'traps-form-step-eleven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInputComponent],
  template: `
    <app-text-input
      [label]="t('common.observations')"
      [placeholder]="t('common.writeObservations')"
      (valueChange)="onInput($event)"
    />
  `,
})
export class TrapsFormStepEleven {
  protected t = injectT(i18n);
  #store = inject(TrapsActionsStore);

  onInput(value: string) {
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'traps-step-eleven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-eleven />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepEleven],
})
export default class TrapsStepEleven {}
