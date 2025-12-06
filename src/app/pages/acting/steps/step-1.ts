import { Component, inject } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';
import StoreService from '@service/state';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-zones-step',
  template: `
    <step-page>
      <app-map-zones [selected]="store.step1Value()" (select)="onSelect($event)" />
    </step-page>
  `,
  imports: [MapZones, StepPage],
})
export default class ZonesStep {
  store = inject(StoreService);

  onSelect(zone: Zone) {
    this.store.setValueForCurrentStep(zone);
  }
}
