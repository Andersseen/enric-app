import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-six',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      colSize="12"
      colSizeMd="6"
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
})
export class FormStepSix {
  #store = inject(StoreService);
  options = ['Si', 'No'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'step-six',
  template: `
    <step-page>
      <form-step-six />
    </step-page>
  `,
  imports: [StepPage, FormStepSix],
})
export default class StepSix {}
