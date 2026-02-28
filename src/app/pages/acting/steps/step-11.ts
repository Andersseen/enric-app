import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import ActionsStore from '@service/actions-store';

@Component({
  selector: 'form-step-eleven',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="numbers"
      [selected]="selectedNumber()"
      (select)="onSelect($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStepEleven {
  #store = inject(ActionsStore);
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 50, 100, 200, 300, 500];
  selectedNumber = signal<number | null>(null);

  onSelect(num: number) {
    this.selectedNumber.set(num);
    this.#store.setValueForCurrentStep(this.selectedNumber());
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
