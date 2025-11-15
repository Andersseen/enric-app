import { Component, inject, signal } from '@angular/core';
import MapZones from '@components/map-zones';
import StepPanel from '@components/step-panel';
import { Zone } from '@data/zones';

@Component({
  selector: 'app-zones-step',
  template: `
    <app-step-panel title="Zona" [canGoForward]="finish()">
      <app-map-zones (zoneSelected)="selectedZone($event)" />
    </app-step-panel>
  `,
  imports: [MapZones, StepPanel],
})
export default class ZonesStep {
  finish = signal(false);
  selectedZone(zone: Zone | null) {
    if (!zone) return;
    this.finish.set(true);
  }
}
