import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  imports: [IonRouterOutlet],
  template: ` <ion-router-outlet class="flex-1" /> `,
  host: { class: 'flex flex-col h-full w-full font-sans antialiased' },
})
export default class Home {
  onSessionChange(data: unknown): void {
    console.log('Session updated', data);
  }
}
