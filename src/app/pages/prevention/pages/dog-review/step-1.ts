import { Component, inject } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';
import PreventionStore from '@service/prevention-store';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-dog-review-step-1',
  template: `
    <step-page>
      <app-map-zones [selected]="store.step1Value()" (select)="onSelect($event)" />
    </step-page>
  `,
  imports: [MapZones, StepPage],
})
export default class DogReviewStep1 {
  store = inject(PreventionStore);

  onSelect(zone: Zone) {
    this.store.setValueForCurrentStep(zone);
  }
}
