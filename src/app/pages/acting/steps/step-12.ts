import { Component, inject, computed } from '@angular/core';
import StepPage from '.';
import {
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import StoreService from '@service/state';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';

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

        <div class="mt-4">
          <ion-button expand="block" (click)="generate()">
            <ion-icon slot="start" name="download-outline"></ion-icon>
            Generar Excel
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export class FormStepTwelve {
  #store = inject(StoreService);

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

  constructor() {
    addIcons({ downloadOutline });
  }

  generate() {
    const rows = [
      ['Campo', 'Valor'],
      ['Zona ID', this.zone()?.name || ''],
      ['Especie', this.bird()?.commonName || ''],
      ['Cuántas', this.count() || 0],
      ['Actitud', this.behavior() || ''],
      ['Tipo acción', this.actionType() || ''],
      ['Interacción operación', this.interaction() || ''],
      ['Método empleado', this.method() || ''],
      ['Animal empleado', this.animal() || ''],
      ['Eficacia', this.efficacy() || ''],
      ['Capturas', this.captured() || 0],
      ['Observaciones', this.notes() || ''],
      ['Fecha registro', new Date().toLocaleString()],
    ];

    // crear worksheet
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // crear workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Actuación');

    // escribir archivo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(file, 'actuacion.xlsx');
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
