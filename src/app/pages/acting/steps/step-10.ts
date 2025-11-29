import { Component, inject } from '@angular/core';
import StepPage from '.';
import { IonCard, IonCardContent, IonInput } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-ten',
  imports: [IonCard, IonCardContent, IonInput],
  template: `
    <ion-card>
      <ion-card-content class="flex flex-col items-center justify-center py-12">
        <ion-input
          type="number"
          label="Captura número individuo"
          labelPlacement="stacked"
          placeholder="0"
          class="text-6xl font-bold ion-text-center"
          (ionInput)="onInput($event)"
        ></ion-input>
      </ion-card-content>
    </ion-card>
  `,
})
export class FormStepTen {
  #store = inject(StoreService);

  onInput(event: any) {
    const value = event.target.value;
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-ten',
  template: `
    <step-page>
      <form-step-ten />
    </step-page>
  `,
  imports: [StepPage, FormStepTen],
})
export default class StepTen {}
