import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import ActionsStore from '@service/actions-store';
import { BottomBarComponent } from '@components/bottom-bar';

@Component({
  selector: 'app-acting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, BottomBarComponent],
  template: `
    <ion-tabs>
      <app-bottom-bar />
    </ion-tabs>
  `,
})
export default class ActingPage {
  #store = inject(ActionsStore);

  steps = signal(this.#store.steps());
}
