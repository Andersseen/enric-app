import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonTextarea,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { PreventionStep } from '../base-step';
import PreventionStepPage from '../prevention-step-page';

@Component({
  selector: 'app-flight-step-four',
  imports: [
    PreventionStepPage,
    FormsModule,
    IonTextarea,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
  ],
  template: `
    <app-prevention-step-page title="Observaciones">
      <div class="p-4 flex flex-col gap-4">
        <ion-card>
          <ion-card-content>
            <ion-textarea
              label="Observaciones (opcional)"
              labelPlacement="floating"
              fill="outline"
              rows="5"
              placeholder="Escribe aquí los detalles..."
              [(ngModel)]="notes"
              (ngModelChange)="updateNotes($event)"
            ></ion-textarea>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" (click)="save()" class="mt-4">
          Guardar
          <ion-icon slot="end" name="save-outline"></ion-icon>
        </ion-button>
      </div>
    </app-prevention-step-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FlightStepFour extends PreventionStep {
  notes = this.store.flightReviewNotes();
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);

  constructor() {
    super();
    addIcons({ saveOutline });
  }

  updateNotes(value: string) {
    this.store.flightReviewNotes.set(value);
  }

  next() {
    // End of flow
  }

  async save() {
    const sessionData = this.#session.sessionForm.value;
    const now = new Date();
    const zone = this.store.flightReviewZone();

    if (!zone) return;

    this.#reportStore.addRow({
      zoneId: zone.name,
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: 'Vuelo de Marcaje',
      operation: 'No',
      interaction: 'No',
      method: this.store.flightReviewMethod(),
      animal: this.store.flightReviewAnimal(),
      efficacy: 'Si',
      captured: 0,
      notes: this.store.flightReviewNotes(),
      date: sessionData.date || now.toLocaleDateString('es-ES'),
      time:
        sessionData.time || now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      weather: sessionData.weather || '',
      worker: sessionData.worker || '',
    });

    const toast = await this.#toast.create({
      message: 'Añadido a la tabla correctamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    this.store.reset();
    this.navCtrl.navigateRoot('/home');
  }
}
