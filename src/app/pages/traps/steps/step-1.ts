import { Component, computed, inject } from '@angular/core';
import StepPanel from '@components/step-panel';
import StoreService from '@service/state';
import MapZones from '@components/map-zones';

@Component({
  selector: 'app-traps-step-1',
  template: `
    <app-step-panel [title]="label()" [canGoForward]="finish()" basePath="/home/traps">
      <app-map-zones />
    </app-step-panel>
  `,
  imports: [StepPanel, MapZones],
})
export default class TrapsStep1Page {
  #store = inject(StoreService);

  label = computed(() => this.#store.currentLabel());

  finish = computed(() => this.#store.finishStep());
}
