import { Component, inject, signal } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import StepBar from '@components/step-bar';
import { StoreService } from 'src/service/state';

@Component({
  selector: 'app-acting',
  imports: [IonTabs, StepBar],
  template: `
    <ion-tabs>
      <app-step-bar [steps]="steps()" />
    </ion-tabs>
  `,
})
export default class ActingPage {
  #store = inject(StoreService);

  steps = signal(this.#store.steps());
}
