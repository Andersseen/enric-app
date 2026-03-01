import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PreventionStep } from './base-step';
import PreventionStepObservationComponent from './components/prevention-step-observation.component';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { ToastController } from '@ionic/angular/standalone';
import PreventionStepPage from './prevention-step-page';

@Component({
  selector: 'app-ppoam-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreventionStepObservationComponent, PreventionStepPage],
  template: `
    <app-prevention-step-page title="PPOAM">
      <app-prevention-step-observation
        [value]="store.ppoamObservation()"
        (valueChange)="store.ppoamObservation.set($event)"
        (save)="save()"
      />
    </app-prevention-step-page>
  `,
})
export default class PpoamStepPage extends PreventionStep {
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
      zoneId: '-',
      speciesId: '-',
      count: 0,
      behavior: '-',
      actionType: 'PPOAM',
      operation: 'No',
      interaction: '-',
      method: '-',
      animal: '-',
      efficacy: '-',
      captured: 0,
      notes: this.store.ppoamObservation(),
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
