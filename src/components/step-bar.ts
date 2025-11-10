import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-step-bar',
  imports: [IonTabBar, IonTabButton, IonIcon],
  template: `
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="step-1">
        <ion-icon name="play-circle"></ion-icon>
        Zonas
      </ion-tab-button>
      <ion-tab-button tab="step-2">
        <ion-icon name="radio"></ion-icon>
        Especies
      </ion-tab-button>
      <ion-tab-button tab="step-3">
        <ion-icon name="library"></ion-icon>
        Cantidades
      </ion-tab-button>
      <ion-tab-button tab="step-4">
        <ion-icon name="search"></ion-icon>
        Revisión
      </ion-tab-button>
    </ion-tab-bar>
  `,
})
export default class StepBar {}
