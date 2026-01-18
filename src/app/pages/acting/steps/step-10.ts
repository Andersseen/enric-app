import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import StoreService from '@service/actions-store';

@Component({
  selector: 'form-step-ten',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
  `,
})
export class FormStepTen {
  #store = inject(StoreService);
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 50, 100, 200, 300, 500];
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
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
