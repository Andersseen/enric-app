import { Component } from '@angular/core';
import StepPage from '@app/pages/acting/steps';
import MapZones from '@components/map-zones';

@Component({
  selector: 'traps-zones-step',
  template: `
    <step-page>
      <app-map-zones />
    </step-page>
  `,
  imports: [MapZones, StepPage],
})
export default class TrapsZonesStep {}
