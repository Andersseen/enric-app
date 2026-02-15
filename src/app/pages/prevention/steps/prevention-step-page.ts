import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  NavController,
} from '@ionic/angular/standalone';
import SessionHeaderComponent from '../../../../components/session-header';
import { addIcons } from 'ionicons';
import { caretBack } from 'ionicons/icons';

@Component({
  selector: 'app-prevention-step-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    SessionHeaderComponent,
    IonButtons,
    IonContent,
    IonIcon,
    IonButton,
  ],
  template: `
    <section id="page" class="ion-page flex flex-col gap-4">
      <ion-header>
        <ion-toolbar class="flex">
          <ion-buttons slot="start" class="cursor-pointer">
            <ion-button (click)="goBack()">
              <ion-icon slot="icon-only" name="caret-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title class="text-center">{{ title }}</ion-title>
        </ion-toolbar>

        <app-session-header />
      </ion-header>
      <ion-content>
        <ng-content />
      </ion-content>
    </section>
  `,
})
export default class PreventionStepPage {
  @Input() title: string = '';

  #navCtrl = inject(NavController);

  constructor() {
    addIcons({ caretBack });
  }

  goBack() {
    this.#navCtrl.back();
  }
}
