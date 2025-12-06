import { Component, inject } from '@angular/core';
import StepPage from '@app/pages/acting/steps';

import { IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'traps-form-step-eight',
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
export class TrapsFormStepEight {
  #store = inject(StoreService);

  onInput(event: any) {
    const value = event.target.value;
    this.#store.setValueForCurrentStep(value);
  }
}

@Component({
  selector: 'traps-step-eight',
  template: `
    <step-page>
      <traps-form-step-eight />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepEight],
})
export default class TrapsStepEight {}
