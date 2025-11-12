import { Component } from '@angular/core';
import StepPanel from '@components/step-panel';
import SessionHeaderComponent from '@components/session-header';
import ModalInput from '@components/modal-input';

@Component({
  selector: 'app-form-step',
  template: `
    <app-step-panel title="Form">
      <app-session-header />
      <app-modal-input />
    </app-step-panel>
  `,
  imports: [StepPanel, SessionHeaderComponent, ModalInput],
})
export default class ListStep {}
