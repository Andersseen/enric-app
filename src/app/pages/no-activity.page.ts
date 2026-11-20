import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular';
import MapZones from '@components/map-zones';
import { Zone } from '@data/zones';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { arrowBack, saveOutline } from 'ionicons/icons';

/**
 * "NO ACTIVIDAD": registra una fila en ACTUACIONES DIARIAS sin avistamientos.
 * Solo se indica la zona y, opcionalmente, observaciones.
 */
@Component({
  selector: 'app-no-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonTextarea,
    FormsModule,
    RouterLink,
    MapZones,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/home" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>No actividad</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-content>
          <h2 class="text-xl font-bold mb-4">Seleccionar zona</h2>
          <app-map-zones [selected]="zone()" (select)="zone.set($event)" />
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content class="flex flex-col gap-4">
          <ion-textarea
            label="Observaciones"
            labelPlacement="floating"
            fill="outline"
            rows="4"
            placeholder="Escribe aquí los detalles..."
            [ngModel]="notes()"
            (ngModelChange)="notes.set($event)"
          ></ion-textarea>

          <ion-button expand="block" (click)="save()" [disabled]="!zone()">
            Guardar en Tabla
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
})
export default class NoActivityPage {
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);
  #nav = inject(NavController);

  zone = signal<Zone | null>(null);
  notes = signal('');

  constructor() {
    addIcons({ arrowBack, saveOutline });
  }

  async save() {
    const zone = this.zone();
    if (!zone) return;

    this.#reportStore.addRow({
      zoneId: zone.name,
      speciesId: 'Sin avistamientos',
      count: 0,
      behavior: '-',
      actionType: 'No actividad',
      operation: 'No',
      interaction: 'No',
      method: '-',
      animal: '',
      efficacy: '-',
      captured: 0,
      notes: this.notes().trim(),
      ...this.#session.recordMeta(),
    });

    const toast = await this.#toast.create({
      message: 'No actividad añadida a la tabla',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    this.#nav.navigateRoot('/home');
  }
}
