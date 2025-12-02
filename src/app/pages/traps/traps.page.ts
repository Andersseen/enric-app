import { Component } from '@angular/core';
import { BottomBarComponent } from '@components/bottom-bar';
import { IonTabs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-traps',
  imports: [IonTabs, BottomBarComponent],
  template: `
    <ion-tabs>
      <app-bottom-bar />
    </ion-tabs>
  `,
})
export default class TrapsPage {}
