import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import StepPage from '.';
import TrapsActionsStore from '@service/traps-store';

@Component({
  selector: 'traps-form-step-four',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  #store = inject(TrapsActionsStore);
  options = ['Atrapado'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-four',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-four />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepFour],
})
export default class TrapsStepFour {}
