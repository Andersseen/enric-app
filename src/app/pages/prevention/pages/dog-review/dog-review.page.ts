import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  IonInput,
} from '@ionic/angular/standalone';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { ExcelService } from '@service/excel.service';

@Component({
  selector: 'app-dog-review',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonTextarea,
    IonButton,
    IonInput,
    FormsModule,
    MapZones,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home/prevention"></ion-back-button>
        </ion-buttons>
        <ion-title>Revisión perro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="flex flex-col gap-6 h-full">
        <!-- Section 1: Map/Zone -->
        <section>
          <h3 class="text-lg font-medium mb-3">1. Seleccionar Zona</h3>
          <app-map-zones [selected]="selectedZone()" (select)="onZoneSelect($event)" />
        </section>

        @if (selectedZone()) {
          <!-- Section 2: Form Details -->
          <section class="flex flex-col gap-4 animate-fade-in">
            <h3 class="text-lg font-medium">2. Detalles</h3>

            <ion-input
              label="Animal empleado"
              labelPlacement="floating"
              fill="outline"
              placeholder="Nombre del halcón/perro"
              [(ngModel)]="animalName"
            ></ion-input>

            <ion-textarea
              label="Observaciones"
              labelPlacement="floating"
              fill="outline"
              rows="5"
              placeholder="Escribe aquí los detalles..."
              [(ngModel)]="observations"
            ></ion-textarea>

            <ion-button expand="block" class="mt-4" [disabled]="!isValid()" (click)="save()">
              Guardar
            </ion-button>
          </section>
        }
      </div>
    </ion-content>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export default class DogReviewPage {
  private excelService = inject(ExcelService);
  private toastController = inject(ToastController);
  private navController = inject(NavController);

  selectedZone = signal<Zone | null>(null);
  animalName = '';
  observations = '';

  onZoneSelect(zone: Zone) {
    this.selectedZone.set(zone);
  }

  isValid() {
    return this.selectedZone() && this.animalName.trim().length > 0;
  }

  async save() {
    await this.excelService.generateActuacionExcel({
      zoneId: this.selectedZone()?.name || '',
      speciesId: '',
      count: 0,
      behavior: '',
      actionType: 'Revisión perro',
      operation: 'No',
      interaction: 'No',
      method: 'Perro', // Static method
      animal: this.animalName,
      efficacy: 'Si',
      captured: 0,
      notes: this.observations || '',
    });

    const toast = await this.toastController.create({
      message: 'Guardado correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
    this.navController.back();
  }
}
