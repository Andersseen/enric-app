import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-home',
  imports: [IonRouterOutlet],
  template: ` <ion-router-outlet class="flex-1" /> `,
  host: { class: 'flex flex-col h-full w-full font-sans antialiased' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
