import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';
import ActionsStore from '@service/actions-store';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-zones-step',
  template: `
    <step-page>
      <app-map-zones [selected]="store.step1Value()" (select)="onSelect($event)" />
    </step-page>
  `,
  imports: [MapZones, StepPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ZonesStep {
  store = inject(ActionsStore);

  onSelect(zone: Zone) {
    this.store.setValueForCurrentStep(zone);
  }
}
