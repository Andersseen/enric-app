import { Component, inject } from '@angular/core';
import { PreventionStep } from './base-step';
import PreventionStepObservationComponent from './components/prevention-step-observation.component';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { ToastController, NavController } from '@ionic/angular/standalone';
import PreventionStepPage from './prevention-step-page';

@Component({
  selector: 'app-track-review-step',
  imports: [PreventionStepObservationComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="Revisión Pista">
      <app-prevention-step-observation
        [value]="store.trackReviewObservation()"
        (valueChange)="store.trackReviewObservation.set($event)"
        (save)="save()"
      />
    </app-prevention-step-page>
  `,
})
export default class TrackReviewStepPage extends PreventionStep {
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);

  next() {
    // Single step, no next
  }

  async save() {
    const sessionData = this.#session.sessionForm.value;
    const now = new Date();

    this.#reportStore.addRow({
      zoneId: 'Pista',
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: 'Revisión Pista',
      operation: 'No',
      interaction: '-',
      method: '-',
      animal: '-',
      efficacy: '-',
      captured: 0,
      notes: this.store.trackReviewObservation(),
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
