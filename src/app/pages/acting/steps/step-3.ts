import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-three',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
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
