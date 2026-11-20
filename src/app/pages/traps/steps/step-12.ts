import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { ExcelService } from '@service/excel.service';
import { saveAs } from 'file-saver';
import { addIcons } from 'ionicons';
import { downloadOutline, homeOutline } from 'ionicons/icons';
import { ToastController, AlertController } from '@ionic/angular';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';
import { ReportStore } from '@service/report-store';
import Session from '@service/session';
import { NavController } from '@ionic/angular';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';
import { OptionGroup, optionLabel } from '@i18n/options';

@Component({
  selector: 'traps-form-step-twelve',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon],
  template: `
    <ion-card>
      <ion-card-content>
        <ion-list lines="none">
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.zone') }}</h2>
              <p>{{ zone()?.name || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.species') }}</h2>
              <p>{{ bird()?.commonName || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.count') }}</h2>
              <p>{{ count() ?? '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.behavior') }}</h2>
              <p>{{ opt('behavior', behavior()) }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.actionType') }}</h2>
              <p>{{ opt('trapAction', actionType()) }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.interaction') }}</h2>
              <p>{{ opt('yesNo', interaction()) }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.method') }}</h2>
              <p>{{ opt('trapMethod', method()) }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.animal') }}</h2>
              <p>{{ animal() || '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.efficacy') }}</h2>
              <p>{{ opt('yesNo', efficacy()) }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.captured') }}</h2>
              <p>{{ captured() ?? '-' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h2>{{ t('summary.observations') }}</h2>
              <p>{{ notes() || '-' }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="mt-4 space-y-3">
          <ion-button expand="block" (click)="generate()">
            <ion-icon slot="start" name="download-outline"></ion-icon>
            {{ t('common.saveToTable') }}
          </ion-button>

          <ion-button expand="block" color="medium" fill="outline" (click)="finish()">
            <ion-icon slot="start" name="home-outline"></ion-icon>
            {{ t('common.finishAndBack') }}
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export class TrapsFormStepTwelve {
  protected t = injectT(i18n);

  /** Texto traducido de un valor guardado ("-" si está vacío). */
  protected opt(group: OptionGroup, value: unknown): string {
    return optionLabel(this.t, group, value);
  }
  #store = inject(TrapsActionsStore);
  #reportStore = inject(ReportStore);
  #session = inject(Session);
  #navController = inject(NavController);

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
      captured: this.captured() || 0,
      notes: this.notes() || '',
      operation: 'No', // Traps usually distinct from active operation? Or "Si"? Leaving "No" or matching logic
      ...this.#session.recordMeta(),
    });

    const toast = await this.toastController.create({
      message: this.t('common.addedToTable'),
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
      header: this.t('summary.finishTitle'),
      message: this.t('summary.finishMessage'),
      buttons: [
        {
          text: this.t('common.cancel'),
          role: 'cancel',
        },
        {
          text: this.t('common.finish'),
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-twelve />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepTwelve],
})
export default class TrapsStepTwelve {}
