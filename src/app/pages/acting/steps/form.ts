import { Component } from '@angular/core';
import ModalInput from '@components/modal-input';
import StepPage from './';

@Component({
  selector: 'app-form-step',
  template: `
    <step-page>
      <app-modal-input />
    </step-page>
  `,
  imports: [ModalInput, StepPage],
})
export default class ListStep {}
