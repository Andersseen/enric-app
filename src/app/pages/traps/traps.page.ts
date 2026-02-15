import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BottomBarComponent } from '@components/bottom-bar';
import { IonTabs } from '@ionic/angular/standalone';
import ActionsStore from '@service/actions-store';
import TrapsActionsStore from '@service/traps-store';

@Component({
  selector: 'app-traps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, BottomBarComponent],
  providers: [
    {
      provide: ActionsStore,
      useExisting: TrapsActionsStore,
    },
  ],
  template: `
    <ion-tabs>
      <app-bottom-bar />
    </ion-tabs>
  `,
})
export default class TrapsPage {}
