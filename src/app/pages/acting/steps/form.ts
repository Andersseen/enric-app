import { Component } from '@angular/core';
import StepPanel from '@components/step-panel';
import ModalInput from '@components/modal-input';

@Component({
  selector: 'app-form-step',
  template: `
    <app-step-panel title="Form">
      <app-modal-input />
    </app-step-panel>
  `,
  imports: [StepPanel, ModalInput],
})
export default class ListStep {}
