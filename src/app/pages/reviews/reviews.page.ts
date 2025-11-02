import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ActionCardItem } from '@components/action-cards';
import { GridZonasComponent } from '@components/map-zones';
import AppHeader from '@components/header';

@Component({
  selector: 'app-reviews',
  imports: [IonContent, GridZonasComponent, AppHeader],
  template: `
    <ion-content [fullscreen]="true" class="text-basecolor" [scrollEvents]="false">
      <app-header title="Prevención" [showBackButton]="true" />
      <app-grid-zonas />
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ReviewsPage {}
