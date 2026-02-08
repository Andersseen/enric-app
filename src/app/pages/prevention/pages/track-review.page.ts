import { Component, inject } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ReportStore } from '@service/report-store';

@Component({
  selector: 'app-track-review',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonTextarea,
    IonButton,
    FormsModule,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home/prevention"></ion-back-button>
        </ion-buttons>
        <ion-title>Revisión pista</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col gap-4 h-full">
        <ion-textarea
          label="Observaciones"
          labelPlacement="floating"
          fill="outline"
          rows="10"
          placeholder="Escribe aquí las observaciones..."
          class="flex-1"
          [(ngModel)]="observations"
        ></ion-textarea>

        <ion-button expand="block" class="mt-auto" (click)="save()">
          Guardar y Añadir a Tabla
        </ion-button>
      </div>
    </ion-content>
  `,
})
export default class TrackReviewPage {
  private reportStore = inject(ReportStore);
  private toastController = inject(ToastController);
  private navController = inject(NavController);

  observations = '';

  async save() {
    const data = {
      zoneId: '',
      speciesId: '',
      count: 0,
      behavior: '',
      actionType: 'Revisión pista',
      operation: 'No',
      interaction: 'No',
      method: '',
      animal: '',
      efficacy: 'Si',
      captured: 0,
      notes: this.observations,
    };

    this.reportStore.addRow(data);

    const toast = await this.toastController.create({
      message: 'Añadido a la tabla correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
    this.navController.back();
  }
}
