import { Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsStoreService from '@service/traps-store.service';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-seven',
  imports: [SelectionGridComponent],
  template: `
    <app-selection-grid
      [items]="options"
      [selected]="selectedOption()"
      (select)="onSelect($event)"
    />
  `,
})
export class TrapsFormStepSeven {
  #store = inject(TrapsStoreService);
  options = ['Bal-chatri', 'Lazo', 'Jaula trampa', 'Manual', 'capillo'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-seven',
  template: `
    <step-page>
      <traps-form-step-seven />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepSeven],
})
export default class TrapsStepSeven {}
