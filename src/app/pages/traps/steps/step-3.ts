import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsStoreService from '@service/traps-store.service';

@Component({
  selector: 'traps-form-step-three',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
  `,
})
export class TrapsFormStepThree {
  #store = inject(TrapsStoreService);
  numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'traps-step-three',
  template: `
    <step-page>
      <traps-form-step-three />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepThree],
})
export default class TrapsStepThree {}
