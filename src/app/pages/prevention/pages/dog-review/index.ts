import { Component, computed, inject } from '@angular/core';
import StepPanel from './step-panel';
import PreventionStore from '@service/prevention-store';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel
      [title]="label()"
      [canGoForward]="finish()"
      basePath="/home/prevention/dog-review"
    >
      <ng-content />
    </app-step-panel>
  `,
  imports: [StepPanel],
})
export default class StepPage {
  #store = inject(PreventionStore);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
