import { Component, computed, inject } from '@angular/core';
import {
  IonInput,
  IonItem,
  IonSelect,
  IonList,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonButton,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import StoreService from '@service/state';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    IonInput,
    IonItem,
    IonSelect,
    IonList,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonButton,
  ],
  template: `
    <form>
      <ion-list class="flex flex-col gap-4" [formGroup]="form">
        <ion-item>
          <ion-input label="Area" formControlName="zoneId" class="text-end" />
        </ion-item>

        <ion-item>
          <ion-input label="Especie" formControlName="speciesId" class="text-end" />
        </ion-item>

        <ion-item>
          <ion-input
            label="Cuantas"
            type="number"
            formControlName="count"
            placeholder="00"
            class="text-end"
          />
        </ion-item>

        <ion-item>
          <ion-select interface="action-sheet" label="Actitud" formControlName="behavior">
            <ion-select-option>Posado</ion-select-option>
            <ion-select-option>Volando</ion-select-option>
            <ion-select-option>Cruzando</ion-select-option>
            <ion-select-option>Alimentación</ion-select-option>
            <ion-select-option>Atrapado</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-segment formControlName="actionType">
            <ion-segment-button value="Prevención">Prevención</ion-segment-button>
            <ion-segment-button value="Dispersión">Dispersión</ion-segment-button>
          </ion-segment>
        </ion-item>

        <ion-item>
          <ion-select
            interface="action-sheet"
            label="Interacción operación"
            formControlName="interaction"
          >
            <ion-select-option>Si</ion-select-option>
            <ion-select-option>No</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-select interface="action-sheet" label="Método empleado" formControlName="method">
            <ion-select-option>Claxon</ion-select-option>
            <ion-select-option>Sonido</ion-select-option>
            <ion-select-option>Fogueo</ion-select-option>
            <ion-select-option>Laser</ion-select-option>
            <ion-select-option>Vuelo dispersión halcón</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-textarea
            label="Animal empleado"
            placeholder="Escribe algo..."
            formControlName="animal"
            class="text-end"
          ></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-select interface="action-sheet" label="Eficacia" formControlName="efficacy">
            <ion-select-option>Si</ion-select-option>
            <ion-select-option>No</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-input
            label="Captura número individuo"
            type="number"
            formControlName="captured"
            placeholder="00"
            class="text-end"
          />
        </ion-item>

        <ion-item>
          <ion-textarea
            label="Observaciones"
            placeholder="Escribe algo..."
            formControlName="notes"
            class="text-end"
          ></ion-textarea>
        </ion-item>
      </ion-list>
      <ion-button (click)="save()" expand="block">Guardar</ion-button>
    </form>
  `,
})
export default class Form {
  #store = inject(StoreService);

  zone = computed(() => this.#store.step1Value());
  bird = computed(() => this.#store.step2Value());

  form = inject(FormBuilder).group({
    zoneId: [{ value: this.zone()?.id, disabled: true }],
    speciesId: [{ value: this.bird()?.commonName, disabled: true }],

    count: [0, [Validators.required, Validators.min(0)]],
    behavior: [''],
    actionType: ['Prevención'],
    interaction: [''],
    method: [''],
    animal: [''],
    efficacy: [''],
    captured: [0, Validators.min(0)],
    notes: [''],
  });

  save() {
    // console.log(this.form.getRawValue());

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.generate();
  }

  generate() {
    const data = this.form.getRawValue();

    const rows = [
      ['Campo', 'Valor'],
      ['Zona ID', data.zoneId],
      ['Especie', data.speciesId],
      ['Cuántas', data.count],
      ['Actitud', data.behavior],
      ['Tipo acción', data.actionType],
      ['Interacción operación', data.interaction],
      ['Método empleado', data.method],
      ['Animal empleado', data.animal],
      ['Eficacia', data.efficacy],
      ['Capturas', data.captured],
      ['Observaciones', data.notes],
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
