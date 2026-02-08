import { Component, inject } from '@angular/core';
import { PreventionStep } from '../base-step';
import PreventionStepFlightDetailsComponent from '../components/prevention-step-flight-details.component';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { ToastController } from '@ionic/angular/standalone';
import PreventionStepPage from '../prevention-step-page';

@Component({
  selector: 'app-flight-step-two',
  imports: [PreventionStepFlightDetailsComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="Vuelo de Marcaje - Detalles">
      <app-prevention-step-flight-details
        [method]="store.flightReviewMethod()"
        (methodChange)="store.flightReviewMethod.set($event)"
        [animal]="store.flightReviewAnimal()"
        (animalChange)="store.flightReviewAnimal.set($event)"
        [notes]="store.flightReviewNotes()"
        (notesChange)="store.flightReviewNotes.set($event)"
        (save)="save()"
      />
    </app-prevention-step-page>
  `,
})
export default class FlightStepTwo extends PreventionStep {
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);

  next() {
    // End
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
      interaction: '-',
      method: this.store.flightReviewMethod(),
      animal: this.store.flightReviewAnimal(),
      efficacy: '-',
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
