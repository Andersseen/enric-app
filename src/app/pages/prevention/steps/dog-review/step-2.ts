import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PreventionStep } from '../base-step';
import PreventionStepDogDetailsComponent from '../components/prevention-step-dog-details.component';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { ToastController } from '@ionic/angular/standalone';
import PreventionStepPage from '../prevention-step-page';

@Component({
  selector: 'app-dog-review-step-two',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreventionStepDogDetailsComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="Revisión Perros - Detalles">
      <app-prevention-step-dog-details
        [animal]="store.dogReviewAnimal()"
        (animalChange)="store.dogReviewAnimal.set($event)"
        [notes]="store.dogReviewNotes()"
        (notesChange)="store.dogReviewNotes.set($event)"
        (save)="save()"
      />
    </app-prevention-step-page>
  `,
})
export default class DogReviewStepTwo extends PreventionStep {
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);

  next() {
    // End of flow
  }

  async save() {
    const sessionData = this.#session.sessionForm.value;
    const now = new Date();
    const zone = this.store.dogReviewZone();

    if (!zone) return; // Should not happen

    this.#reportStore.addRow({
      zoneId: zone.name,
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: 'Revisión Perros',
      operation: 'No',
      interaction: '-',
      method: 'Perro',
      animal: this.store.dogReviewAnimal(),
      efficacy: '-',
      captured: 0,
      notes: this.store.dogReviewNotes(),
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
