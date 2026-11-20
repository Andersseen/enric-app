import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import StepPage from '.';
import TextInputComponent from '@components/forms/text-input';
import ActionsStore from '@service/actions-store';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'form-step-twelve',
  imports: [TextInputComponent],
  template: `
    <app-text-input
      [label]="t('common.observations')"
      [placeholder]="t('common.writeObservations')"
      (valueChange)="onInput($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepTwelve {
  protected t = injectT(i18n);
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPage, FormStepTwelve],
})
export default class StepTwelve {}
