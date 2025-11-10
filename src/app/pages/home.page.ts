import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [IonContent, RouterOutlet],
  template: `
    <ion-content>
      <router-outlet />
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class Home {
  onSessionChange(data: unknown): void {
    console.log('Session updated', data);
  }
}
