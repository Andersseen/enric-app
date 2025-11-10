import { Component } from '@angular/core';
import { IonTab, IonTabs } from '@ionic/angular/standalone';
import StepBar from '@components/step-bar';
import StepPanel from '@components/step-panel';
import MapZones from '@components/map-zones';
import FilterBirds from '@components/filter-birds';
import ModalInput from '@components/modal-input';
import SessionHeaderComponent from '@components/session-header';

@Component({
  selector: 'app-acting',
  imports: [
    IonTab,
    IonTabs,
    StepBar,
    StepPanel,
    MapZones,
    FilterBirds,
    ModalInput,
    SessionHeaderComponent,
  ],
  template: `
    <ion-tabs>
      <ion-tab tab="step-1" class="h-full overflow-auto">
        <app-step-panel title="Zona">
          <app-session-header />
          <app-map-zones />
        </app-step-panel>
      </ion-tab>
      <ion-tab tab="step-2" class="h-full overflow-auto">
        <app-step-panel title="Lista">
          <app-filter-birds />
        </app-step-panel>
      </ion-tab>
      <ion-tab tab="step-3">
        <app-step-panel title="aaa">
          <app-modal-input />
        </app-step-panel>
      </ion-tab>
      <ion-tab tab="step-4">
        <app-step-panel title="bbb"> </app-step-panel>
      </ion-tab>

      <app-step-bar />
    </ion-tabs>
  `,
})
export default class ActingPage {
  steps = ['step-1', 'step-2', 'step-3', 'step-4'];
}
