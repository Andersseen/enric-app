import { Component, input, model } from '@angular/core';
import { BirdItem } from '@data/bird';
import {
  IonButton,
  IonContent,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonInput,
  IonItem,
  IonSelect,
  IonList,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-input',
  imports: [
    IonButton,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonInput,
    IonItem,
    IonSelect,
    IonList,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRadioGroup,
    IonRadio,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ bird().commonName }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="isModalOpen.set(false)">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list class="flex flex-col gap-4">
        <ion-item>
          <ion-input label="Cuantas" type="number" placeholder="00" />
        </ion-item>
        <ion-item>
          <ion-select label="Actitud">
            <ion-select-option>Posado</ion-select-option>
            <ion-select-option>Volando</ion-select-option>
            <ion-select-option>Cruzando</ion-select-option>
            <ion-select-option>Alimentación</ion-select-option>
            <ion-select-option>Atrapado</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-segment value="Prevención">
            <ion-segment-button value="Prevención">
              <ion-label>Prevención</ion-label>
            </ion-segment-button>
            <ion-segment-button value="Dispersión">
              <ion-label>Dispersión</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-item>
        <ion-item>
          Interacción operación:
          <ion-radio-group value="strawberries">
            <ion-radio value="Si">Si</ion-radio>
            <ion-radio value="No">No</ion-radio>
          </ion-radio-group>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class ModalInput {
  bird = input.required<BirdItem>();
  isModalOpen = model(false);
}
