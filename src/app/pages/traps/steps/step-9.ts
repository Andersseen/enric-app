import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-nine',
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
export class TrapsFormStepNine {
  #store = inject(TrapsStoreService);
  options = ['Si', 'No'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-nine',
  template: `
    <step-page>
      <traps-form-step-nine />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepNine],
})
export default class TrapsStepNine {}
