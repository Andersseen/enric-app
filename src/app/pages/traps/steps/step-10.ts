import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-ten',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
  `,
})
export class TrapsFormStepTen {
  #store = inject(TrapsStoreService);
  numbers = Array.from({ length: 6 }, (_, i) => i + 1);
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
  }
}

@Component({
  selector: 'traps-step-ten',
  template: `
    <step-page>
      <traps-form-step-ten />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepTen],
})
export default class TrapsStepTen {}
