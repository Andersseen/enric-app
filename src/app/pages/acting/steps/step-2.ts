import { ChangeDetectionStrategy, Component } from '@angular/core';
import FilterBirds from '@components/filter-birds';
import StepPage from '.';

@Component({
  selector: 'app-list-step',
  template: `
    <step-page>
      <app-filter-birds />
    </step-page>
  `,
  imports: [FilterBirds, StepPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListStep {}
