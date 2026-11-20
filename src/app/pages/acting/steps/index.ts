import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import StepPanel from '@components/step-panel';
import { ACTING_STEP_TITLES } from '@i18n/step-titles';
import ActionsStore from '@service/actions-store';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()" basePath="/home/action">
      <ng-content />
    </app-step-panel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPanel],
})
export default class StepPage {
  protected t = injectT(i18n);
  #store = inject(ActionsStore);

  label = computed(() => this.t(ACTING_STEP_TITLES[this.#store.currentStep()]));

  finish = computed(() => this.#store.finishStep());
}
