import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import StepPanel from '@components/step-panel';
import { TRAPS_STEP_TITLES } from '@i18n/step-titles';
import TrapsActionsStore from '@service/traps-store';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()" basePath="/home/traps">
      <ng-content />
    </app-step-panel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StepPanel],
})
export default class StepPage {
  protected t = injectT(i18n);
  #store = inject(TrapsActionsStore);

  label = computed(() => this.t(TRAPS_STEP_TITLES[this.#store.currentStep()]));

  finish = computed(() => this.#store.finishStep());
}
