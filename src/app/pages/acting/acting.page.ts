import { Component, inject, signal } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'app-acting',
  imports: [IonTabs],
  template: `
    <ion-tabs>
      <!-- <app-step-bar [steps]="steps()" /> -->
    </ion-tabs>
  `,
})
export default class ActingPage {
  #store = inject(StoreService);

  steps = signal(this.#store.steps());
}
