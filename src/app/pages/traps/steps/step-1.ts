import { Component, inject } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';
import TrapsStoreService from '@service/traps-store.service';
import { Zone } from '@data/zones';

@Component({
  selector: 'traps-zones-step',
  template: `
    <step-page>
      <app-map-zones [selected]="store.step1Value()" (select)="onSelect($event)" />
    </step-page>
  `,
  imports: [MapZones, StepPage],
})
export default class TrapsZonesStep {
  store = inject(TrapsStoreService);

  onSelect(zone: Zone) {
    this.store.setValueForCurrentStep(zone);
  }
}
