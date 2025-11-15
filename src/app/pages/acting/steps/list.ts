import { Component, signal } from '@angular/core';
import StepPanel from '@components/step-panel';
import FilterBirds from '@components/filter-birds';
import { BirdItem } from '@data/bird';

@Component({
  selector: 'app-list-step',
  template: `
    <app-step-panel title="Lista" [canGoForward]="finish()">
      <app-filter-birds (birdSelected)="selectedBird($event)" />
    </app-step-panel>
  `,
  imports: [StepPanel, FilterBirds],
})
export default class ListStep {
  finish = signal(false);

  selectedBird(bird: BirdItem | null) {
    if (!bird) return;
    this.finish.set(true);
  }
}
