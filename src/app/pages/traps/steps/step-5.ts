import { Component, inject, signal } from '@angular/core';
import StepPage from '@app/pages/acting/steps';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'traps-form-step-five',
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <ion-grid>
      <ion-row class="justify-center">
        @for (option of options; track option) {
        <ion-col class="p-2" size="12" size-md="6">
          <ion-card
            class="ion-text-center h-40 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
            [class.ring-2]="selectedOption() === option"
            [class.ring-primary]="selectedOption() === option"
            (click)="onSelect(option)"
          >
            <ion-card-content>
              <h2 class="text-2xl font-bold">{{ option }}</h2>
            </ion-card-content>
          </ion-card>
        </ion-col>
        }
      </ion-row>
    </ion-grid>
  `,
})
export class TrapsFormStepFive {
  #store = inject(StoreService);
  options = ['Captura'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-five',
  template: `
    <step-page>
      <traps-form-step-five />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepFive],
})
export default class TrapsStepFive {}
