import { Component } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPage from '.';

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
