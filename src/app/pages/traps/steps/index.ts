import { Component, computed, inject } from '@angular/core';
import StepPanel from '@components/step-panel';
import TrapsStoreService from '@service/traps-store.service';

@Component({
  selector: 'step-page',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()" basePath="/home/traps">
      <ng-content />
    </app-step-panel>
  `,
  imports: [StepPanel],
})
export default class StepPage {
  #store = inject(TrapsStoreService);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
