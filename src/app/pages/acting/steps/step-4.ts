import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-four',
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <ion-grid>
      <ion-row>
        @for (option of options; track option) {
        <ion-col class="p-2" size="6" size-md="4" size-lg="3">
          <ion-card
            class="ion-text-center h-32 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
            [class.ring-2]="selectedOption() === option"
            [class.ring-primary]="selectedOption() === option"
            (click)="onSelect(option)"
          >
            <ion-card-content>
              <h2 class="text-xl font-bold">{{ option }}</h2>
            </ion-card-content>
          </ion-card>
        </ion-col>
        }
      </ion-row>
    </ion-grid>
  `,
})
export class FormStepFour {
  #store = inject(StoreService);
  options = ['Posado', 'Volando', 'Cruzando', 'Alimentación', 'Atrapado'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-four',
  template: `
    <step-page>
      <form-step-four />
    </step-page>
  `,
  imports: [StepPage, FormStepFour],
})
export default class StepFour {}
