import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import SessionHeaderComponent from '@components/session-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [IonContent, SessionHeaderComponent, RouterOutlet],
  template: `
    <ion-content [fullscreen]="true" [scrollEvents]="false">
      <app-session-header (sessionChange)="onSessionChange($event)" />
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
