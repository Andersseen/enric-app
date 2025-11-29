import { Component, inject } from '@angular/core';
import StepPage from '.';
import { IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-eleven',
  imports: [IonCard, IonCardContent, IonTextarea],
  template: `
    <ion-card class="min-h-64">
      <ion-card-content class="h-full">
        <ion-textarea
          class="h-full text-xl"
          label="Observaciones"
          labelPlacement="floating"
          placeholder="Escribe tus observaciones aquí..."
          [autoGrow]="true"
          [rows]="6"
          (ionInput)="onInput($event)"
        ></ion-textarea>
      </ion-card-content>
    </ion-card>
  `,
})
export class FormStepEleven {
  #store = inject(StoreService);

  onInput(event: any) {
    const value = event.target.value;
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-eleven',
  template: `
    <step-page>
      <form-step-eleven />
    </step-page>
  `,
  imports: [StepPage, FormStepEleven],
})
export default class StepEleven {}
