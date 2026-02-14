import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { addOutline, arrowBack, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-manage-workers',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button routerLink="/home" color="dark">
            <ion-icon name="arrow-back"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Gestionar Trabajadores</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="max-w-md mx-auto">
        <div class="flex gap-2 mb-6 items-end">
          <ion-input
            [formControl]="newWorkerControl"
            label="Nuevo Trabajador"
            labelPlacement="floating"
            fill="outline"
            class="flex-1"
            (keyup.enter)="addWorker()"
          ></ion-input>
          <ion-button (click)="addWorker()" [disabled]="newWorkerControl.invalid">
            <ion-icon name="add-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <ion-list class="rounded-xl border border-border overflow-hidden">
          @for (worker of workers(); track worker) {
            <ion-item>
              <ion-label>{{ worker }}</ion-label>
              <ion-button fill="clear" color="danger" slot="end" (click)="removeWorker(worker)">
                <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>
          } @empty {
            <ion-item lines="none">
              <ion-label class="text-center text-muted italic">
                No hay trabajadores registrados
              </ion-label>
            </ion-item>
          }
        </ion-list>
      </div>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export default class ManageWorkersPage {
  #session = inject(Session);
  #toast = inject(ToastController);

  workers = this.#session.workers;
  newWorkerControl = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor() {
    addIcons({ arrowBack, trashOutline, addOutline });
  }

  async addWorker() {
    if (this.newWorkerControl.valid && this.newWorkerControl.value) {
      const name = this.newWorkerControl.value.trim();
      this.#session.addWorker(name);
      this.newWorkerControl.reset();

      const toast = await this.#toast.create({
        message: 'Trabajador añadido correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async removeWorker(name: string) {
    this.#session.removeWorker(name);

    const toast = await this.#toast.create({
      message: 'Trabajador eliminado',
      duration: 2000,
      color: 'medium',
      position: 'bottom',
    });
    await toast.present();
  }
}
