import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PreventionStep } from './base-step';
import PreventionStepObservationComponent from './components/prevention-step-observation.component';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { ToastController } from '@ionic/angular/standalone';
import PreventionStepPage from './prevention-step-page';

@Component({
  selector: 'app-perimeter-review-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreventionStepObservationComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="Revisión Perímetro">
      <app-prevention-step-observation
        [value]="store.perimeterReviewObservation()"
        (valueChange)="store.perimeterReviewObservation.set($event)"
        (save)="save()"
      />
    </app-prevention-step-page>
  `,
})
export default class PerimeterReviewStepPage extends PreventionStep {
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #toast = inject(ToastController);

  next() {
    // Single step
  }

  async save() {
    const sessionData = this.#session.sessionForm.value;
    const now = new Date();

    this.#reportStore.addRow({
      zoneId: 'Perímetro',
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: 'Revisión Perímetro',
      operation: 'No',
      interaction: 'No',
      method: '-',
      animal: '-',
      efficacy: 'Si',
      captured: 0,
      notes: this.store.perimeterReviewObservation(),
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
