import { Component, inject, signal } from '@angular/core';
import StepPage from '.';
import SelectionGridComponent from '@components/forms/selection-grid';
import StoreService from '@service/state';

@Component({
  selector: 'form-step-four',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
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
