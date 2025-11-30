import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/angular/standalone';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-three',
  imports: [IonGrid, IonRow, IonCol, IonCard, IonCardContent],
  template: `
    <ion-grid>
      <ion-row>
        @for (num of numbers; track num) {
        <ion-col class="p-2" size="6" size-md="4" size-lg="3">
          <ion-card
            class="ion-text-center h-32 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
            [class.ring-2]="selectedNumber() === num"
            [class.ring-primary]="selectedNumber() === num"
            (click)="onSelect(num)"
          >
            <ion-card-content>
              <h2 class="text-3xl font-bold">{{ num }}</h2>
            </ion-card-content>
          </ion-card>
        </ion-col>
        }
      </ion-row>
    </ion-grid>
  `,
})
export class FormStepThree {
  #store = inject(StoreService);
  numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'step-three',
  template: `
    <step-page>
      <form-step-three />
    </step-page>
  `,
  imports: [StepPage, FormStepThree],
})
export default class StepThree {}
