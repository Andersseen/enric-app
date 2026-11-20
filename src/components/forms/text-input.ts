import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonCard, IonCardContent, IonTextarea } from '@ionic/angular';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonCard, IonCardContent, IonTextarea],
  template: `
    <ion-card class="min-h-64 rounded-2xl shadow-sm border">
      <ion-card-content class="h-full flex flex-col">
        <ion-textarea
          class="flex-1 text-xl font-medium"
          [label]="label()"
          labelPlacement="floating"
          [placeholder]="placeholder() ?? t('common.writeHere')"
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
  protected t = injectT(i18n);
  label = input.required<string>();
  placeholder = input<string | null>(null);
  value = input<string | null>(null);

  valueChange = output<string>();

  onInput(event: any) {
    this.valueChange.emit(event.target.value);
  }
}
