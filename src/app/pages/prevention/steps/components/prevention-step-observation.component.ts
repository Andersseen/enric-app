import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonTextarea,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { injectT } from '@etyma/angular';
import { i18n } from '@i18n/i18n';

@Component({
  selector: 'app-prevention-step-observation',
  imports: [IonCard, IonCardContent, IonButton, IonIcon, IonTextarea, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-card>
      <ion-card-content>
        <h2 class="text-xl font-bold mb-4">{{ t('common.observations') }}</h2>

        <ion-textarea
          [label]="t('common.details')"
          labelPlacement="floating"
          fill="outline"
          rows="10"
          [placeholder]="t('common.writeObservations')"
          [(ngModel)]="value"
          (ngModelChange)="valueChange.emit($event)"
        ></ion-textarea>

        <div class="mt-6">
          <ion-button expand="block" (click)="save.emit()">
            {{ t('common.saveToTable') }}
            <ion-icon slot="end" name="save-outline"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  `,
})
export default class PreventionStepObservationComponent {
  protected t = injectT(i18n);
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();

  constructor() {
    addIcons({ saveOutline });
  }
}
