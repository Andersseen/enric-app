import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import AppHeader from '@components/header';
import MapZones from '@components/map-zones';

@Component({
  selector: 'app-prevention',
  imports: [IonContent, AppHeader, MapZones],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <app-header title="Prevención" [showBackButton]="true" />
      <app-map-zones />
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class PreventionPage {}
