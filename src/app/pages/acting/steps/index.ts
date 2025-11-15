import { Component, computed, inject } from '@angular/core';
import StepPanel from '@components/step-panel';
import StoreService from '@service/state';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()">
      <ng-content />
    </app-step-panel>
  `,
  imports: [StepPanel],
})
export default class StepPage {
  #store = inject(StoreService);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
