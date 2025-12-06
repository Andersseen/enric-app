import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { addIcons } from 'ionicons';
import { downloadOutline, homeOutline } from 'ionicons/icons';
import { ToastController, AlertController } from '@ionic/angular/standalone';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-twelve',
  imports: [IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon],
  template: `
    <ion-card>
      <ion-card-content>
        <ion-list lines="none">
          <ion-item>
            <ion-label>
              <h2>Zona</h2>
              <p>{{ zone()?.name || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Especie</h2>
              <p>{{ bird()?.commonName || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Cantidad</h2>
              <p>{{ count() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Comportamiento</h2>
              <p>{{ behavior() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Actuación</h2>
              <p>{{ actionType() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Interacción</h2>
              <p>{{ interaction() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Método</h2>
              <p>{{ method() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Animal</h2>
              <p>{{ animal() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Eficacia</h2>
              <p>{{ efficacy() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Capturas</h2>
              <p>{{ captured() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>Observaciones</h2>
              <p>{{ notes() || '-' }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="mt-4 space-y-3">
          <ion-button expand="block" (click)="generate()">
            <ion-icon slot="start" name="download-outline"></ion-icon>
            Generar Excel
          </ion-button>

          <ion-button expand="block" color="medium" fill="outline" (click)="finish()">
            <ion-icon slot="start" name="home-outline"></ion-icon>
            Finalizar y Volver
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export class TrapsFormStepTwelve {
  #store = inject(TrapsStoreService);

  zone = this.#store.step1Value;
  bird = this.#store.step2Value;
  count = this.#store.step3Value;
  behavior = this.#store.step4Value;
  actionType = this.#store.step5Value;
  interaction = this.#store.step6Value;
  method = this.#store.step7Value;
  animal = this.#store.step8Value;
  efficacy = this.#store.step9Value;
  captured = this.#store.step10Value;
  notes = this.#store.step11Value;

  toastController = inject(ToastController);
  alertController = inject(AlertController);

  constructor() {
    addIcons({ downloadOutline, homeOutline });
  }

  async generate() {
    const rows = [
      ['Campo', 'Valor'],
      ['Zona ID', this.zone()?.name || ''],
      ['Especie', this.bird()?.commonName || ''],
      ['Cuántas', this.count() || 0],
      ['Actitud', this.behavior() || ''],
      ['Tipo acción', this.actionType() || ''],
      ['Interacción operación', this.interaction() || ''],
      ['Método empleado', this.method() || ''],
      ['Animal empleado', this.animal() || ''],
      ['Eficacia', this.efficacy() || ''],
      ['Capturas', this.captured() || 0],
      ['Observaciones', this.notes() || ''],
      ['Fecha registro', new Date().toLocaleString()],
    ];

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trampas');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(file, 'trampas.xlsx');

    const toast = await this.toastController.create({
      message: 'Guardado correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  async finish() {
    const alert = await this.alertController.create({
      header: '¿Finalizar?',
      message:
        '¿Estás seguro de que quieres finalizar? Se perderán los datos actuales del formulario.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Finalizar',
          role: 'confirm',
          handler: () => {
            this.#store.reset();
          },
        },
      ],
    });

    await alert.present();
  }
}

@Component({
  selector: 'traps-step-twelve',
  template: `
    <step-page>
      <traps-form-step-twelve />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepTwelve],
})
export default class TrapsStepTwelve {}
