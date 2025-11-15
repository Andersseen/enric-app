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
} from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'app-form',
  imports: [
    IonInput,
    IonItem,
    IonSelect,
    IonList,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
  ],
  template: `
    <ion-list class="flex flex-col gap-4">
      <ion-item>
        <ion-input label="Area" [value]="zone().id" [disabled]="true" />
      </ion-item>
      <ion-item>
        <ion-input label="Especie" [value]="bird().commonName" [disabled]="true" />
      </ion-item>
      <ion-item>
        <ion-input label="Cuantas" type="number" placeholder="00" class="text-end" />
      </ion-item>
      <ion-item>
        <ion-select interface="action-sheet" label="Actitud">
          <ion-select-option>Posado</ion-select-option>
          <ion-select-option>Volando</ion-select-option>
          <ion-select-option>Cruzando</ion-select-option>
          <ion-select-option>Alimentación</ion-select-option>
          <ion-select-option>Atrapado</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-segment value="Prevención">
          <ion-segment-button value="Prevención"> Prevención </ion-segment-button>
          <ion-segment-button value="Dispersión"> Dispersión </ion-segment-button>
        </ion-segment>
      </ion-item>
      <ion-item>
        <ion-select interface="action-sheet" label="Interacción operación">
          <ion-select-option>Si</ion-select-option>
          <ion-select-option>No</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-select interface="action-sheet" label="Método empleado">
          <ion-select-option>Claxon</ion-select-option>
          <ion-select-option>Sonido</ion-select-option>
          <ion-select-option>Fogueo</ion-select-option>
          <ion-select-option>Laser</ion-select-option>
          <ion-select-option>Vuelo dispersión halcón</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-textarea label="Animal empleado" placeholder="Escribe algo..."></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-select interface="action-sheet" label="Eficacia">
          <ion-select-option>Si</ion-select-option>
          <ion-select-option>No</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-input
          label="Captura número individuo"
          type="number"
          placeholder="00"
          class="text-end"
        />
      </ion-item>
      <ion-item>
        <ion-textarea label="Observaciones" placeholder="Escribe algo..."></ion-textarea>
      </ion-item>
    </ion-list>
  `,
  host: { class: 'block h-full w-full font-sans antialiased' },
})
export default class Form {
  #store = inject(StoreService);

  zone = computed(() => this.#store.step1Value());
  bird = computed(() => this.#store.step2Value());
}
