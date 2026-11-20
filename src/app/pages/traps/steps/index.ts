import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import StepPanel from '@components/step-panel';
import TrapsActionsStore from '@service/traps-store';

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
  #store = inject(TrapsActionsStore);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
