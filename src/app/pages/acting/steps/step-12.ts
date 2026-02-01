import { Component, inject } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  ToastController,
} from '@ionic/angular/standalone';
import ActionsStore from '@service/actions-store';
import { saveAs } from 'file-saver';
import { addIcons } from 'ionicons';
import { downloadOutline, homeOutline } from 'ionicons/icons';
import { ExcelService } from '@service/excel.service';
import StepPage from '.';

@Component({
  selector: 'form-step-twelve',
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
export class FormStepTwelve {
  #store = inject(ActionsStore);
  #excelService = inject(ExcelService);

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
    await this.#excelService.generateActuacionExcel({
      zoneId: this.zone()?.name || '',
      speciesId: this.bird()?.commonName || '',
      count: this.count() || 0,
      behavior: this.behavior() || '',
      actionType: this.actionType() || '',
      interaction: this.interaction() || '',
      method: this.method() || '',
      animal: this.animal() || '',
      efficacy: this.efficacy() || '',
      captured: this.captured() || 0,
      notes: this.notes() || '',
    });

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
  selector: 'step-twelve',
  template: `
    <step-page>
      <form-step-twelve />
    </step-page>
  `,
  imports: [StepPage, FormStepTwelve],
})
export default class StepTwelve {}
