import { Component } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-perimeter-review',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonTextarea,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home/prevention"></ion-back-button>
        </ion-buttons>
        <ion-title>Revisión perimetral</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col gap-4 h-full">
        <ion-textarea
          label="Observaciones"
          labelPlacement="floating"
          fill="outline"
          rows="10"
          placeholder="Escribe aquí los detalles..."
          class="flex-1"
        ></ion-textarea>

        <ion-button expand="block" class="mt-auto"> Guardar </ion-button>
      </div>
    </ion-content>
  `,
})
export default class PerimeterReviewPage {}
