import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsStoreService from '@service/traps-store.service';

@Component({
  selector: 'traps-form-step-four',
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
export class TrapsFormStepFour {
  #store = inject(TrapsStoreService);
  options = ['Atrapado'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-four',
  template: `
    <step-page>
      <traps-form-step-four />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepFour],
})
export default class TrapsStepFour {}
