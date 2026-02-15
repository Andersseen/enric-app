import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import SelectionGridComponent from '@components/forms/selection-grid';
import TrapsActionsStore from '@service/traps-store';
import StepPage from '.';

@Component({
  selector: 'traps-form-step-seven',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  #store = inject(TrapsActionsStore);
  options = ['Bal-chatri', 'Lazo', 'Jaula trampa', 'Manual', 'capillo'];
  selectedOption = signal<string | null>(null);

  onSelect(option: string) {
    this.selectedOption.set(option);
    this.#store.setValueForCurrentStep(this.selectedOption());
  }
}

@Component({
  selector: 'traps-step-seven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <step-page>
      <traps-form-step-seven />
    </step-page>
  `,
  imports: [StepPage, TrapsFormStepSeven],
})
export default class TrapsStepSeven {}
