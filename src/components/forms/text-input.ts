import { Component, input, output } from '@angular/core';
import { IonCard, IonCardContent, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-text-input',
  imports: [IonCard, IonCardContent, IonTextarea],
  template: `
    <ion-card class="min-h-64 rounded-2xl shadow-sm border">
      <ion-card-content class="h-full flex flex-col">
        <ion-textarea
          class="flex-1 text-xl font-medium"
          [label]="label()"
          labelPlacement="floating"
          [placeholder]="placeholder()"
          [autoGrow]="true"
          [rows]="6"
          [value]="value()"
          (ionInput)="onInput($event)"
        ></ion-textarea>
      </ion-card-content>
    </ion-card>
  `,
  styles: `
    ion-textarea {
      --padding-start: 0;
      --padding-end: 0;
    }
  `,
})
export default class TextInputComponent {
  label = input.required<string>();
  placeholder = input<string>('Escribe aquí...');
  value = input<string | null>(null);

  valueChange = output<string>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
