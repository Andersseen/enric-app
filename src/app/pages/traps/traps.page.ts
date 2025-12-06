import { Component } from '@angular/core';
import { BottomBarComponent } from '@components/bottom-bar';
import { IonTabs } from '@ionic/angular/standalone';
import StoreService from '@service/state';
import TrapsStoreService from '@service/traps-store.service';

@Component({
  selector: 'app-traps',
  imports: [IonTabs, BottomBarComponent],
  providers: [
    {
      provide: StoreService,
      useExisting: TrapsStoreService,
    },
  ],
  template: `
    <ion-tabs>
      <app-bottom-bar />
    </ion-tabs>
  `,
})
export default class TrapsPage {}
