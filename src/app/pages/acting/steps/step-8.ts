import { Component, inject } from '@angular/core';
import StepPage from '.';
import { IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-eight',
  imports: [IonCard, IonCardContent, IonTextarea],
  template: `
    <ion-card class="min-h-64">
      <ion-card-content class="h-full">
        <ion-textarea
          class="h-full text-xl"
          label="Animal empleado"
          labelPlacement="floating"
          placeholder="Escribe aquí..."
          [autoGrow]="true"
          [rows]="6"
          (ionInput)="onInput($event)"
        ></ion-textarea>
      </ion-card-content>
    </ion-card>
  `,
})
export class FormStepEight {
  #store = inject(StoreService);

  onInput(event: any) {
    const value = event.target.value;
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'step-eight',
  template: `
    <step-page>
      <form-step-eight />
    </step-page>
  `,
  imports: [StepPage, FormStepEight],
})
export default class StepEight {}
