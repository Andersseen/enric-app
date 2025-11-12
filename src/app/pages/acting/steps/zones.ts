import { Component, inject, signal } from '@angular/core';
import MapZones from '@components/map-zones';
import SessionHeaderComponent from '@components/session-header';
import StepPanel from '@components/step-panel';
import { Router } from '@angular/router';
import { StoreService } from 'src/service/state';

@Component({
  selector: 'app-zones-step',
  template: `
    <app-step-panel title="Zona">
      <app-session-header />
      <app-map-zones (zoneSelect)="selectedZone($event)" />
    </app-step-panel>
  `,
  imports: [MapZones, SessionHeaderComponent, StepPanel],
})
export default class ZonesStep {
  #router = inject(Router);
  #store = inject(StoreService);

  steps = signal(this.#store.steps());

  selectedZone(a: any) {
    console.log(a);
    this.#router.navigate(['/home/action', 'step-2']);
    this.#store.setCurrentStep('step-2');
  }
}
