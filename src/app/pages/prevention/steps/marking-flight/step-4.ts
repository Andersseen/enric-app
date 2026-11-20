import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonTextarea,
  ToastController,
} from '@ionic/angular';
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
    <app-prevention-step-page [title]="t('prevention.flightObservations')">
      <div class="p-4 flex flex-col gap-4">
        <ion-card>
          <ion-card-content>
            <ion-textarea
              [label]="t('common.observationsOptional')"
              labelPlacement="floating"
              fill="outline"
              rows="5"
              [placeholder]="t('common.writeDetails')"
              [(ngModel)]="notes"
              (ngModelChange)="updateNotes($event)"
            ></ion-textarea>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" (click)="save()" class="mt-4">
          {{ t('common.save') }}
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
      ...this.#session.recordMeta(),
    });

    const toast = await this.#toast.create({
      message: this.t('common.addedToTable'),
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    this.store.reset();
    this.navCtrl.navigateRoot('/home');
  }
}
