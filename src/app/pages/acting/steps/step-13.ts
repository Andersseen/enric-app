import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import ActionsStore from '@service/actions-store';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { downloadOutline, homeOutline } from 'ionicons/icons';
import StepPage from '.';

@Component({
  selector: 'form-step-thirteen',
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
              <p>{{ count() ?? '-' }}</p>
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
              <h2>Operación</h2>
              <p>{{ operation() || '-' }}</p>
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
              <p>{{ displayCaptured() }}</p>
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
            Guardar en Tabla
          </ion-button>

          <ion-button expand="block" color="medium" fill="outline" (click)="finish()">
            <ion-icon slot="start" name="home-outline"></ion-icon>
            Finalizar y Volver
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepThirteen {
  #store = inject(ActionsStore);
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #navController = inject(NavController);

  zone = this.#store.step1Value;
  bird = this.#store.step2Value;
  count = this.#store.step3Value;
  behavior = this.#store.step4Value;
  actionType = this.#store.step5Value;
  interaction = this.#store.step6Value;
  operation = this.#store.step7Value;
  method = this.#store.step8Value;
  animal = this.#store.step9Value;
  efficacy = this.#store.step10Value;
  captured = this.#store.step11Value;
  displayCaptured = computed(() => {
    if (this.method() !== 'Vuelo dispersión halcón') return 0;
    return this.captured() ?? 0;
  });
  notes = this.#store.step12Value;

  toastController = inject(ToastController);
  alertController = inject(AlertController);

  constructor() {
    addIcons({ downloadOutline, homeOutline });
  }

  async generate() {
    const sessionData = this.#session.sessionForm.value;
    const now = new Date();

    this.#reportStore.addRow({
      zoneId: this.zone()?.name || '',
      speciesId: this.bird()?.commonName || '',
      count: this.count() || 0,
      behavior: this.behavior() || '',
      actionType: this.actionType() || '',
      interaction: this.interaction() || '',
      method: this.method() || '',
      animal: this.animal() || '',
      efficacy: this.efficacy() || '',
      captured: this.method() !== 'Vuelo dispersión halcón' ? 0 : this.captured() || 0,
      notes: this.notes() || '',
      operation: this.operation() || 'No',
      date: sessionData.date || now.toLocaleDateString('es-ES'),
      time:
        sessionData.time || now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      weather: sessionData.weather || '',
      worker: sessionData.worker || '',
    });

    const toast = await this.toastController.create({
      message: 'Añadido a la tabla correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    // Reset and go home
    this.#store.reset();
    this.#navController.navigateRoot('/home');
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
  selector: 'step-thirteen',
  template: `
    <step-page>
      <form-step-thirteen />
    </step-page>
  `,
  imports: [StepPage, FormStepThirteen],
})
export default class StepThirteen {}
