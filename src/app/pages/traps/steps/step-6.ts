import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-six',
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
export class TrapsFormStepSix {
  #store = inject(TrapsStoreService);
  options = ['Si', 'No'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-six',
  template: `
    <step-page>
      <traps-form-step-six />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepSix],
})
export default class TrapsStepSix {}
