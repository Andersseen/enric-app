import { Component, inject, signal } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import StoreService from '@service/state';
import { BottomBarComponent } from '@components/bottom-bar';

@Component({
  selector: 'app-acting',
  imports: [IonTabs, BottomBarComponent],
  template: `
    <ion-tabs>
      <app-bottom-bar />
    </ion-tabs>
  `,
})
export default class ActingPage {
  #store = inject(StoreService);

  steps = signal(this.#store.steps());
}
