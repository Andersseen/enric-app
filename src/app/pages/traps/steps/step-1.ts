import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';
import TrapsStore from '@service/traps-store';
import { Zone } from '@data/zones';

@Component({
  selector: 'traps-zones-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <app-map-zones [selected]="store.step1Value()" (select)="onSelect($event)" />
    </step-page>
  `,
  imports: [MapZones, StepPage],
})
export default class TrapsZonesStep {
  store = inject(TrapsStore);

  onSelect(zone: Zone) {
    this.store.setValueForCurrentStep(zone);
  }
}
