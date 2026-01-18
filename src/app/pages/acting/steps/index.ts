import { Component, computed, inject } from '@angular/core';
import StepPanel from '@components/step-panel';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()" basePath="/home/action">
      <ng-content />
    </app-step-panel>
  `,
  imports: [StepPanel],
})
export default class StepPage {
  #store = inject(ActionsStore);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
